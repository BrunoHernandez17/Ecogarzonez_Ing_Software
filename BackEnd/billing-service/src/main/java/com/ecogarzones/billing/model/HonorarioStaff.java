package com.ecogarzones.billing.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "ms_honorario_staff")
public class HonorarioStaff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "staff_id", nullable = false)
    private Long staffId; // Referencia al microservicio de logística (Ficha del Garzón/Chef)

    @Column(name = "evento_id", nullable = false)
    private Long eventoId; // Referencia al evento trabajado

    @Column(name = "horas_trabajadas", nullable = false)
    private Double horasTrabajadas;

    @Column(name = "tarifa_hora", nullable = false)
    private Double tarifaHora;

    @Column(name = "monto_total", nullable = false)
    private Double montoTotal; // horasTrabajadas * tarifaHora

    @Column(name = "estado_pago", nullable = false)
    private String estadoPago; // LIQUIDADO, PENDIENTE, EN_PROCESO
}
