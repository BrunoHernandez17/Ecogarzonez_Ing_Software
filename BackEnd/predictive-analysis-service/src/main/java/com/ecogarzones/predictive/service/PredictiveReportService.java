package com.ecogarzones.predictive.service;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class PredictiveReportService {

    /**
     * Genera un reporte estadístico predictivo basado en el histórico del tipo de evento.
     * Guardado en caché de Redis para evitar cálculos repetitivos.
     */
    @Cacheable(value = "informesPredictivos", key = "#eventType")
    public PredictiveReport getPredictionForEventType(String eventType, int expectedEvents) {
        // Simulación de análisis estadístico
        // En producción, esto consultaría a logistics-service y event-service, calculando modelos lineales.
        try {
            Thread.sleep(1500); // Simulamos latencia del cálculo pesado para demostrar utilidad de caché
        } catch (InterruptedException ignored) {}

        double avgGuests = "Cena".equalsIgnoreCase(eventType) ? 120.0 : 85.0;
        double estimatedGuests = avgGuests * expectedEvents;
        
        // Predicción de insumos clave en kg
        Map<String, Double> insumosProyectados = new HashMap<>();
        if ("Cena".equalsIgnoreCase(eventType)) {
            insumosProyectados.put("Proteína (Vacuno/Ave)", estimatedGuests * 0.250);
            insumosProyectados.put("Acompañamiento (Papas/Vegetales)", estimatedGuests * 0.150);
            insumosProyectados.put("Líquidos (Vino/Bebidas L)", estimatedGuests * 0.400);
        } else {
            insumosProyectados.put("Café en Grano", estimatedGuests * 0.015);
            insumosProyectados.put("Lácteos (L)", estimatedGuests * 0.100);
            insumosProyectados.put("Bocadillos (unidades)", estimatedGuests * 5.0);
        }

        // Predicción de dotación staff necesaria
        int garzones = (int) Math.ceil(estimatedGuests / 15.0);
        int chefs = (int) Math.ceil(estimatedGuests / 40.0);
        int supervisors = expectedEvents;

        double estimatedCost = estimatedGuests * ("Cena".equalsIgnoreCase(eventType) ? 45.0 : 25.0);
        double predictedRevenue = estimatedCost * 1.35; // Margen de ganancia corporativo del 35%

        return new PredictiveReport(
                eventType,
                expectedEvents,
                (int) estimatedGuests,
                insumosProyectados,
                garzones + chefs + supervisors,
                estimatedCost,
                predictedRevenue
        );
    }

    @Data
    @AllArgsConstructor
    public static class PredictiveReport {
        private String eventType;
        private int simulatedEventsCount;
        private int totalExpectedGuests;
        private Map<String, Double> projectedIngredients;
        private int requiredStaffTotal;
        private double estimatedOperationCost;
        private double predictedRevenue;
    }
}
