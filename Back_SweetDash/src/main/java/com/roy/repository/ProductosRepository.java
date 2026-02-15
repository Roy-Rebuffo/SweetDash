package com.roy.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.roy.model.Producto;

public interface ProductosRepository extends JpaRepository<Producto, Integer> {

}
