package com.roy.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.roy.dto.ProductoDTO;
import com.roy.model.Producto;
import com.roy.service.CloudinaryService;
import com.roy.service.IProductosService;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*")
public class ProductosController {
	
	@Autowired
	private CloudinaryService cloudinaryService;

    @Autowired
    private IProductosService serviceProductos;

    @GetMapping
    public List<ProductoDTO> obtenerTodos() {
        List<Producto> listaBD = serviceProductos.buscarTodas();
        List<ProductoDTO> listaDTO = new ArrayList<>();

        for (Producto p : listaBD) {
            listaDTO.add(new ProductoDTO(
                p.getIdProducto(),
                p.getNombre(),
                p.getDescripcion(),
                p.getTipo(),
                p.getCantidadPersonas(),
                p.getPrecioBase(),
                p.getImagenUrl()
            ));
        }
        return listaDTO;
    }
    
    @PostMapping("/{id}/imagen")
    public ResponseEntity<String> subirImagen(
            @PathVariable int id,
            @RequestParam("archivo") MultipartFile archivo) throws IOException {

        String url = cloudinaryService.subirImagen(archivo);

        Producto producto = serviceProductos.buscarPorId(id); // ajusta al método que tengas
        producto.setImagenUrl(url);
        serviceProductos.guardar(producto); // ajusta al método que tengas

        return ResponseEntity.ok(url);
    }
}
