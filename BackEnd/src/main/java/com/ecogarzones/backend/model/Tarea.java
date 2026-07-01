package com.ecogarzones.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tareas")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Tarea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evento_id", nullable = false)
    private Evento evento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id", nullable = false)
    private Usuario staff;

    @Enumerated(EnumType.STRING)
    @Column(name = "rol_asignado", nullable = false)
    private Rol rolAsignado; // CHEF, GARZON, ASEO, BARTENDER

    @Column(name = "detalle", length = 1000)
    private String detalle; // e.g. "Mesa 4", "Limpieza de piso completo", "Preparar Menú X"
}
