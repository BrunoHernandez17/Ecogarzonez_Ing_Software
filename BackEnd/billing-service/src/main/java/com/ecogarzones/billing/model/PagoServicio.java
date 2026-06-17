package com.ecogarzones.billing.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "ms_pago_servicio")
public class PagoServicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "evento_id", nullable = false)
    private Long eventoId; // Referencia al microservicio de eventos

    @Column(nullable = false)
    private Double monto;

    @Column(name = "fecha_pago", nullable = false)
    private LocalDateTime fechaPago;

    @Column(name = "metodo_pago", nullable = false)
    private String metodoPago; // Transbank, Stripe, Transferencia

    @Column(name = "transaccion_id", unique = true, nullable = false)
    private String transaccionId; // ID o Token devuelto por la pasarela de pagos

    @Column(name = "estado_transaccion", nullable = false)
    private String estadoTransaccion; // APROBADO, RECHAZADO, PENDIENTE
}
