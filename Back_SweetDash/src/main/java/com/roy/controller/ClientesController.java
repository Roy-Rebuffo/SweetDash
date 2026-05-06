package com.roy.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

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
    
 // GET - obtener por id
    @GetMapping("/{id}")
    public ResponseEntity<ClienteDTO> obtenerPorId(@PathVariable Integer id) {
        Cliente c = serviceClientes.buscarPorId(id);
        if (c == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(toDTO(c));
    }

    // POST - crear
    @PostMapping
    public ResponseEntity<ClienteDTO> crear(@RequestBody ClienteDTO dto) {
        Cliente c = toEntity(dto);
        serviceClientes.guardar(c);
        return ResponseEntity.status(201).body(toDTO(c));
    }

    // PUT - actualizar
    @PutMapping("/{id}")
    public ResponseEntity<ClienteDTO> actualizar(@PathVariable Integer id, @RequestBody ClienteDTO dto) {
        Cliente existente = serviceClientes.buscarPorId(id);
        if (existente == null) return ResponseEntity.notFound().build();
        existente.setNombre(dto.getNombre());
        existente.setApellidos(dto.getApellidos());
        existente.setDireccion(dto.getDireccion());
        existente.setEmail(dto.getEmail());
        existente.setTelefono(dto.getTelefono());
        existente.setNotas(dto.getNotas());
        serviceClientes.guardar(existente);
        return ResponseEntity.ok(toDTO(existente));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        Cliente existente = serviceClientes.buscarPorId(id);
        if (existente == null) return ResponseEntity.notFound().build();
        serviceClientes.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    // Helpers
    private ClienteDTO toDTO(Cliente c) {
        return new ClienteDTO(
            c.getIdCliente(),
            c.getNombre(),
            c.getApellidos(),
            c.getDireccion(),
            c.getEmail(),
            c.getTelefono(),
            c.getNotas()
        );
    }

    private Cliente toEntity(ClienteDTO dto) {
        Cliente c = new Cliente();
        c.setNombre(dto.getNombre());
        c.setApellidos(dto.getApellidos());
        c.setDireccion(dto.getDireccion());
        c.setEmail(dto.getEmail());
        c.setTelefono(dto.getTelefono());
        c.setNotas(dto.getNotas());
        return c;
    }
}