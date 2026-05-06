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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;

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

	@Autowired
	private CloudinaryService cloudinaryService;

	@Autowired
	private IProductosService serviceProductos;

	@Autowired
	private IPlantillasProcesosService servicePlantilla;

	@GetMapping
	public List<ProductoDTO> obtenerTodos() {
		List<Producto> listaBD = serviceProductos.buscarTodas();
		List<ProductoDTO> listaDTO = new ArrayList<>();

		for (Producto p : listaBD) {
			listaDTO.add(new ProductoDTO(p.getIdProducto(), p.getNombre(), p.getDescripcion(), p.getTipo(),
					p.getCantidadPersonas(), p.getPrecioBase(), p.getImagenUrl(),
					p.getPlantillaProceso() != null ? p.getPlantillaProceso().getIdPlantilla() : null));
		}
		return listaDTO;
	}

	@PostMapping("/{id}/imagen")
	public ResponseEntity<String> subirImagen(@PathVariable int id, @RequestParam("archivo") MultipartFile archivo)
			throws IOException {

		String url = cloudinaryService.subirImagen(archivo);

		Producto producto = serviceProductos.buscarPorId(id); // ajusta al método que tengas
		producto.setImagenUrl(url);
		serviceProductos.guardar(producto); // ajusta al método que tengas

		return ResponseEntity.ok(url);
	}

	@PutMapping("/{id}/plantilla/{idPlantilla}")
	public ResponseEntity<Void> vincularPlantilla(@PathVariable int id, @PathVariable int idPlantilla) {
		Producto producto = serviceProductos.buscarPorId(id);
		PlantillaProceso plantilla = servicePlantilla.buscarPorId(idPlantilla);
		if (producto == null || plantilla == null)
			return ResponseEntity.notFound().build();
		producto.setPlantillaProceso(plantilla);
		serviceProductos.guardar(producto);
		return ResponseEntity.ok().build();
	}

	@GetMapping("/{id}")
	public ResponseEntity<ProductoDTO> obtenerPorId(@PathVariable Integer id) {
		Producto p = serviceProductos.buscarPorId(id);
		if (p == null)
			return ResponseEntity.notFound().build();
		return ResponseEntity.ok(new ProductoDTO(
			    p.getIdProducto(),
			    p.getNombre(),
			    p.getDescripcion(),
			    p.getTipo(),
			    p.getCantidadPersonas(),
			    p.getPrecioBase(),
			    p.getImagenUrl(),
			    p.getPlantillaProceso() != null ? p.getPlantillaProceso().getIdPlantilla() : null
			));
	}

	@PostMapping
	public ResponseEntity<ProductoDTO> crear(@RequestBody ProductoDTO dto) {
		Producto p = new Producto();
		p.setNombre(dto.getNombre());
		p.setDescripcion(dto.getDescripcion());
		p.setTipo(dto.getTipo());
		p.setCantidadPersonas(dto.getCantidadPersonas());
		p.setPrecioBase(dto.getPrecioBase());
		serviceProductos.guardar(p);
		return ResponseEntity.status(201).body(new ProductoDTO(
			    p.getIdProducto(),
			    p.getNombre(),
			    p.getDescripcion(),
			    p.getTipo(),
			    p.getCantidadPersonas(),
			    p.getPrecioBase(),
			    p.getImagenUrl(),
			    p.getPlantillaProceso() != null ? p.getPlantillaProceso().getIdPlantilla() : null
			));
	}

	@PutMapping("/{id}")
	public ResponseEntity<ProductoDTO> actualizar(@PathVariable Integer id, @RequestBody ProductoDTO dto) {
		Producto existente = serviceProductos.buscarPorId(id);
		if (existente == null)
			return ResponseEntity.notFound().build();
		existente.setNombre(dto.getNombre());
		existente.setDescripcion(dto.getDescripcion());
		existente.setTipo(dto.getTipo());
		existente.setCantidadPersonas(dto.getCantidadPersonas());
		existente.setPrecioBase(dto.getPrecioBase());
		serviceProductos.guardar(existente);
		return ResponseEntity.ok(new ProductoDTO(
				existente.getIdProducto(),
				existente.getNombre(),
				existente.getDescripcion(),
				existente.getTipo(),
				existente.getCantidadPersonas(),
				existente.getPrecioBase(),
				existente.getImagenUrl(),
				existente.getPlantillaProceso() != null ? existente.getPlantillaProceso().getIdPlantilla() : null
			));
	}

	@org.springframework.web.bind.annotation.DeleteMapping("/{id}")
	public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
		Producto existente = serviceProductos.buscarPorId(id);
		if (existente == null)
			return ResponseEntity.notFound().build();
		serviceProductos.eliminar(id);
		return ResponseEntity.noContent().build();
	}
}
