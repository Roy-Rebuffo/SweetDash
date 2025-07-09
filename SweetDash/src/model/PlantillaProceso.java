package model;

import java.util.List;

public class PlantillaProceso {
    private String nombre; // Ej: "Tarta Dulce de Leche - 8 porciones"
    private List<ProcesoProduccion> pasos;
    
    //Getter and Setter
    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public List<ProcesoProduccion> getPasos() {
        return pasos;
    }

    public void setPasos(List<ProcesoProduccion> pasos) {
        this.pasos = pasos;
    }
    //Constructor

    public PlantillaProceso() {
    }
    
    public PlantillaProceso(String nombre, List<ProcesoProduccion> pasos) {
        this.nombre = nombre;
        this.pasos = pasos;
    }
    
}
