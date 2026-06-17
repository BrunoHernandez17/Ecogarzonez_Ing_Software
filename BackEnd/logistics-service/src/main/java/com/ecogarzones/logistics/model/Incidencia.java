package com.ecogarzones.logistics.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "incidencia")
public class Incidencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "evento_id", nullable = false)
    private Long eventId; // Referencia al evento afectado

    @Column(name = "staff_id", nullable = false)
    private Long staffId; // Quién reportó la incidencia (referencia a Staff)

    @Column(columnDefinition = "TEXT", nullable = false)
    private String descripcion;

    @Column(nullable = false)
    private String gravedad; // BAJA, MEDIA, ALTA

    @Column(name = "fecha_reporte", nullable = false)
    private LocalDateTime fechaReporte;

    @Column(nullable = false)
    private Boolean resuelta;
}
