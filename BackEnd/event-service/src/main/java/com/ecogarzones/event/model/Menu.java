package com.ecogarzones.event.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "menu")
public class Menu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    private String descripcion;

    @Column(name = "precio_por_persona", nullable = false)
    private Double precioPorPersona;

    @Column(name = "gramaje_base_detalles", length = 1000)
    private String gramajeBaseDetalles; // Representación JSON o texto de ingredientes y gramajes por persona
}
