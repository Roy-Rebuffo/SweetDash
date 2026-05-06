package com.roy.controller;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.roy.model.Receta;
import com.roy.dto.RecetaDTO;
import com.roy.service.IRecetasService;
import com.roy.service.IProductosService;
import com.roy.service.IMateriasPrimasService;
import com.roy.model.Producto;
import com.roy.model.MateriaPrima;

@RestController
@RequestMapping("/api/recetas")
@CrossOrigin(origins = "*")
public class RecetasController {

    @Autowired
    private IRecetasService serviceReceta;
    
    @Autowired
    private IProductosService serviceProductos;

    @Autowired
    private IMateriasPrimasService serviceMateria;

    @GetMapping
    public List<RecetaDTO> obtenerTodas() {
        List<Receta> listaBD = serviceReceta.buscarTodas();
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
    
    // GET - obtener por id
    @GetMapping("/{id}")
    public ResponseEntity<RecetaDTO> obtenerPorId(@PathVariable Integer id) {
        Receta r = serviceReceta.buscarPorId(id);
        if (r == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(toDTO(r));
    }

    // POST - crear
    @PostMapping
    public ResponseEntity<RecetaDTO> crear(@RequestBody RecetaDTO dto) {
        Receta r = toEntity(dto);
        if (r == null) return ResponseEntity.badRequest().build();
        serviceReceta.guardar(r);
        return ResponseEntity.status(201).body(toDTO(r));
    }

    // PUT - actualizar
    @PutMapping("/{id}")
    public ResponseEntity<RecetaDTO> actualizar(@PathVariable Integer id, @RequestBody RecetaDTO dto) {
        Receta existente = serviceReceta.buscarPorId(id);
        if (existente == null) return ResponseEntity.notFound().build();

        Producto producto = serviceProductos.buscarPorId(dto.getIdProducto());
        MateriaPrima materia = serviceMateria.buscarPorId(dto.getIdMateriaPrima());
        if (producto == null || materia == null) return ResponseEntity.badRequest().build();

        existente.setCantidadNecesaria(dto.getCantidadNecesaria());
        existente.setProducto(producto);
        existente.setMateriaPrima(materia);
        serviceReceta.guardar(existente);
        return ResponseEntity.ok(toDTO(existente));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        Receta existente = serviceReceta.buscarPorId(id);
        if (existente == null) return ResponseEntity.notFound().build();
        serviceReceta.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    // Helpers
    private RecetaDTO toDTO(Receta r) {
        return new RecetaDTO(
            r.getIdReceta(),
            r.getCantidadNecesaria(),
            r.getProducto().getIdProducto(),
            r.getProducto().getNombre(),
            r.getMateriaPrima().getIdMateriaPrima(),
            r.getMateriaPrima().getNombre()
        );
    }

    private Receta toEntity(RecetaDTO dto) {
        Producto producto = serviceProductos.buscarPorId(dto.getIdProducto());
        MateriaPrima materia = serviceMateria.buscarPorId(dto.getIdMateriaPrima());
        if (producto == null || materia == null) return null;

        Receta r = new Receta();
        r.setCantidadNecesaria(dto.getCantidadNecesaria());
        r.setProducto(producto);
        r.setMateriaPrima(materia);
        return r;
    }
    
 // GET - obtener recetas por producto
    @GetMapping("/producto/{idProducto}")
    public List<RecetaDTO> obtenerPorProducto(@PathVariable Integer idProducto) {
        List<Receta> todas = serviceReceta.buscarTodas();
        List<RecetaDTO> listaDTO = new ArrayList<>();
        for (Receta r : todas) {
            if (r.getProducto().getIdProducto() == idProducto) {
                listaDTO.add(toDTO(r));
            }
        }
        return listaDTO;
    }
}