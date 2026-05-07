package com.roy.sevice.db;

import com.roy.model.RecetaTamaño;
import com.roy.repository.RecetaTamañoRepository;
import com.roy.service.IRecetaTamañoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RecetaTamañoServiceJpa implements IRecetaTamañoService {

    @Autowired
    private RecetaTamañoRepository repo;

    @Override
    public List<RecetaTamaño> buscarTodas() { return repo.findAll(); }

    @Override
    public List<RecetaTamaño> buscarPorProducto(Integer idProducto) {
        return repo.findByProductoIdProducto(idProducto);
    }

    @Override
    public RecetaTamaño buscarPorId(Integer id) { return repo.findById(id).orElse(null); }

    @Override
    public RecetaTamaño guardar(RecetaTamaño receta) { return repo.save(receta); }

    @Override
    public void eliminar(Integer id) { repo.deleteById(id); }
}