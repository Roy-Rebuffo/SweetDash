package com.roy.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import com.roy.model.PlantillaProceso;
import com.roy.dto.PlantillaProcesoDTO;
import com.roy.service.IPlantillasProcesosService;

@RestController
@RequestMapping("/api/plantillas")
@CrossOrigin(origins = "*")
public class PlantillaProcesoController {

    @Autowired
    private IPlantillasProcesosService servicePlantilla;

    @GetMapping
    public List<PlantillaProcesoDTO> obtenerTodas() {
        List<PlantillaProceso> listaBD = servicePlantilla.buscarTodas();
        List<PlantillaProcesoDTO> listaDTO = new ArrayList<>();

        for (PlantillaProceso p : listaBD) {
            listaDTO.add(new PlantillaProcesoDTO(
                p.getIdPlantilla(),
                p.getNombre(),
                p.getDescripcion()
            ));
        }
        return listaDTO;
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<PlantillaProceso> obtenerPorId(@PathVariable Integer id) {
        PlantillaProceso p = servicePlantilla.buscarPorId(id);
        if (p == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(p);
    }

    @PostMapping
    public ResponseEntity<PlantillaProceso> crear(@RequestBody PlantillaProceso plantilla) {
        servicePlantilla.guardar(plantilla);
        return ResponseEntity.status(201).body(plantilla);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlantillaProceso> actualizar(@PathVariable Integer id, @RequestBody PlantillaProceso plantilla) {
        PlantillaProceso existente = servicePlantilla.buscarPorId(id);
        if (existente == null) return ResponseEntity.notFound().build();
        existente.setNombre(plantilla.getNombre());
        existente.setDescripcion(plantilla.getDescripcion());
        servicePlantilla.guardar(existente);
        return ResponseEntity.ok(existente);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        PlantillaProceso existente = servicePlantilla.buscarPorId(id);
        if (existente == null) return ResponseEntity.notFound().build();
        servicePlantilla.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}