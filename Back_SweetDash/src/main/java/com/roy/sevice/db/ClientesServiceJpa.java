package com.roy.sevice.db;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.roy.model.Cliente;
import com.roy.repository.ClientesRepository;
import com.roy.service.IClientesService;

@Service
public class ClientesServiceJpa implements IClientesService {

	@Autowired
	private ClientesRepository clientesRepo;
	
	@Override
	public List<Cliente> buscarTodas() {
		return clientesRepo.findAll();
	}

	@Override
	public Cliente buscarPorId(Integer id_cliente) {
		Optional<Cliente> optional = clientesRepo.findById(id_cliente);
		if(optional.isPresent()) return optional.get();
		return null;
	}

	@Override
	public void guardar(Cliente cliente) {
		clientesRepo.save(cliente);
		
	}

	@Override
	public void eliminar(Integer id_cliente) {
		clientesRepo.deleteById(id_cliente);
		
	}

	@Override
	public Page<Cliente> buscarTodas(Pageable page) {
		return clientesRepo.findAll(page);
	}
}
