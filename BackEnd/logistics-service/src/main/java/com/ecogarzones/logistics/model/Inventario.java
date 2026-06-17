package com.ecogarzones.logistics.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "inventario")
public class Inventario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "item_nombre", nullable = false)
    private String itemNombre;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(nullable = false)
    private String categoria; // e.g., Cristalería, Vajilla, Mantelería, Uniformes

    @Column(nullable = false)
    private String unidad; // e.g., unidades, set, cajas
}
