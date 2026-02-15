package com.roy.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.roy.model.Pedido;

public interface PedidosRepository extends JpaRepository<Pedido, Integer> {

}
