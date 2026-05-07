package com.roy.controller;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.roy.dto.ProductoDTO;
import com.roy.model.PlantillaProceso;
import com.roy.model.Producto;
import com.roy.service.CloudinaryService;
import com.roy.service.IPlantillasProcesosService;
import com.roy.service.IProductosService;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = { RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT,
        RequestMethod.DELETE, RequestMethod.OPTIONS })
public class ProductosController {

    @Autowired private CloudinaryService cloudinaryService;
    @Autowired private IProductosService serviceProductos;
    @Autowired private IPlantillasProcesosService servicePlantilla;

    @GetMapping
    public List<ProductoDTO> obtenerTodos() {
        List<Producto> listaBD = serviceProductos.buscarTodas();
        List<ProductoDTO> listaDTO = new ArrayList<>();
        for (Producto p : listaBD) {
            listaDTO.add(toDTO(p));
        }
        return listaDTO;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoDTO> obtenerPorId(@PathVariable Integer id) {
        Producto p = serviceProductos.buscarPorId(id);
        if (p == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(toDTO(p));
    }

    @PostMapping
    public ResponseEntity<ProductoDTO> crear(@RequestBody ProductoDTO dto) {
        Producto p = new Producto();
        p.setNombre(dto.getNombre());
        p.setDescripcion(dto.getDescripcion());
        p.setTipo(dto.getTipo());
        p.setCantidadPersonas(dto.getCantidadPersonas());
        p.setPrecioBase(dto.getPrecioBase());
        p.setCosteFijo(dto.getCosteFijo() != null ? dto.getCosteFijo() : BigDecimal.ZERO);
        serviceProductos.guardar(p);
        return ResponseEntity.status(201).body(toDTO(p));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductoDTO> actualizar(@PathVariable Integer id, @RequestBody ProductoDTO dto) {
        Producto existente = serviceProductos.buscarPorId(id);
        if (existente == null) return ResponseEntity.notFound().build();
        existente.setNombre(dto.getNombre());
        existente.setDescripcion(dto.getDescripcion());
        existente.setTipo(dto.getTipo());
        existente.setCantidadPersonas(dto.getCantidadPersonas());
        existente.setPrecioBase(dto.getPrecioBase());
        existente.setCosteFijo(dto.getCosteFijo() != null ? dto.getCosteFijo() : BigDecimal.ZERO);
        serviceProductos.guardar(existente);
        return ResponseEntity.ok(toDTO(existente));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        Producto existente = serviceProductos.buscarPorId(id);
        if (existente == null) return ResponseEntity.notFound().build();
        serviceProductos.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/imagen")
    public ResponseEntity<String> subirImagen(@PathVariable int id, @RequestParam("archivo") MultipartFile archivo)
            throws IOException {
        String url = cloudinaryService.subirImagen(archivo);
        Producto producto = serviceProductos.buscarPorId(id);
        producto.setImagenUrl(url);
        serviceProductos.guardar(producto);
        return ResponseEntity.ok(url);
    }

    @PutMapping("/{id}/plantilla/{idPlantilla}")
    public ResponseEntity<Void> vincularPlantilla(@PathVariable int id, @PathVariable int idPlantilla) {
        Producto producto = serviceProductos.buscarPorId(id);
        PlantillaProceso plantilla = servicePlantilla.buscarPorId(idPlantilla);
        if (producto == null || plantilla == null) return ResponseEntity.notFound().build();
        producto.setPlantillaProceso(plantilla);
        serviceProductos.guardar(producto);
        return ResponseEntity.ok().build();
    }
    
    @PutMapping("/{id}/desvincular-plantilla")
    public ResponseEntity<Void> desvincularPlantilla(@PathVariable int id) {
        Producto producto = serviceProductos.buscarPorId(id);
        if (producto == null) return ResponseEntity.notFound().build();
        producto.setPlantillaProceso(null);
        serviceProductos.guardar(producto);
        return ResponseEntity.ok().build();
    }

    private ProductoDTO toDTO(Producto p) {
        return new ProductoDTO(
            p.getIdProducto(),
            p.getNombre(),
            p.getDescripcion(),
            p.getTipo(),
            p.getCantidadPersonas(),
            p.getPrecioBase(),
            p.getImagenUrl(),
            p.getPlantillaProceso() != null ? p.getPlantillaProceso().getIdPlantilla() : null,
            p.getCosteFijo()
        );
    }
}