package com.ecogarzones.backend.controller;

import com.ecogarzones.backend.model.Minuta;
import com.ecogarzones.backend.repository.MinutaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/minutas")
@RequiredArgsConstructor
public class MinutaController {

    private final MinutaRepository minutaRepository;

    @GetMapping
    public List<Minuta> getAllMinutas() {
        return minutaRepository.findAll();
    }

    @GetMapping("/aprobadas")
    public List<Minuta> getAprobadas() {
        return minutaRepository.findByEstado("APROBADA");
    }

    @PostMapping
    public ResponseEntity<Minuta> createMinuta(@RequestBody Minuta minuta) {
        minuta.setEstado("PENDIENTE");
        return ResponseEntity.ok(minutaRepository.save(minuta));
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<Minuta> updateEstado(@PathVariable Long id, @RequestParam String estado) {
        Optional<Minuta> opt = minutaRepository.findById(id);
        if (opt.isPresent()) {
            Minuta minuta = opt.get();
            minuta.setEstado(estado);
            return ResponseEntity.ok(minutaRepository.save(minuta));
        }
        return ResponseEntity.notFound().build();
    }
}
