package model;

import java.time.LocalDate;

public class Ingrediente {

    private String nombre;
    private double cantidad;
    private LocalDate fechaCaducidad;  // Cambiamos boolean por LocalDate

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

    public LocalDate getFechaCaducidad() {
        return fechaCaducidad;
    }

    public void setFechaCaducidad(LocalDate fechaCaducidad) {
        this.fechaCaducidad = fechaCaducidad;
    }

    //Constructor
    public Ingrediente() {
    }

    public Ingrediente(String nombre, double cantidad, LocalDate fechaCaducidad) {
        this.nombre = nombre;
        this.cantidad = cantidad;
        this.fechaCaducidad = fechaCaducidad;
    }

    //ToString
     @Override
    public String toString() {
        return "-Ingrediente-" + "\n" +
               "nombre: " + nombre + "\n" +
               "cantidad: " + cantidad + "\n" +
               "caducidad: " + (fechaCaducidad != null ? fechaCaducidad : "No caduca") + "\n" +
               "estado: " + (estaCaducado() ? "¡CADUCADO!" : "Válido") + "\n";
    }

    //Metodos
    //verificar si el ingrediente está caducado
    public boolean estaCaducado() {
        return fechaCaducidad != null && LocalDate.now().isAfter(fechaCaducidad);
    }
}
