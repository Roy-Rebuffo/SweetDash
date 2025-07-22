package model;

import java.time.LocalDate;

public class TareaProgramada {
    private String nombreTarea;
    private LocalDate fecha;
    private Pedido pedidoReferencia;
    
    //Getter and Setter
    public String getNombreTarea() {
        return nombreTarea;
    }

    public void setNombreTarea(String nombreTarea) {
        this.nombreTarea = nombreTarea;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public Pedido getPedidoReferencia() {
        return pedidoReferencia;
    }

    public void setPedidoReferencia(Pedido pedidoReferencia) {
        this.pedidoReferencia = pedidoReferencia;
    }
    
    //Constructor
    public TareaProgramada() {
    }
    
    public TareaProgramada(String nombreTarea, LocalDate fecha, Pedido pedidoReferencia) {
        this.nombreTarea = nombreTarea;
        this.fecha = fecha;
        this.pedidoReferencia = pedidoReferencia;
    }
    
    //toString
    @Override
    public String toString() {
        return "- Tarea Programada -" + "\n" +
               "Tarea: " + nombreTarea + "\n" +
               "Fecha: " + fecha + "\n" +
               "Pedido: " + pedidoReferencia.getId() + "\n";
    }
}
