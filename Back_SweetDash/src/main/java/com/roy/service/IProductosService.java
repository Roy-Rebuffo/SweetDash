package com.roy.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.roy.model.Producto;

public interface IProductosService {
	List<Producto> buscarTodas();
	Producto buscarPorId(Integer id_producto);
	void guardar(Producto producto);
	
	void eliminar(Integer id_producto);
	Page<Producto> buscarTodas(Pageable page);
}
