package com.roy.sevice.db;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.roy.model.ProcesoProduccion;
import com.roy.repository.ProcesosProduccionRepository;
import com.roy.service.IProcesosProduccionService;

@Service
public class ProcesosProduccionServiceJpa implements IProcesosProduccionService {
	
	@Autowired
	private ProcesosProduccionRepository procesosProduccionRepo;

	@Override
	public List<ProcesoProduccion> buscarTodas() {
		return procesosProduccionRepo.findAll();
	}

	@Override
	public ProcesoProduccion buscarPorId(Integer id_proceso_produccion) {
		Optional<ProcesoProduccion> optional = procesosProduccionRepo.findById(id_proceso_produccion);
		if(optional.isPresent()) return optional.get();
		return null;
	}

	@Override
	public void guardar(ProcesoProduccion procesoProduccion) {
		procesosProduccionRepo.save(procesoProduccion);
	}

	@Override
	public void eliminar(Integer id_proceso_produccion) {
		procesosProduccionRepo.deleteById(id_proceso_produccion);		
	}

	@Override
	public Page<ProcesoProduccion> buscarTodas(Pageable page) {
		return procesosProduccionRepo.findAll(page);
	}

}
