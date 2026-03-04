package com.roy.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.roy.dto.PedidoDTO;
import com.roy.model.Pedido;
import com.roy.service.IPedidosService;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*")
public class PedidosController {

    @Autowired
    private IPedidosService servicePedidos; // Asegúrate de tener esta interfaz y su impl

    @GetMapping
    public List<PedidoDTO> obtenerTodos() {
        List<Pedido> listaBD = servicePedidos.buscarTodas();
        List<PedidoDTO> listaDTO = new ArrayList<>();

        for (Pedido p : listaBD) {
            listaDTO.add(new PedidoDTO(
                p.getIdPedido(),
                p.getFechaEntrega(),
                p.getEstado(),
                p.getCliente().getIdCliente(),
                p.getCliente().getNombre()
            ));
        }
        return listaDTO;
    }
}
