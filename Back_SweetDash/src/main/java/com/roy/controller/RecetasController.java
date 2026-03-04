package com.roy.controller;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.roy.model.Receta;
import com.roy.dto.RecetaDTO;
import com.roy.service.IRecetasService;

@RestController
@RequestMapping("/api/recetas")
@CrossOrigin(origins = "*")
public class RecetasController {

    @Autowired
    private IRecetasService serviceRecetas;

    @GetMapping
    public List<RecetaDTO> obtenerTodas() {
        List<Receta> listaBD = serviceRecetas.buscarTodas();
        List<RecetaDTO> listaDTO = new ArrayList<>();

        for (Receta r : listaBD) {
            listaDTO.add(new RecetaDTO(
                r.getIdReceta(),
                r.getCantidadNecesaria(),
                r.getProducto().getIdProducto(),
                r.getProducto().getNombre(),
                r.getMateriaPrima().getIdMateriaPrima(),
                r.getMateriaPrima().getNombre()
            ));
        }
        return listaDTO;
    }
}