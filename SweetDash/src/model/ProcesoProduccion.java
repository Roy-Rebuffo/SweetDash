package model;

public class ProcesoProduccion {
    private String nombre; // Ej: "Hacer bizcocho"
    private int diasAntesEntrega; // Ej: 3 (días antes de la entrega)

    //Getter and Setter
    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public int getDiasAntesEntrega() {
        return diasAntesEntrega;
    }

    public void setDiasAntesEntrega(int diasAntesEntrega) {
        this.diasAntesEntrega = diasAntesEntrega;
    }

    //Contstructor
    public ProcesoProduccion() {
    }

    public ProcesoProduccion(String nombre, int diasAntesEntrega) {
        this.nombre = nombre;
        this.diasAntesEntrega = diasAntesEntrega;
    }
    
    
}
