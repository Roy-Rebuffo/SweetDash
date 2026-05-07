package com.roy.repository;

import com.roy.model.RecetaTamaño;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RecetaTamañoRepository extends JpaRepository<RecetaTamaño, Integer> {
    List<RecetaTamaño> findByProductoIdProducto(Integer idProducto);
}