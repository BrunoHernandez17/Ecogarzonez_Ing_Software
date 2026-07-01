package com.ecogarzones.backend.repository;

import com.ecogarzones.backend.model.Tarea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TareaRepository extends JpaRepository<Tarea, Long> {
    List<Tarea> findByStaffId(Long staffId);
    List<Tarea> findByEventoId(Long eventoId);
}
