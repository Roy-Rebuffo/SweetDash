package com.roy.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.roy.model.DetallePedido;

public interface IDetallesPedidosService {
	List<DetallePedido> buscarTodas();
	DetallePedido buscarPorId(Integer idDetalle);
	void guardar(DetallePedido detalle);
	
	void eliminar(Integer idDetalle);
	Page<DetallePedido> buscarTodas(Pageable page);

}
