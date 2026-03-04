package com.roy.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.roy.model.TareaProgramada;

public interface ITareasProgramadasService {
	List<TareaProgramada> buscarTodas();
	TareaProgramada buscarPorId(Integer id_tarea_programada);
	void guardar(TareaProgramada tareaProgramada);
	
	void eliminar(Integer id_tarea_programada);
	Page<TareaProgramada> buscarTodas(Pageable page);
}
