package model;

import java.util.List;
import java.util.UUID;

public class Producto {
    private String id;
    private String nombre;
    private String descripcion;
    private String tipo;
    private List <Ingrediente> ingredientes;
    private int cantidadPersonas;
    
    //Getter and Setter
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public List<Ingrediente> getIngredientes() {
        return ingredientes;
    }

    public void setIngredientes(List<Ingrediente> ingredientes) {
        this.ingredientes = ingredientes;
    }

    public int getCantidadPersonas() {
        return cantidadPersonas;
    }

    public void setCantidadPersonas(int cantidadPersonas) {
        this.cantidadPersonas = cantidadPersonas;
    }
    
    //Constructor
    public Producto() {
    }

    public Producto(String id, String nombre, String descripcion, String tipo, List<Ingrediente> ingredientes, int cantidadPersonas) {
        this.id = "PROD-" + UUID.randomUUID().toString().substring(0, 8);  // Ej: "PROD-A3B5F2C
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.tipo = tipo;
        this.ingredientes = ingredientes;
        this.cantidadPersonas = cantidadPersonas;
    }
    
    
}
