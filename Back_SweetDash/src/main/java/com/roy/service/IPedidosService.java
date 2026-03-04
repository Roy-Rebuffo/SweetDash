package com.roy.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.roy.model.Pedido;

public interface IPedidosService {
	List<Pedido> buscarTodas();
	Pedido buscarPorId(Integer id_pedido);
	void guardar(Pedido pedido);
	
	void eliminar(Integer id_pedido);
	Page<Pedido> buscarTodas(Pageable page);
}
