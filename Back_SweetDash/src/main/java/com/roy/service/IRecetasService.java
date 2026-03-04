package com.roy.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.roy.model.Receta;

public interface IRecetasService {
	List<Receta> buscarTodas();
	Receta buscarPorId(Integer id_receta);
	void guardar(Receta receta);
	
	void eliminar(Integer id_receta);
	Page<Receta> buscarTodas(Pageable page);
}
