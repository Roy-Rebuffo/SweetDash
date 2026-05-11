package com.roy.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.roy.dto.PedidoDTO;
import com.roy.model.Pedido;
import com.roy.model.PlantillaProceso;
import com.roy.service.IPedidosService;
import com.roy.service.IClientesService;
import com.roy.service.IDetallesPedidosService;
import com.roy.service.IProductosService;
import com.roy.service.IProcesosProduccionService;
import com.roy.service.ITareasProgramadasService;
import com.roy.service.IRecetaTamañoService;

import com.roy.model.Cliente;
import com.roy.model.Producto;
import com.roy.model.DetallePedido;
import com.roy.dto.DetallePedidoDTO;
import com.roy.model.ProcesoProduccion;
import com.roy.model.TareaProgramada;
import com.roy.model.RecetaTamaño;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = { RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT,
		RequestMethod.DELETE, RequestMethod.OPTIONS })
public class PedidosController {

	@Autowired
	private IPedidosService servicePedido;

	@Autowired
	private IClientesService serviceCliente;

	@Autowired
	private IProductosService serviceProductos;

	@Autowired
	private ITareasProgramadasService serviceTareas;

	@Autowired
	private IProcesosProduccionService serviceProcesos;
	
	@Autowired
	private IRecetaTamañoService serviceRecetaTamaño;
	
	@Autowired
	private IDetallesPedidosService serviceDetalles;

	@GetMapping
	public List<PedidoDTO> obtenerTodos() {
	    List<Pedido> listaBD = servicePedido.buscarTodas();
	    List<PedidoDTO> listaDTO = new ArrayList<>();
	    for (Pedido p : listaBD) {
	        listaDTO.add(new PedidoDTO(
	            p.getIdPedido(),
	            p.getFechaEntrega(),
	            p.getEstado(),
	            p.getCliente().getIdCliente(),
	            p.getCliente().getNombre() + " " + (p.getCliente().getApellidos() != null ? p.getCliente().getApellidos() : "")
	        ));
	    }
	    return listaDTO;
	}

	// GET - obtener por id
	@GetMapping("/{id}")
	public ResponseEntity<PedidoDTO> obtenerPorId(@PathVariable Integer id) {
		Pedido p = servicePedido.buscarPorId(id);
		if (p == null)
			return ResponseEntity.notFound().build();
		return ResponseEntity.ok(toDTO(p));
	}

	// GET - obtener detalles de un pedido
	@GetMapping("/{id}/detalles")
	public ResponseEntity<List<DetallePedidoDTO>> obtenerDetalles(@PathVariable Integer id) {
		Pedido p = servicePedido.buscarPorId(id);
		if (p == null)
			return ResponseEntity.notFound().build();
		List<DetallePedidoDTO> detalles = new ArrayList<>();
		for (DetallePedido d : p.getDetalles()) {
			detalles.add(toDetalleDTO(d));
		}
		return ResponseEntity.ok(detalles);
	}

	// POST - crear pedido
	@PostMapping
	public ResponseEntity<PedidoDTO> crear(@RequestBody PedidoDTO dto) {
		Cliente cliente = serviceCliente.buscarPorId(dto.getIdCliente());
		if (cliente == null)
			return ResponseEntity.badRequest().build();
		Pedido p = new Pedido();
		p.setFechaEntrega(dto.getFechaEntrega());
		p.setEstado(dto.getEstado() != null ? dto.getEstado() : "Pendiente");
		p.setCliente(cliente);
		servicePedido.guardar(p);
		return ResponseEntity.status(201).body(toDTO(p));
	}

	// PUT - actualizar estado o fecha
	@PutMapping("/{id}")
	public ResponseEntity<PedidoDTO> actualizar(@PathVariable Integer id, @RequestBody PedidoDTO dto) {
		Pedido existente = servicePedido.buscarPorId(id);
		if (existente == null)
			return ResponseEntity.notFound().build();
		Cliente cliente = serviceCliente.buscarPorId(dto.getIdCliente());
		if (cliente == null)
			return ResponseEntity.badRequest().build();
		existente.setFechaEntrega(dto.getFechaEntrega());
		existente.setEstado(dto.getEstado());
		existente.setCliente(cliente);
		servicePedido.guardar(existente);

		// Si el pedido se marca como Entregado, completar todas sus tareas
		if ("Entregado".equals(dto.getEstado())) {
			List<TareaProgramada> tareas = serviceTareas.buscarTodas().stream()
					.filter(t -> t.getPedido().getIdPedido() == id).collect(java.util.stream.Collectors.toList());
			for (TareaProgramada t : tareas) {
				t.setEstado("Entregada");
				serviceTareas.guardar(t);
			}
		}

		return ResponseEntity.ok(toDTO(existente));
	}

	// DELETE
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
		Pedido existente = servicePedido.buscarPorId(id);
		if (existente == null)
			return ResponseEntity.notFound().build();
		servicePedido.eliminar(id);
		return ResponseEntity.noContent().build();
	}

	// POST - añadir detalle (producto) a un pedido
	@PostMapping("/{id}/detalles")
	public ResponseEntity<DetallePedidoDTO> añadirDetalle(@PathVariable Integer id, @RequestBody DetallePedidoDTO dto) {

	    Pedido pedido = servicePedido.buscarPorId(id);
	    Producto producto = serviceProductos.buscarPorId(dto.getIdProducto());
	    if (pedido == null || producto == null)
	        return ResponseEntity.badRequest().build();

	    // Guardar el detalle
	    DetallePedido detalle = new DetallePedido();
	    detalle.setPedido(pedido);
	    detalle.setProducto(producto);
	    detalle.setCantidad(dto.getCantidad());
	    detalle.setNotas(dto.getNotas());
	    detalle.setPrecioCongelado(
	            dto.getPrecioCongelado() != null ? dto.getPrecioCongelado() : producto.getPrecioBase());
	    if (pedido.getDetalles() == null) {
	        pedido.setDetalles(new java.util.ArrayList<>());
	    }
	    pedido.getDetalles().add(detalle);
	    servicePedido.guardar(pedido);

	    // Determinar plantilla a usar — primero del tamaño, luego del producto
	    PlantillaProceso plantillaAUsar = null;

	    if (dto.getIdRecetaTamaño() != null) {
	        RecetaTamaño recetaTam = serviceRecetaTamaño.buscarPorId(dto.getIdRecetaTamaño());
	        if (recetaTam != null && recetaTam.getPlantillaProceso() != null) {
	            plantillaAUsar = recetaTam.getPlantillaProceso();
	        }
	    }

	    // Fallback a plantilla del producto
	    if (plantillaAUsar == null && producto.getPlantillaProceso() != null) {
	        plantillaAUsar = producto.getPlantillaProceso();
	    }

	    // Generar tareas — un set por cada unidad pedida
	    if (plantillaAUsar != null) {
	        int idPlantilla = plantillaAUsar.getIdPlantilla();
	        List<ProcesoProduccion> procesos = serviceProcesos.buscarTodas().stream()
	                .filter(proc -> proc.getPlantillaProceso().getIdPlantilla() == idPlantilla)
	                .collect(java.util.stream.Collectors.toList());

	        int cantidad = detalle.getCantidad() != null ? detalle.getCantidad() : 1;

	        for (int u = 0; u < cantidad; u++) {
	            for (ProcesoProduccion proceso : procesos) {
	                java.util.Calendar cal = java.util.Calendar.getInstance();
	                cal.setTime(pedido.getFechaEntrega());
	                cal.add(java.util.Calendar.DAY_OF_MONTH, -proceso.getDiasAntesEntrega());
	                TareaProgramada tarea = new TareaProgramada();
	                tarea.setPedido(pedido);
	                tarea.setProcesoProduccion(proceso);
	                tarea.setFechaEjecucion(cal.getTime());
	                tarea.setEstado("Pendiente");
	                serviceTareas.guardar(tarea);
	            }
	        }
	    }

	    return ResponseEntity.status(201).body(toDetalleDTO(detalle));
	}
	
	@DeleteMapping("/detalles/{idDetalle}")
	public ResponseEntity<Void> eliminarDetalle(@PathVariable Integer idDetalle) {
	    DetallePedido detalle = serviceDetalles.buscarPorId(idDetalle);
	    if (detalle == null) return ResponseEntity.notFound().build();
	    serviceDetalles.eliminar(idDetalle);
	    return ResponseEntity.noContent().build();
	}

	// Helpers
	private PedidoDTO toDTO(Pedido p) {
	    return new PedidoDTO(
	        p.getIdPedido(),
	        p.getFechaEntrega(),
	        p.getEstado(),
	        p.getCliente().getIdCliente(),
	        p.getCliente().getNombre() + " " + (p.getCliente().getApellidos() != null ? p.getCliente().getApellidos() : "")
	    );
	}

	private DetallePedidoDTO toDetalleDTO(DetallePedido d) {
		return new DetallePedidoDTO(d.getIdDetalle(), d.getCantidad(), d.getNotas(), d.getPrecioCongelado(),
				d.getPedido().getIdPedido(), d.getProducto().getNombre(), d.getProducto().getIdProducto());
	}
}
