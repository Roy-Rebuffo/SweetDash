package com.roy.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.roy.dto.StockMaterialDTO;
import com.roy.model.StockMaterial;
import com.roy.service.IStockMaterialesService;

@RestController
@RequestMapping("/api/stock-materiales")
@CrossOrigin(origins = "*")
public class StockMaterialController {

    @Autowired
    private IStockMaterialesService serviceStock;

    @GetMapping
    public List<StockMaterialDTO> obtenerTodos() {
        List<StockMaterial> listaBD = serviceStock.buscarTodas();
        List<StockMaterialDTO> listaDTO = new ArrayList<>();

        for (StockMaterial s : listaBD) {
            listaDTO.add(new StockMaterialDTO(
                s.getIdStock(),
                s.getNombre(),
                s.getCantidadStock(),
                s.getStockMaximo()
            ));
        }
        return listaDTO;
    }
}
