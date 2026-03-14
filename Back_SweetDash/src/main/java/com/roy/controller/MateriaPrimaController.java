package com.roy.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
