package com.roy.controller;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.roy.model.MaterialPedido;
import com.roy.dto.MaterialPedidoDTO;
import com.roy.service.IMaterialesPedidosService;

@RestController
@RequestMapping("/api/materiales-pedidos")
@CrossOrigin(origins = "*")
public class MaterialPedidoController {

    @Autowired
    private IMaterialesPedidosService serviceMateriales;

    @GetMapping
    public List<MaterialPedidoDTO> obtenerTodos() {
        List<MaterialPedido> listaBD = serviceMateriales.buscarTodas();
        List<MaterialPedidoDTO> listaDTO = new ArrayList<>();

        for (MaterialPedido m : listaBD) {
            listaDTO.add(new MaterialPedidoDTO(
                m.getIdMaterialPedido(),
                m.getCantidadNecesaria(),
                m.getPrecioVenta(),
                m.getPedido().getIdPedido(),
                m.getStockMaterial().getIdStock(),
                m.getStockMaterial().getNombre()
            ));
        }
        return listaDTO;
    }
}