package com.roy.sevice.db;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.roy.model.TareaProgramada;
import com.roy.repository.TareasProgramadasRepository;
import com.roy.service.ITareasProgramadasService;

@Service
public class TareasProgramadasServiceJpa implements ITareasProgramadasService {
	@Autowired
	private TareasProgramadasRepository tareasProgramadasRepo;


	@Override
	public List<TareaProgramada> buscarTodas() {
		return tareasProgramadasRepo.findAll();
	}

	@Override
	public TareaProgramada buscarPorId(Integer id_tarea_programada) {
		Optional<TareaProgramada> optional = tareasProgramadasRepo.findById(id_tarea_programada);
		if(optional.isPresent()) return optional.get();
		return null;
	}

	@Override
	public void guardar(TareaProgramada tareaProgramada) {
		tareasProgramadasRepo.save(tareaProgramada);		
	}

	@Override
	public void eliminar(Integer id_tarea_programada) {
		tareasProgramadasRepo.deleteById(id_tarea_programada);		
	}

	@Override
	public Page<TareaProgramada> buscarTodas(Pageable page) {
		return tareasProgramadasRepo.findAll(page);
	}
	
	@Override
	public List<TareaProgramada> buscarPorProceso(Integer idProceso) {
	    return tareasProgramadasRepo.findByProcesoProduccionIdProceso(idProceso);
	}

}
