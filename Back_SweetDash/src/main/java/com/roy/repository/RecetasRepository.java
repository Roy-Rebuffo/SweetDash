package com.roy.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.roy.model.Receta;

public interface RecetasRepository extends JpaRepository<Receta, Integer> {

}
