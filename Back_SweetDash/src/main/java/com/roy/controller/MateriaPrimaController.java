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

import com.roy.dto.MateriaPrimaDTO;
import com.roy.model.MateriaPrima;
import com.roy.service.IMateriasPrimasService;

@RestController
@RequestMapping("/api/materias-primas")
@CrossOrigin(origins = "*")
public class MateriaPrimaController {

    @Autowired
    private IMateriasPrimasService serviceMateria;

    @GetMapping
    public List<MateriaPrimaDTO> obtenerTodas() {
        List<MateriaPrima> listaBD = serviceMateria.buscarTodas();
        List<MateriaPrimaDTO> listaDTO = new ArrayList<>();

        for (MateriaPrima m : listaBD) {
            listaDTO.add(new MateriaPrimaDTO(
                m.getIdMateriaPrima(),
                m.getNombre(),
                m.getCantidadStock(),
                m.getUnidad(),
                m.getFechaCaducidad(),
                m.getStockMaximo()
            ));
        }
        return listaDTO;
    }
    
 // GET - obtener por id
    @GetMapping("/{id}")
    public ResponseEntity<MateriaPrimaDTO> obtenerPorId(@PathVariable Integer id) {
        MateriaPrima m = serviceMateria.buscarPorId(id);
        if (m == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(toDTO(m));
    }

    // POST - crear
    @PostMapping
    public ResponseEntity<MateriaPrimaDTO> crear(@RequestBody MateriaPrimaDTO dto) {
        MateriaPrima m = toEntity(dto);
        serviceMateria.guardar(m);
        return ResponseEntity.status(201).body(toDTO(m));
    }

    // PUT - actualizar
    @PutMapping("/{id}")
    public ResponseEntity<MateriaPrimaDTO> actualizar(@PathVariable Integer id, @RequestBody MateriaPrimaDTO dto) {
        MateriaPrima existente = serviceMateria.buscarPorId(id);
        if (existente == null) return ResponseEntity.notFound().build();
        existente.setNombre(dto.getNombre());
        existente.setCantidadStock(dto.getCantidadStock());
        existente.setStockMaximo(dto.getStockMaximo());
        existente.setUnidad(dto.getUnidad());
        existente.setFechaCaducidad(dto.getFechaCaducidad());
        serviceMateria.guardar(existente);
        return ResponseEntity.ok(toDTO(existente));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(@PathVariable Integer id) {
        MateriaPrima existente = serviceMateria.buscarPorId(id);
        if (existente == null) return ResponseEntity.notFound().build();
        try {
            serviceMateria.eliminar(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(409).body("Esta materia prima no se puede eliminar porque está siendo usada en una o más recetas.");
        }
    }

    // Helpers para no repetir código
    private MateriaPrimaDTO toDTO(MateriaPrima m) {
        return new MateriaPrimaDTO(
            m.getIdMateriaPrima(),
            m.getNombre(),
            m.getCantidadStock(),
            m.getUnidad(),
            m.getFechaCaducidad(),
            m.getStockMaximo()
        );
    }

    private MateriaPrima toEntity(MateriaPrimaDTO dto) {
        MateriaPrima m = new MateriaPrima();
        m.setNombre(dto.getNombre());
        m.setCantidadStock(dto.getCantidadStock());
        m.setStockMaximo(dto.getStockMaximo());
        m.setUnidad(dto.getUnidad());
        m.setFechaCaducidad(dto.getFechaCaducidad());
        return m;
    }
}
