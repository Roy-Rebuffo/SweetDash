package com.roy.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.roy.dto.TareaProgramadaDTO;
import com.roy.model.TareaProgramada;
import com.roy.service.IPedidosService;
import com.roy.service.IProcesosProduccionService;
import com.roy.service.ITareasProgramadasService;
import com.roy.model.Pedido;
import com.roy.model.ProcesoProduccion;

@RestController
@RequestMapping("/api/tareas")
@CrossOrigin(origins = "*")
public class TareasController {

    @Autowired
    private ITareasProgramadasService serviceTareas;
    
    @Autowired
    private IPedidosService servicePedidos;
    
    @Autowired
    private IProcesosProduccionService serviceProcesos;

    @GetMapping
    public List<TareaProgramadaDTO> obtenerTodas() {
        List<TareaProgramada> listaBD = serviceTareas.buscarTodas();
        List<TareaProgramadaDTO> listaDTO = new ArrayList<>();

        for (TareaProgramada t : listaBD) {
            listaDTO.add(new TareaProgramadaDTO(
                t.getIdTarea(),
                t.getEstado(),
                t.getFechaEjecucion(),
                t.getPedido().getIdPedido(),
                t.getProcesoProduccion().getNombre(),
                t.getProcesoProduccion().getDiasAntesEntrega()
            ));
        }
        return listaDTO;
    }
    
    @GetMapping("/pedido/{idPedido}")
    public List<TareaProgramadaDTO> obtenerPorPedido(@PathVariable Integer idPedido) {
        List<TareaProgramada> todas = serviceTareas.buscarTodas();
        List<TareaProgramadaDTO> resultado = new ArrayList<>();
        for (TareaProgramada t : todas) {
            if (t.getPedido().getIdPedido().equals(idPedido)) {
                resultado.add(new TareaProgramadaDTO(
                    t.getIdTarea(),
                    t.getEstado(),
                    t.getFechaEjecucion(),
                    t.getPedido().getIdPedido(),
                    t.getProcesoProduccion().getNombre(),
                    t.getProcesoProduccion().getDiasAntesEntrega()
                ));
            }
        }
        return resultado;
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<TareaProgramadaDTO> actualizarEstado(
            @PathVariable Integer id,
            @RequestBody TareaProgramadaDTO dto) {
        TareaProgramada tarea = serviceTareas.buscarPorId(id);
        if (tarea == null) return ResponseEntity.notFound().build();
        tarea.setEstado(dto.getEstado());
        serviceTareas.guardar(tarea);
        return ResponseEntity.ok(new TareaProgramadaDTO(
            tarea.getIdTarea(),
            tarea.getEstado(),
            tarea.getFechaEjecucion(),
            tarea.getPedido().getIdPedido(),
            tarea.getProcesoProduccion().getNombre(),
            tarea.getProcesoProduccion().getDiasAntesEntrega()
        ));
    }
    
    @PutMapping("/{id}/fecha")
    public ResponseEntity<TareaProgramadaDTO> actualizarFecha(
            @PathVariable Integer id,
            @RequestBody TareaProgramadaDTO dto) {
        TareaProgramada tarea = serviceTareas.buscarPorId(id);
        if (tarea == null) return ResponseEntity.notFound().build();
        tarea.setFechaEjecucion(dto.getFechaEjecucion());
        serviceTareas.guardar(tarea);
        return ResponseEntity.ok(new TareaProgramadaDTO(
            tarea.getIdTarea(),
            tarea.getEstado(),
            tarea.getFechaEjecucion(),
            tarea.getPedido().getIdPedido(),
            tarea.getProcesoProduccion().getNombre(),
            tarea.getProcesoProduccion().getDiasAntesEntrega()
        ));
    }
    
    @PutMapping("/recalcular/plantilla/{idPlantilla}")
    public ResponseEntity<Void> recalcularPorPlantilla(@PathVariable Integer idPlantilla) {
        // Obtener todos los pedidos activos (no entregados)
        List<Pedido> pedidosActivos = servicePedidos.buscarTodas().stream()
            .filter(p -> !"Entregado".equals(p.getEstado()))
            .collect(java.util.stream.Collectors.toList());

        // Obtener los nuevos procesos de la plantilla
        List<ProcesoProduccion> procesos = serviceProcesos.buscarTodas().stream()
            .filter(proc -> proc.getPlantillaProceso().getIdPlantilla().equals(idPlantilla))
            .collect(java.util.stream.Collectors.toList());

        for (Pedido pedido : pedidosActivos) {
            // Comprobar si algún detalle del pedido usa esta plantilla
            boolean usaPlantilla = pedido.getDetalles().stream()
                .anyMatch(d -> d.getProducto().getPlantillaProceso() != null &&
                    d.getProducto().getPlantillaProceso().getIdPlantilla().equals(idPlantilla));

            if (!usaPlantilla) continue;

            // Borrar tareas antiguas asociadas a procesos de esta plantilla
            List<TareaProgramada> tareasAntiguas = serviceTareas.buscarTodas().stream()
                .filter(t -> t.getPedido().getIdPedido() == pedido.getIdPedido() &&
                    t.getProcesoProduccion().getPlantillaProceso().getIdPlantilla().equals(idPlantilla))
                .collect(java.util.stream.Collectors.toList());
            for (TareaProgramada t : tareasAntiguas) {
                serviceTareas.eliminar(t.getIdTarea());
            }

            // Crear nuevas tareas con los procesos actualizados
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

        return ResponseEntity.ok().build();
    }
}