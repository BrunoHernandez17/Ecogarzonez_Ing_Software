package com.ecogarzones.backend.repository;

import com.ecogarzones.backend.model.Minuta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MinutaRepository extends JpaRepository<Minuta, Long> {
    List<Minuta> findByEstado(String estado);
}
