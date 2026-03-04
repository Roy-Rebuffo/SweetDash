package com.roy.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.roy.model.MateriaPrima;

public interface IMateriasPrimasService {
	List<MateriaPrima> buscarTodas();
	MateriaPrima buscarPorId(Integer id_materia_prima);
	void guardar(MateriaPrima materiaPrima);
	
	void eliminar(Integer id_materia_prima);
	Page<MateriaPrima> buscarTodas(Pageable page);
}
