package com.ecogarzones.backend.controller;

import com.ecogarzones.backend.model.Evento;
import com.ecogarzones.backend.model.Minuta;
import com.ecogarzones.backend.repository.EventoRepository;
import com.ecogarzones.backend.repository.MinutaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/eventos")
@CrossOrigin(origins = "http://localhost:5173") // Allow frontend requests
public class EventoController {

    @Autowired
    private EventoRepository eventoRepository;
    
    @Autowired
    private MinutaRepository minutaRepository;

    // Get all events
    @GetMapping
    public List<Evento> getAllEventos() {
        return eventoRepository.findAll();
    }
    
    // Get client's petitions
    @GetMapping("/mis-peticiones")
    public ResponseEntity<List<Evento>> getMisPeticiones() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        // Here we could filter in repository, but for simplicity we'll stream:
        List<Evento> misEventos = eventoRepository.findAll().stream()
                .filter(e -> e.getClientEmail() != null && e.getClientEmail().equalsIgnoreCase(email))
                .toList();
        return ResponseEntity.ok(misEventos);
    }

    // Create a new quote/event
    @PostMapping
    public ResponseEntity<Evento> createEvento(@RequestBody EventoRequest request) {
        Evento nuevoEvento = new Evento();
        nuevoEvento.setClientName(request.getClientName());
        nuevoEvento.setClientEmail(request.getClientEmail());
        nuevoEvento.setEventType(request.getEventType());
        nuevoEvento.setDate(request.getDate());
        nuevoEvento.setGuests(request.getGuests());
        nuevoEvento.setBarId(request.getBarId());
        
        Optional<Minuta> optMinuta = minutaRepository.findById(request.getMinutaId());
        if (optMinuta.isPresent()) {
            Minuta minuta = optMinuta.get();
            nuevoEvento.setMinuta(minuta);
            // Calculate total price: guests * menu price + some base cost for bar or operations
            double baseOperatingCost = 500000.0;
            double calculatedPrice = (minuta.getPrecioPorPersona() * request.getGuests()) + baseOperatingCost;
            nuevoEvento.setTotalPrice(calculatedPrice);
            nuevoEvento.setCost(baseOperatingCost); // Simple assumption
        } else {
            return ResponseEntity.badRequest().build();
        }

        nuevoEvento.setStatus("PENDIENTE");
        nuevoEvento.setCreatedAt(java.time.LocalDate.now().toString());
        
        return ResponseEntity.ok(eventoRepository.save(nuevoEvento));
    }

    // Update status (Aceptar/Rechazar)
    @PutMapping("/{id}/estado")
    public ResponseEntity<Evento> updateEstado(@PathVariable Long id, @RequestBody String nuevoEstado) {
        String cleanEstado = nuevoEstado.replace("\"", "").trim().toUpperCase();
        
        Optional<Evento> optionalEvento = eventoRepository.findById(id);
        if (optionalEvento.isPresent()) {
            Evento evento = optionalEvento.get();
            evento.setStatus(cleanEstado);
            
            // Recalculate if approved? 
            if ("APROBADO".equals(cleanEstado)) {
                evento.setCost(Math.round(evento.getTotalPrice() * 0.6 * 100.0) / 100.0);
            }
            
            Evento actualizado = eventoRepository.save(evento);
            return ResponseEntity.ok(actualizado);
        }
        return ResponseEntity.notFound().build();
    }
    
    // DTO for creating
    static class EventoRequest {
        private String clientName;
        private String clientEmail;
        private String eventType;
        private String date;
        private Integer guests;
        private Long minutaId;
        private String barId;

        // Getters and Setters
        public String getClientName() { return clientName; }
        public void setClientName(String clientName) { this.clientName = clientName; }
        public String getClientEmail() { return clientEmail; }
        public void setClientEmail(String clientEmail) { this.clientEmail = clientEmail; }
        public String getEventType() { return eventType; }
        public void setEventType(String eventType) { this.eventType = eventType; }
        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }
        public Integer getGuests() { return guests; }
        public void setGuests(Integer guests) { this.guests = guests; }
        public Long getMinutaId() { return minutaId; }
        public void setMinutaId(Long minutaId) { this.minutaId = minutaId; }
        public String getBarId() { return barId; }
        public void setBarId(String barId) { this.barId = barId; }
    }
}
