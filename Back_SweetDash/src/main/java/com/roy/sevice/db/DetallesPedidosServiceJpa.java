package com.roy.sevice.db;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.roy.model.DetallePedido;
import com.roy.repository.DetallePedidosRepository;
import com.roy.service.IDetallesPedidosService;

@Service
public class DetallesPedidosServiceJpa implements IDetallesPedidosService {
	
	@Autowired
	private DetallePedidosRepository detallePedidosRepo;
	

	@Override
	public List<DetallePedido> buscarTodas() {
		return detallePedidosRepo.findAll();
	}

	@Override
	public DetallePedido buscarPorId(Integer idDetalle) {
		Optional<DetallePedido> optional = detallePedidosRepo.findById(idDetalle);
		if(optional.isPresent()) return optional.get();
		return null;
	}

	@Override
	public void guardar(DetallePedido detalle) {
		detallePedidosRepo.save(detalle);
		
	}

	@Override
	public void eliminar(Integer idDetalle) {
		detallePedidosRepo.deleteById(idDetalle);
	}

	@Override
	public Page<DetallePedido> buscarTodas(Pageable page) {
		return detallePedidosRepo.findAll(page);
	}

}
