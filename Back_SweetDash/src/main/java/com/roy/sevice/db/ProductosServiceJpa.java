package com.roy.sevice.db;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.roy.model.Producto;
import com.roy.repository.ProductosRepository;
import com.roy.service.IProductosService;

@Service
public class ProductosServiceJpa implements IProductosService {
	
	@Autowired
	private ProductosRepository productosRepo;

	@Override
	public List<Producto> buscarTodas() {
		return productosRepo.findAll();
	}

	@Override
	public Producto buscarPorId(Integer id_producto) {
		Optional<Producto> optional = productosRepo.findById(id_producto);
		if(optional.isPresent()) return optional.get();
		return null;
	}

	@Override
	public void guardar(Producto producto) {
		productosRepo.save(producto);		
	}

	@Override
	public void eliminar(Integer id_producto) {
		productosRepo.deleteById(id_producto);		
	}

	@Override
	public Page<Producto> buscarTodas(Pageable page) {
		return productosRepo.findAll(page);
	}

}
