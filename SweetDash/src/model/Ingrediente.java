package model;

import java.time.LocalDate;

public class Ingrediente {

    private String nombre;
    private double cantidad;
    private LocalDate fechaCaducidad;
    private String unidadMedida;

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

    public String getUnidadMedida() {
        return unidadMedida;
    }

    public void setUnidadMedida(String unidadMedida) {
        this.unidadMedida = unidadMedida;
    }

    //Constructor
    public Ingrediente() {
    }

    public Ingrediente(String nombre, double cantidad, LocalDate fechaCaducidad,
            String unidadMedida) {
        this.nombre = nombre;
        this.cantidad = cantidad;
        this.fechaCaducidad = fechaCaducidad;
        this.unidadMedida = unidadMedida;
    }

    //ToString
    @Override
    public String toString() {
        return "-Ingrediente-" + "\n"
                + "nombre: " + nombre + "\n"
                + "cantidad: " + cantidad + " " + unidadMedida + "\n"
                + "caducidad: " + (fechaCaducidad != null ? fechaCaducidad : "No caduca") + "\n"
                + "estado: " + (estaCaducado() ? "¡CADUCADO!" : "Valido") + "\n";
    }

    //Metodos
    //verificar si el ingrediente está caducado
    public boolean estaCaducado() {
        return fechaCaducidad != null && LocalDate.now().isAfter(fechaCaducidad);
    }
}
