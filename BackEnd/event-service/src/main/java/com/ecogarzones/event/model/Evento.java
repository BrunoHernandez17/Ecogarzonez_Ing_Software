package com.ecogarzones.event.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "ms_evento")
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(name = "tipo_evento", nullable = false)
    private String tipoEvento; // Cena, Almuerzo, Coffee Break, Coctel

    @Column(name = "fecha_evento", nullable = false)
    private LocalDate fechaEvento;

    @Column(nullable = false)
    private String ubicacion;

    @Column(name = "cantidad_asistentes", nullable = false)
    private Integer cantidadAsistentes;

    @Column(nullable = false)
    private String estado; // CREADO, PLANIFICADO, EN_EJECUCION, FINALIZADO

    @Column(name = "costo_estimado")
    private Double costoEstimado;

    @Column(columnDefinition = "TEXT")
    private String notas;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "menu_id", nullable = false)
    private Menu menu;
}
