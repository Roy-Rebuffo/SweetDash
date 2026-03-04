package com.roy.sevice.db;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.roy.model.MateriaPrima;
import com.roy.repository.MateriasPrimasRepository;
import com.roy.service.IMateriasPrimasService;

@Service
public class MateriasPrimasServiceJpa implements IMateriasPrimasService {
	@Autowired
	private MateriasPrimasRepository materiasPrimasRepo;

	@Override
	public List<MateriaPrima> buscarTodas() {
		return materiasPrimasRepo.findAll();
	}

	@Override
	public MateriaPrima buscarPorId(Integer id_materia_prima) {
		Optional<MateriaPrima> optional = materiasPrimasRepo.findById(id_materia_prima);
		if(optional.isPresent()) return optional.get();
		return null;
	}

	@Override
	public void guardar(MateriaPrima materiaPrima) {
		materiasPrimasRepo.save(materiaPrima);	
	}

	@Override
	public void eliminar(Integer id_materia_prima) {
		materiasPrimasRepo.deleteById(id_materia_prima);		
	}

	@Override
	public Page<MateriaPrima> buscarTodas(Pageable page) {
		// TODO Auto-generated method stub
		return materiasPrimasRepo.findAll(page);
	}

}
