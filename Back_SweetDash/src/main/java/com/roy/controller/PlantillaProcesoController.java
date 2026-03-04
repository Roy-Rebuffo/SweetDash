package com.roy.controller;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.roy.model.PlantillaProceso;
import com.roy.dto.PlantillaProcesoDTO;
import com.roy.service.IPlantillasProcesosService;

@RestController
@RequestMapping("/api/plantillas")
@CrossOrigin(origins = "*")
public class PlantillaProcesoController {

    @Autowired
    private IPlantillasProcesosService servicePlantillas;

    @GetMapping
    public List<PlantillaProcesoDTO> obtenerTodas() {
        List<PlantillaProceso> listaBD = servicePlantillas.buscarTodas();
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
}