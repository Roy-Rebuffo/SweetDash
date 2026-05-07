package com.roy.service;

import com.roy.model.RecetaTamaño;
import java.util.List;

public interface IRecetaTamañoService {
    List<RecetaTamaño> buscarTodas();
    List<RecetaTamaño> buscarPorProducto(Integer idProducto);
    RecetaTamaño buscarPorId(Integer id);
    RecetaTamaño guardar(RecetaTamaño receta);
    void eliminar(Integer id);
}