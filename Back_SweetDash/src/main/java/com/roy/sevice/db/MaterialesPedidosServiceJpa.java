package com.roy.sevice.db;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.roy.model.MaterialPedido;
import com.roy.repository.MaterialesPedidosRepository;
import com.roy.service.IMaterialesPedidosService;

@Service
public class MaterialesPedidosServiceJpa implements IMaterialesPedidosService {
	@Autowired
	private MaterialesPedidosRepository materialesPedidosRepo;
	@Override
	public List<MaterialPedido> buscarTodas() {
		return materialesPedidosRepo.findAll();
	}

	@Override
	public MaterialPedido buscarPorId(Integer id_material_pedido) {
		Optional<MaterialPedido> optional = materialesPedidosRepo.findById(id_material_pedido);
		if(optional.isPresent()) return optional.get();
		return null;
	}

	@Override
	public void guardar(MaterialPedido materialPedido) {
		materialesPedidosRepo.save(materialPedido);		
	}

	@Override
	public void eliminar(Integer id_material_pedido) {
		materialesPedidosRepo.deleteById(id_material_pedido);		
	}

	@Override
	public Page<MaterialPedido> buscarTodas(Pageable page) {
		return materialesPedidosRepo.findAll(page);
	}

}
