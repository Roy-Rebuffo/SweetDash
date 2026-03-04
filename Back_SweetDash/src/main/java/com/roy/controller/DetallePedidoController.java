package com.roy.controller;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.roy.model.DetallePedido;
import com.roy.dto.DetallePedidoDTO;
import com.roy.service.IDetallesPedidosService;

@RestController
@RequestMapping("/api/detalles-pedidos")
@CrossOrigin(origins = "*")
public class DetallePedidoController {

    @Autowired
    private IDetallesPedidosService serviceDetalles;

    @GetMapping
    public List<DetallePedidoDTO> obtenerTodos() {
        List<DetallePedido> listaBD = serviceDetalles.buscarTodas();
        List<DetallePedidoDTO> listaDTO = new ArrayList<>();

        for (DetallePedido d : listaBD) {
            listaDTO.add(new DetallePedidoDTO(
                d.getIdDetalle(),
                d.getCantidad(),
                d.getNotas(),
                d.getPrecioCongelado(),
                d.getPedido().getIdPedido(),
                d.getProducto().getNombre()
            ));
        }
        return listaDTO;
    }
}