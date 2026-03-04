package com.roy.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.roy.model.MaterialPedido;

public interface IMaterialesPedidosService {
	List<MaterialPedido> buscarTodas();
	MaterialPedido buscarPorId(Integer id_material_pedido);
	void guardar(MaterialPedido materialPedido);
	
	void eliminar(Integer id_material_pedido);
	Page<MaterialPedido> buscarTodas(Pageable page);
}
