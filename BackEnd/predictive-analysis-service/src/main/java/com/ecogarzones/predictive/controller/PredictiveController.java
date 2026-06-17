package com.ecogarzones.predictive.controller;

import com.ecogarzones.predictive.service.PredictiveReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/predictive")
@CrossOrigin(origins = "*")
@Tag(name = "Análisis Predictivo", description = "Endpoints de inteligencia de negocio y proyección logística")
public class PredictiveController {

    private final PredictiveReportService reportService;

    public PredictiveController(PredictiveReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/report")
    @Operation(summary = "Obtener proyección predictiva de insumos", description = "Genera un reporte estimado de costos, insumos y staff en base a la cantidad de eventos planificados.")
    public ResponseEntity<?> getPredictiveReport(
            @RequestParam String eventType,
            @RequestParam(defaultValue = "5") int expectedEvents
    ) {
        if (expectedEvents <= 0) {
            return ResponseEntity.badRequest().body("La cantidad de eventos esperada debe ser mayor a cero");
        }
        return ResponseEntity.ok(reportService.getPredictionForEventType(eventType, expectedEvents));
    }
}
