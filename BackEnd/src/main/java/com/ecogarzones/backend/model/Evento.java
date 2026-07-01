package com.ecogarzones.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "eventos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "client_name", nullable = false)
    private String clientName;

    @Column(name = "client_email", nullable = false)
    private String clientEmail;

    @Column(name = "event_type", nullable = false)
    private String eventType;

    @Column(name = "event_date", nullable = false)
    private String date;

    @Column(name = "guests_count", nullable = false)
    private Integer guests;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "minuta_id")
    private Minuta minuta;

    @Column(name = "bar_id") // Could become another entity later, keeping it as string for now
    private String barId;

    @Column(name = "total_price", nullable = false)
    private Double totalPrice;

    @Column(name = "operating_cost", nullable = false)
    private Double cost;

    @Column(name = "status", nullable = false)
    private String status = "PENDIENTE"; // PENDIENTE, APROBADO, RECHAZADO

    @Column(name = "created_at")
    private String createdAt;
}
