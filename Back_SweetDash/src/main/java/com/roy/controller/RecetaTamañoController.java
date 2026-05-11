package com.roy.controller;

import com.roy.dto.RecetaTamañoDTO;
import com.roy.dto.RecetaTamañoIngredienteDTO;
import com.roy.model.RecetaTamaño;
import com.roy.model.RecetaTamañoIngrediente;
import com.roy.model.Producto;
import com.roy.model.MateriaPrima;
import com.roy.model.PlantillaProceso;
import com.roy.service.IRecetaTamañoService;
import com.roy.service.IRecetaTamañoIngredienteService;
import com.roy.service.IProductosService;
import com.roy.service.IMateriasPrimasService;
import com.roy.service.IPlantillasProcesosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMethod;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/recetas-tamaño")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class RecetaTamañoController {

    @Autowired private IRecetaTamañoService serviceReceta;
    @Autowired private IRecetaTamañoIngredienteService serviceIngrediente;
    @Autowired private IProductosService serviceProducto;
    @Autowired private IMateriasPrimasService serviceMateria;
    @Autowired private IPlantillasProcesosService servicePlantilla;

    // GET - todas
    @GetMapping
    public List<RecetaTamañoDTO> obtenerTodas() {
        List<RecetaTamañoDTO> lista = new ArrayList<>();
        for (RecetaTamaño r : serviceReceta.buscarTodas()) {
            lista.add(toDTO(r));
        }
        return lista;
    }

    // GET - por producto
    @GetMapping("/producto/{idProducto}")
    public List<RecetaTamañoDTO> obtenerPorProducto(@PathVariable Integer idProducto) {
        List<RecetaTamañoDTO> lista = new ArrayList<>();
        for (RecetaTamaño r : serviceReceta.buscarPorProducto(idProducto)) {
            lista.add(toDTO(r));
        }
        return lista;
    }

    // GET - por id
    @GetMapping("/{id}")
    public ResponseEntity<RecetaTamañoDTO> obtenerPorId(@PathVariable Integer id) {
        RecetaTamaño r = serviceReceta.buscarPorId(id);
        if (r == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(toDTO(r));
    }

    // POST - crear
    @PostMapping
    public ResponseEntity<RecetaTamañoDTO> crear(@RequestBody RecetaTamañoDTO dto) {
    	System.out.println(">>> idPlantilla recibido: " + dto.getIdPlantilla());
        System.out.println(">>> descripcionTamaño: " + dto.getDescripcionTamaño());
        Producto producto = serviceProducto.buscarPorId(dto.getIdProducto());
        if (producto == null) return ResponseEntity.badRequest().build();

        RecetaTamaño receta = new RecetaTamaño();
        receta.setProducto(producto);
        receta.setTamañoCm(dto.getTamañoCm());
        receta.setDescripcionTamaño(dto.getDescripcionTamaño());
        receta.setPrecioVenta(dto.getPrecioVenta());
        if (dto.getIdPlantilla() != null) {
            receta.setPlantillaProceso(servicePlantilla.buscarPorId(dto.getIdPlantilla()));
        }
        RecetaTamaño guardada = serviceReceta.guardar(receta);

        // Guardar ingredientes si vienen en el DTO
        if (dto.getIngredientes() != null) {
            for (RecetaTamañoIngredienteDTO ing : dto.getIngredientes()) {
                MateriaPrima mp = serviceMateria.buscarPorId(ing.getIdMateriaPrima());
                if (mp == null) continue;
                RecetaTamañoIngrediente linea = new RecetaTamañoIngrediente();
                linea.setRecetaTamaño(guardada);
                linea.setMateriaPrima(mp);
                linea.setCantidadUsada(ing.getCantidadUsada());
                serviceIngrediente.guardar(linea);
            }
        }

        return ResponseEntity.status(201).body(toDTO(serviceReceta.buscarPorId(guardada.getId())));
    }

    // PUT - actualizar
    @PutMapping("/{id}")
    public ResponseEntity<RecetaTamañoDTO> actualizar(@PathVariable Integer id, @RequestBody RecetaTamañoDTO dto) {
        RecetaTamaño receta = serviceReceta.buscarPorId(id);
        if (receta == null) return ResponseEntity.notFound().build();

        receta.setTamañoCm(dto.getTamañoCm());
        receta.setDescripcionTamaño(dto.getDescripcionTamaño());
        receta.setPrecioVenta(dto.getPrecioVenta());
        if (dto.getIdPlantilla() != null) {
            receta.setPlantillaProceso(servicePlantilla.buscarPorId(dto.getIdPlantilla()));
        } else {
            receta.setPlantillaProceso(null);
        }
        serviceReceta.guardar(receta);

        // Eliminar ingredientes anteriores y reemplazar
        if (dto.getIngredientes() != null) {
            for (RecetaTamañoIngrediente ing : serviceIngrediente.buscarPorRecetaTamaño(id)) {
                serviceIngrediente.eliminar(ing.getId());
            }
            for (RecetaTamañoIngredienteDTO ing : dto.getIngredientes()) {
                MateriaPrima mp = serviceMateria.buscarPorId(ing.getIdMateriaPrima());
                if (mp == null) continue;
                RecetaTamañoIngrediente linea = new RecetaTamañoIngrediente();
                linea.setRecetaTamaño(receta);
                linea.setMateriaPrima(mp);
                linea.setCantidadUsada(ing.getCantidadUsada());
                serviceIngrediente.guardar(linea);
            }
        }

        return ResponseEntity.ok(toDTO(serviceReceta.buscarPorId(id)));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        RecetaTamaño receta = serviceReceta.buscarPorId(id);
        if (receta == null) return ResponseEntity.notFound().build();
        serviceReceta.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    // ── Helper toDTO con cálculo de coste ────────────────────────────────────
    private RecetaTamañoDTO toDTO(RecetaTamaño r) {
        RecetaTamañoDTO dto = new RecetaTamañoDTO();
        dto.setId(r.getId());
        dto.setTamañoCm(r.getTamañoCm());
        dto.setDescripcionTamaño(r.getDescripcionTamaño());
        dto.setPrecioVenta(r.getPrecioVenta());
        dto.setIdProducto(r.getProducto().getIdProducto());
        dto.setNombreProducto(r.getProducto().getNombre());

        BigDecimal costeTotal = BigDecimal.ZERO;
        List<RecetaTamañoIngredienteDTO> ings = new ArrayList<>();

        for (RecetaTamañoIngrediente ing : r.getIngredientes()) {
            RecetaTamañoIngredienteDTO ingDTO = new RecetaTamañoIngredienteDTO();
            ingDTO.setId(ing.getId());
            ingDTO.setIdMateriaPrima(ing.getMateriaPrima().getIdMateriaPrima());
            ingDTO.setNombreMateriaPrima(ing.getMateriaPrima().getNombre());
            ingDTO.setUnidad(ing.getMateriaPrima().getUnidad());
            ingDTO.setCantidadUsada(ing.getCantidadUsada());
            ingDTO.setPrecioPaquete(ing.getMateriaPrima().getPrecioPaquete());
            ingDTO.setUnidadesPaquete(ing.getMateriaPrima().getUnidadesPaquete());

            // Fórmula: (cantidadUsada / unidadesPaquete) * precioPaquete
            BigDecimal costeIng = BigDecimal.ZERO;
            if (ing.getMateriaPrima().getUnidadesPaquete() != null
                    && ing.getMateriaPrima().getUnidadesPaquete().compareTo(BigDecimal.ZERO) > 0
                    && ing.getMateriaPrima().getPrecioPaquete() != null) {
                costeIng = ing.getCantidadUsada()
                        .divide(ing.getMateriaPrima().getUnidadesPaquete(), 6, RoundingMode.HALF_UP)
                        .multiply(ing.getMateriaPrima().getPrecioPaquete())
                        .setScale(4, RoundingMode.HALF_UP);
            }
            ingDTO.setCosteIngrediente(costeIng);
            costeTotal = costeTotal.add(costeIng);
            ings.add(ingDTO);
        }

        // Añadir coste fijo del producto
        if (r.getProducto().getCosteFijo() != null) {
            costeTotal = costeTotal.add(r.getProducto().getCosteFijo());
        }

        dto.setIngredientes(ings);
        dto.setCosteTotal(costeTotal.setScale(2, RoundingMode.HALF_UP));
        if (r.getPlantillaProceso() != null) {
            dto.setIdPlantilla(r.getPlantillaProceso().getIdPlantilla());
        }

        // Ganancia y margen
        if (r.getPrecioVenta() != null && r.getPrecioVenta().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal ganancia = r.getPrecioVenta().subtract(costeTotal);
            dto.setGanancia(ganancia.setScale(2, RoundingMode.HALF_UP));
            BigDecimal margen = ganancia.divide(r.getPrecioVenta(), 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100"))
                    .setScale(2, RoundingMode.HALF_UP);
            dto.setMargenPct(margen);
        }

        return dto;
    }
}