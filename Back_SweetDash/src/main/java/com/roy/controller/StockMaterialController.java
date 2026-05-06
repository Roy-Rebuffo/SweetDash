package com.roy.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    
 // GET - obtener por id
    @GetMapping("/{id}")
    public ResponseEntity<StockMaterialDTO> obtenerPorId(@PathVariable Integer id) {
        StockMaterial s = serviceStock.buscarPorId(id);
        if (s == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(toDTO(s));
    }

    // POST - crear
    @PostMapping
    public ResponseEntity<StockMaterialDTO> crear(@RequestBody StockMaterialDTO dto) {
        StockMaterial s = toEntity(dto);
        serviceStock.guardar(s);
        return ResponseEntity.status(201).body(toDTO(s));
    }

    // PUT - actualizar
    @PutMapping("/{id}")
    public ResponseEntity<StockMaterialDTO> actualizar(@PathVariable Integer id, @RequestBody StockMaterialDTO dto) {
        StockMaterial existente = serviceStock.buscarPorId(id);
        if (existente == null) return ResponseEntity.notFound().build();
        existente.setNombre(dto.getNombre());
        existente.setCantidadStock(dto.getCantidadStock());
        existente.setStockMaximo(dto.getStockMaximo());
        serviceStock.guardar(existente);
        return ResponseEntity.ok(toDTO(existente));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(@PathVariable Integer id) {
        StockMaterial existente = serviceStock.buscarPorId(id);
        if (existente == null) return ResponseEntity.notFound().build();
        try {
            serviceStock.eliminar(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(409).body("Este material no se puede eliminar porque está asociado a pedidos existentes.");
        }
    }

    // Helpers
    private StockMaterialDTO toDTO(StockMaterial s) {
        return new StockMaterialDTO(
            s.getIdStock(),
            s.getNombre(),
            s.getCantidadStock(),
            s.getStockMaximo()
        );
    }

    private StockMaterial toEntity(StockMaterialDTO dto) {
        StockMaterial s = new StockMaterial();
        s.setNombre(dto.getNombre());
        s.setCantidadStock(dto.getCantidadStock());
        s.setStockMaximo(dto.getStockMaximo());
        return s;
    }
}
