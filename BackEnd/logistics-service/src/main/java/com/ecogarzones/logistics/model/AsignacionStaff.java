package com.ecogarzones.logistics.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "asignacion_staff")
public class AsignacionStaff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "staff_id", nullable = false)
    private Staff staff;

    @Column(name = "evento_id", nullable = false)
    private Long eventId; // Referencia al microservicio de eventos

    @Column(name = "rol_asignado", nullable = false)
    private String rolAsignado; // Rol específico desempeñado en este evento

    @Column(name = "confirmar_disponibilidad")
    private Boolean confirmarDisponibilidad; // Si el staff aceptó el turno

    @Column(name = "check_in_time")
    private LocalDateTime checkInTime; // Hora de llegada digital

    @Column(name = "check_out_time")
    private LocalDateTime checkOutTime; // Hora de salida digital

    @Column(name = "traslado_confirmado")
    private Boolean trasladoConfirmado; // Confirmación de llegada al vehículo logístico
}
