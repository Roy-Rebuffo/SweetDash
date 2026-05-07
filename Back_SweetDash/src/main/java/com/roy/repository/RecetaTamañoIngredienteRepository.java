package com.roy.repository;

import com.roy.model.RecetaTamañoIngrediente;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RecetaTamañoIngredienteRepository extends JpaRepository<RecetaTamañoIngrediente, Integer> {
    List<RecetaTamañoIngrediente> findByRecetaTamañoId(Integer idRecetaTamaño);
}