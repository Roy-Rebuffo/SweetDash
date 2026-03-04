package com.roy.sevice.db;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.roy.model.Receta;
import com.roy.repository.RecetasRepository;
import com.roy.service.IRecetasService;

@Service
public class RecetasServiceJpa implements IRecetasService {
	@Autowired
	private RecetasRepository recetasRepo;


	@Override
	public List<Receta> buscarTodas() {
		return recetasRepo.findAll();
	}

	@Override
	public Receta buscarPorId(Integer id_receta) {
		Optional<Receta> optional = recetasRepo.findById(id_receta);
		if(optional.isPresent()) return optional.get();
		return null;
	}

	@Override
	public void guardar(Receta receta) {
		recetasRepo.save(receta);		
	}

	@Override
	public void eliminar(Integer id_receta) {
		recetasRepo.deleteById(id_receta);		
	}

	@Override
	public Page<Receta> buscarTodas(Pageable page) {
		return recetasRepo.findAll(page);
	}

}
