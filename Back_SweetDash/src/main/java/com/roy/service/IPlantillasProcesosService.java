package com.roy.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.roy.model.PlantillaProceso;

public interface IPlantillasProcesosService {
	List<PlantillaProceso> buscarTodas();
	PlantillaProceso buscarPorId(Integer id_plantilla_proceso);
	void guardar(PlantillaProceso plantillaProceso);
	
	void eliminar(Integer id_plantilla_proceso);
	Page<PlantillaProceso> buscarTodas(Pageable page);
}
