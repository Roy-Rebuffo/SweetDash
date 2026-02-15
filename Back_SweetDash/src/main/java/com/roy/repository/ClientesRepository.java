package com.roy.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.roy.model.Cliente;

public interface ClientesRepository extends JpaRepository<Cliente, Integer> {

}
