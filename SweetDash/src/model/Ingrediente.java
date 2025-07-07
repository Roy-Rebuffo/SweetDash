package model;

public class Ingrediente {
    private String nombre;
    private double cantidad;
    private boolean caducidad;
    
    //Getter and Setter
    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public double getCantidad() {
        return cantidad;
    }

    public void setCantidad(double cantidad) {
        this.cantidad = cantidad;
    }

    public boolean isCaducidad() {
        return caducidad;
    }

    public void setCaducidad(boolean caducidad) {
        this.caducidad = caducidad;
    }
    
    //Constructor
    public Ingrediente() {
    }
    
    public Ingrediente(String nombre, double cantidad, boolean caducidad) {
        this.nombre = nombre;
        this.cantidad = cantidad;
        this.caducidad = caducidad;
    }
    
    //ToString
    @Override
    public String toString() {
        return nombre + 
                "cantidad: (" + cantidad + ") "
                + (caducidad ? "Caduca" : "No caduca");
    }
}
