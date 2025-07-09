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
    private double precioBase; // Nuevo campo
    private PlantillaProceso plantilla;
    
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

    public double getPrecioBase() {
        return precioBase;
    }

    public void setPrecioBase(double precioBase) {
        this.precioBase = precioBase;
    }

    public PlantillaProceso getPlantilla() {
        return plantilla;
    }

    public void setPlantilla(PlantillaProceso plantilla) {
        this.plantilla = plantilla;
    }
    
    //Constructor
    public Producto() {
    }

    public Producto(String nombre, String descripcion, String tipo, 
            List<Ingrediente> ingredientes, int cantidadPersonas, 
            double precioBase, PlantillaProceso plantilla) {
        
        this.id = "ITEM-" + UUID.randomUUID().toString().substring(0, 8); // Ej: "PROD-A3B5F2C"
        
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.tipo = tipo;
        this.ingredientes = ingredientes;
        this.cantidadPersonas = cantidadPersonas;
        this.precioBase = precioBase;
        this.plantilla = plantilla;
    }
    
    //toString
    @Override
    public String toString() {
        return "-Producto-" + "\n" +
                "id: " + id + "\n" +
                "nombre: " + nombre + "\n" +
                "descripcion: " + descripcion + "\n" +
                "tipo: " + tipo + "\n" +
                "ingredientes: " + ingredientes + "\n" +
                "cantidad personas: " + cantidadPersonas + "\n" +
                "precio base: " + precioBase + "\n";
    }
    
}
