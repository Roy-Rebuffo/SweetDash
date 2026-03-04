package com.roy.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.roy.model.ProcesoProduccion;

public interface IProcesosProduccionService {
	List<ProcesoProduccion> buscarTodas();
	ProcesoProduccion buscarPorId(Integer id_proceso_produccion);
	void guardar(ProcesoProduccion procesoProduccion);
	
	void eliminar(Integer id_proceso_produccion);
	Page<ProcesoProduccion> buscarTodas(Pageable page);
}
