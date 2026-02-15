package com.roy.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.roy.model.Cliente;

public interface IClientesService {

	List<Cliente> buscarTodas();
	Cliente buscarPorId(Integer id_cliente);
	void guardar(Cliente cliente);
	
	void eliminar(Integer id_cliente);
	Page<Cliente> buscarTodas(Pageable page);
}
