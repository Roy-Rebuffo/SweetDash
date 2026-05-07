package com.roy.sevice.db;

import com.roy.model.RecetaTamañoIngrediente;
import com.roy.repository.RecetaTamañoIngredienteRepository;
import com.roy.service.IRecetaTamañoIngredienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RecetaTamañoIngredienteServiceJpa implements IRecetaTamañoIngredienteService {

    @Autowired
    private RecetaTamañoIngredienteRepository repo;

    @Override
    public List<RecetaTamañoIngrediente> buscarPorRecetaTamaño(Integer idRecetaTamaño) {
        return repo.findByRecetaTamañoId(idRecetaTamaño);
    }

    @Override
    public RecetaTamañoIngrediente buscarPorId(Integer id) { return repo.findById(id).orElse(null); }

    @Override
    public RecetaTamañoIngrediente guardar(RecetaTamañoIngrediente ingrediente) { return repo.save(ingrediente); }

    @Override
    public void eliminar(Integer id) { repo.deleteById(id); }
}