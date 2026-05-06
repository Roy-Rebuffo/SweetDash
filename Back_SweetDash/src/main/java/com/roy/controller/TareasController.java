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

import com.roy.dto.TareaProgramadaDTO;
import com.roy.model.TareaProgramada;
import com.roy.service.ITareasProgramadasService;

@RestController
@RequestMapping("/api/tareas")
@CrossOrigin(origins = "*")
public class TareasController {

    @Autowired
    private ITareasProgramadasService serviceTareas;

    @GetMapping
    public List<TareaProgramadaDTO> obtenerTodas() {
        List<TareaProgramada> listaBD = serviceTareas.buscarTodas();
        List<TareaProgramadaDTO> listaDTO = new ArrayList<>();

        for (TareaProgramada t : listaBD) {
            listaDTO.add(new TareaProgramadaDTO(
                t.getIdTarea(),
                t.getEstado(),
                t.getFechaEjecucion(),
                t.getPedido().getIdPedido(),
                t.getProcesoProduccion().getNombre(),
                t.getProcesoProduccion().getDiasAntesEntrega()
            ));
        }
        return listaDTO;
    }
    
    @GetMapping("/pedido/{idPedido}")
    public List<TareaProgramadaDTO> obtenerPorPedido(@PathVariable Integer idPedido) {
        List<TareaProgramada> todas = serviceTareas.buscarTodas();
        List<TareaProgramadaDTO> resultado = new ArrayList<>();
        for (TareaProgramada t : todas) {
            if (t.getPedido().getIdPedido() == idPedido) {
                resultado.add(new TareaProgramadaDTO(
                    t.getIdTarea(),
                    t.getEstado(),
                    t.getFechaEjecucion(),
                    t.getPedido().getIdPedido(),
                    t.getProcesoProduccion().getNombre(),
                    t.getProcesoProduccion().getDiasAntesEntrega()
                ));
            }
        }
        return resultado;
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<TareaProgramadaDTO> actualizarEstado(
            @PathVariable Integer id,
            @RequestBody TareaProgramadaDTO dto) {
        TareaProgramada tarea = serviceTareas.buscarPorId(id);
        if (tarea == null) return ResponseEntity.notFound().build();
        tarea.setEstado(dto.getEstado());
        serviceTareas.guardar(tarea);
        return ResponseEntity.ok(new TareaProgramadaDTO(
            tarea.getIdTarea(),
            tarea.getEstado(),
            tarea.getFechaEjecucion(),
            tarea.getPedido().getIdPedido(),
            tarea.getProcesoProduccion().getNombre(),
            tarea.getProcesoProduccion().getDiasAntesEntrega()
        ));
    }
    
    @PutMapping("/{id}/fecha")
    public ResponseEntity<TareaProgramadaDTO> actualizarFecha(
            @PathVariable Integer id,
            @RequestBody TareaProgramadaDTO dto) {
        TareaProgramada tarea = serviceTareas.buscarPorId(id);
        if (tarea == null) return ResponseEntity.notFound().build();
        tarea.setFechaEjecucion(dto.getFechaEjecucion());
        serviceTareas.guardar(tarea);
        return ResponseEntity.ok(new TareaProgramadaDTO(
            tarea.getIdTarea(),
            tarea.getEstado(),
            tarea.getFechaEjecucion(),
            tarea.getPedido().getIdPedido(),
            tarea.getProcesoProduccion().getNombre(),
            tarea.getProcesoProduccion().getDiasAntesEntrega()
        ));
    }
}