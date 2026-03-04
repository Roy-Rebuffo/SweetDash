package com.roy.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.roy.dto.ProcesoProduccionDTO;
import com.roy.model.ProcesoProduccion;
import com.roy.service.IProcesosProduccionService;

@RestController
@RequestMapping("/api/procesos")
@CrossOrigin(origins = "*")
public class ProcesoProduccionController {

    @Autowired
    private IProcesosProduccionService serviceProcesos;

    @GetMapping
    public List<ProcesoProduccionDTO> obtenerTodos() {
        List<ProcesoProduccion> listaBD = serviceProcesos.buscarTodas();
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
}