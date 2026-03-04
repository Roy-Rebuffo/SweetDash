package com.roy.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.roy.dto.ProductoDTO;
import com.roy.model.Producto;
import com.roy.service.IProductosService;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*")
public class ProductosController {

    @Autowired
    private IProductosService serviceProductos;

    @GetMapping
    public List<ProductoDTO> obtenerTodos() {
        List<Producto> listaBD = serviceProductos.buscarTodas();
        List<ProductoDTO> listaDTO = new ArrayList<>();

        for (Producto p : listaBD) {
            listaDTO.add(new ProductoDTO(
                p.getIdProducto(),
                p.getNombre(),
                p.getDescripcion(),
                p.getTipo(),
                p.getCantidadPersonas(),
                p.getPrecioBase()
            ));
        }
        return listaDTO;
    }
}
