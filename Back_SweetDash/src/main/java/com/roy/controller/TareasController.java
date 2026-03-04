package com.roy.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
                t.getProcesoProduccion().getNombre()
            ));
        }
        return listaDTO;
    }
}