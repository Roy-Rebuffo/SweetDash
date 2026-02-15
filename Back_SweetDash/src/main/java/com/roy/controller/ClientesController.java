package com.roy.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.roy.model.Cliente;
import com.roy.service.IClientesService;

import java.util.List;

@Controller
@RequestMapping(value="/clientes")
public class ClientesController {

    @Autowired
    private IClientesService serviceClientes;

    @GetMapping("/index")
    public String mostrarIndex(Model model) {
        List<Cliente> lista = serviceClientes.buscarTodas();
        model.addAttribute("clientes", lista);
        return "clientes/listClientes";
    }

    // Método para mostrar el formulario de alta (crear)
    @GetMapping("/create")
    public String crear(Cliente cliente) {
        // Spring automáticamente pasa un objeto Cliente vacío para el th:object del form
        return "clientes/formCliente";
    }

    // Método para guardar o actualizar
    @PostMapping("/save")
    public String guardar(Cliente cliente, BindingResult result, RedirectAttributes attributes) {
        if (result.hasErrors()){
            // Si hay errores de validación (ej. campos vacíos), volvemos al formulario
            return "clientes/formCliente";
        }
        
        serviceClientes.guardar(cliente);
        attributes.addFlashAttribute("msg", "¡Cliente guardado con éxito!");
        return "redirect:/clientes/index";
    }

    // Método para cargar los datos en el formulario y editar
    @GetMapping("/edit/{id}")
    public String editar(@PathVariable("id") int idCliente, Model model) {
        Cliente cliente = serviceClientes.buscarPorId(idCliente);
        model.addAttribute("cliente", cliente);
        return "clientes/formCliente";
    }

    // Método para eliminar
    @GetMapping("/delete/{id}")
    public String eliminar(@PathVariable("id") int idCliente, RedirectAttributes attributes) {
        serviceClientes.eliminar(idCliente);
        attributes.addFlashAttribute("msg", "Cliente eliminado correctamente.");
        return "redirect:/clientes/index";
    }
}