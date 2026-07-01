package com.ecogarzones.backend.controller;

import com.ecogarzones.backend.model.Tarea;
import com.ecogarzones.backend.model.Usuario;
import com.ecogarzones.backend.repository.TareaRepository;
import com.ecogarzones.backend.repository.UsuarioRepository;
import com.ecogarzones.backend.repository.EventoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tareas")
@RequiredArgsConstructor
public class TareaController {

    private final TareaRepository tareaRepository;
    private final UsuarioRepository usuarioRepository;
    private final EventoRepository eventoRepository;

    @GetMapping("/evento/{eventoId}")
    public List<Tarea> getTareasByEvento(@PathVariable Long eventoId) {
        return tareaRepository.findByEventoId(eventoId);
    }

    @GetMapping("/mis-tareas")
    public ResponseEntity<List<Tarea>> getMisTareas() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(email)
                .map(user -> ResponseEntity.ok(tareaRepository.findByStaffId(user.getId())))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Tarea> createTarea(@RequestBody Tarea tarea) {
        if (tarea.getStaff() != null && tarea.getStaff().getId() != null) {
            usuarioRepository.findById(tarea.getStaff().getId()).ifPresent(tarea::setStaff);
        }
        if (tarea.getEvento() != null && tarea.getEvento().getId() != null) {
            eventoRepository.findById(tarea.getEvento().getId()).ifPresent(tarea::setEvento);
        }
        return ResponseEntity.ok(tareaRepository.save(tarea));
    }
}
