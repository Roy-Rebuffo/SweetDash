package com.roy.sevice.db;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.roy.model.Pedido;
import com.roy.repository.PedidosRepository;
import com.roy.service.IPedidosService;

@Service
public class PedidosServiceJpa implements IPedidosService {
	
	@Autowired
	private PedidosRepository pedidosRepo;

	@Override
	public List<Pedido> buscarTodas() {
		return pedidosRepo.findAll();
	}

	@Override
	public Pedido buscarPorId(Integer id_pedido) {
		Optional<Pedido> optional = pedidosRepo.findById(id_pedido);
		if(optional.isPresent()) return optional.get();
		return null;
	}

	@Override
	public void guardar(Pedido pedido) {
		pedidosRepo.save(pedido);		
	}

	@Override
	public void eliminar(Integer id_pedido) {
		pedidosRepo.deleteById(id_pedido);		
	}

	@Override
	public Page<Pedido> buscarTodas(Pageable page) {
		// TODO Auto-generated method stub
		return pedidosRepo.findAll(page);
	}

}
