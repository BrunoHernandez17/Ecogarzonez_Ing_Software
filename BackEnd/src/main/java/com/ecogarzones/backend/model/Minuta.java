package com.ecogarzones.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "minutas")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Minuta {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "descripcion", length = 1000)
    private String descripcion;

    @Column(name = "precio_por_persona", nullable = false)
    private Double precioPorPersona;

    @Column(name = "estado", nullable = false)
    private String estado = "PENDIENTE"; // PENDIENTE, APROBADA, RECHAZADA

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chef_id")
    private Usuario chef; // The chef who proposed the menu
}
