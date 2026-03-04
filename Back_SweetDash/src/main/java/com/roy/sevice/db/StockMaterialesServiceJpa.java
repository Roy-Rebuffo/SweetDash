package com.roy.sevice.db;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.roy.model.StockMaterial;
import com.roy.repository.StockMaterialesRepository;
import com.roy.service.IStockMaterialesService;

@Service
public class StockMaterialesServiceJpa implements IStockMaterialesService {
	@Autowired
	private StockMaterialesRepository stockMaterialesRepo;

	@Override
	public List<StockMaterial> buscarTodas() {
		return stockMaterialesRepo.findAll();
	}

	@Override
	public StockMaterial buscarPorId(Integer id_stock_material) {
		Optional<StockMaterial> optional = stockMaterialesRepo.findById(id_stock_material);
		if(optional.isPresent()) return optional.get();
		return null;
	}

	@Override
	public void guardar(StockMaterial stockMaterial) {
		stockMaterialesRepo.save(stockMaterial);		
	}

	@Override
	public void eliminar(Integer id_stock_material) {
		stockMaterialesRepo.deleteById(id_stock_material);		
	}

	@Override
	public Page<StockMaterial> buscarTodas(Pageable page) {
		return stockMaterialesRepo.findAll(page);
	}

}
