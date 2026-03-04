package com.roy.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.roy.model.StockMaterial;

public interface IStockMaterialesService {
	List<StockMaterial> buscarTodas();
	StockMaterial buscarPorId(Integer id_stock_material);
	void guardar(StockMaterial stockMaterial);
	
	void eliminar(Integer id_stock_material);
	Page<StockMaterial> buscarTodas(Pageable page);
}
