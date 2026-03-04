package com.roy.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.roy.model.Cliente;
import com.roy.dto.ClienteDTO;
import com.roy.service.IClientesService;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "*") // Esto es clave para que React no te de error de CORS
public class ClientesController {

    @Autowired
    private IClientesService serviceClientes;
    
    @GetMapping
    public List<ClienteDTO> obtenerClientes() {
        // 1. Buscamos las entidades en la base de datos
        List<Cliente> clientesBD = serviceClientes.buscarTodas();
        
        // 2. Creamos una lista vacía para nuestros DTOs
        List<ClienteDTO> clientesParaReact = new ArrayList<>();
        
        // 3. Traducimos uno a uno (Mapeo)
        for (Cliente c : clientesBD) {
            ClienteDTO dto = new ClienteDTO(
                c.getIdCliente(),
                c.getNombre(),
                c.getApellidos(),
                c.getDireccion(),
                c.getEmail(),
                c.getTelefono(),
                c.getNotas()
            );
            clientesParaReact.add(dto);
        }
        
        // 4. Devolvemos la lista limpia
        return clientesParaReact;
    }
}