package com.roy.service;

import com.roy.model.RecetaTamañoIngrediente;
import java.util.List;

public interface IRecetaTamañoIngredienteService {
    List<RecetaTamañoIngrediente> buscarPorRecetaTamaño(Integer idRecetaTamaño);
    RecetaTamañoIngrediente buscarPorId(Integer id);
    RecetaTamañoIngrediente guardar(RecetaTamañoIngrediente ingrediente);
    void eliminar(Integer id);
}