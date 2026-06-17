package com.ecogarzones.logistics.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "documento")
public class Documento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "evento_id", nullable = false)
    private Long eventId; // Referencia al evento del documento

    @Column(name = "tipo_documento", nullable = false)
    private String tipoDocumento; // CONTRATO, GUIA_DESPACHO, FACTURA

    @Column(name = "archivo_url", nullable = false)
    private String archivoUrl; // URL del archivo almacenado (ej: OCI Object Storage)

    @Column(name = "fecha_generacion", nullable = false)
    private LocalDateTime fechaGeneracion;
}
