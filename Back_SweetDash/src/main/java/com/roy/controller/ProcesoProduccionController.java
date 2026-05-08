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

import com.roy.dto.ProcesoProduccionDTO;
import com.roy.model.ProcesoProduccion;
import com.roy.service.IProcesosProduccionService;
import com.roy.service.ITareasProgramadasService;
import com.roy.model.PlantillaProceso;
import com.roy.service.IPlantillasProcesosService;
import com.roy.model.TareaProgramada;

@RestController
@RequestMapping("/api/procesos")
@CrossOrigin(origins = "*")
public class ProcesoProduccionController {

    @Autowired
    private IProcesosProduccionService serviceProceso;
    
    @Autowired
    private IPlantillasProcesosService servicePlantilla;
    
    @Autowired
    private ITareasProgramadasService serviceTareas;

    @GetMapping
    public List<ProcesoProduccionDTO> obtenerTodos() {
        List<ProcesoProduccion> listaBD = serviceProceso.buscarTodas();
        List<ProcesoProduccionDTO> listaDTO = new ArrayList<>();

        for (ProcesoProduccion p : listaBD) {
            listaDTO.add(new ProcesoProduccionDTO(
                p.getIdProceso(),
                p.getNombre(),
                p.getDiasAntesEntrega(),
                p.getPlantillaProceso().getIdPlantilla()
            ));
        }
        return listaDTO;
    }
    
 // GET procesos por plantilla — clave para el front
    @GetMapping("/plantilla/{idPlantilla}")
    public List<ProcesoProduccionDTO> obtenerPorPlantilla(@PathVariable Integer idPlantilla) {
        List<ProcesoProduccion> todos = serviceProceso.buscarTodas();
        List<ProcesoProduccionDTO> resultado = new ArrayList<>();
        for (ProcesoProduccion p : todos) {
            if (p.getPlantillaProceso().getIdPlantilla() == idPlantilla) {
                resultado.add(new ProcesoProduccionDTO(
                    p.getIdProceso(),
                    p.getNombre(),
                    p.getDiasAntesEntrega(),
                    p.getPlantillaProceso().getIdPlantilla()
                ));
            }
        }
        return resultado;
    }

    @PostMapping
    public ResponseEntity<ProcesoProduccion> crear(@RequestBody ProcesoProduccion proceso) {
        serviceProceso.guardar(proceso);
        return ResponseEntity.status(201).body(proceso);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        ProcesoProduccion existente = serviceProceso.buscarPorId(id);
        if (existente == null) return ResponseEntity.notFound().build();
        List<TareaProgramada> tareas = serviceTareas.buscarPorProceso(id);
        for (TareaProgramada t : tareas) {
            serviceTareas.eliminar(t.getIdTarea());
        }
        serviceProceso.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}