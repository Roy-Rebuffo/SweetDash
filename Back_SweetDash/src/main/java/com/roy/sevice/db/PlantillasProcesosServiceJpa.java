package com.roy.sevice.db;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.roy.model.PlantillaProceso;
import com.roy.repository.PlantillasProcesosRepository;
import com.roy.service.IPlantillasProcesosService;

@Service
public class PlantillasProcesosServiceJpa implements IPlantillasProcesosService {
	
	@Autowired
	private PlantillasProcesosRepository plantillasProcesosRepo;

	@Override
	public List<PlantillaProceso> buscarTodas() {
		return plantillasProcesosRepo.findAll();
	}

	@Override
	public PlantillaProceso buscarPorId(Integer id_plantilla_proceso) {
		Optional<PlantillaProceso> optional = plantillasProcesosRepo.findById(id_plantilla_proceso);
		if(optional.isPresent()) return optional.get();
		return null;
	}

	@Override
	public void guardar(PlantillaProceso plantillaProceso) {
		plantillasProcesosRepo.save(plantillaProceso);		
	}

	@Override
	public void eliminar(Integer id_plantilla_proceso) {
		plantillasProcesosRepo.deleteById(id_plantilla_proceso);		
	}

	@Override
	public Page<PlantillaProceso> buscarTodas(Pageable page) {
		return plantillasProcesosRepo.findAll(page);
	}

}
