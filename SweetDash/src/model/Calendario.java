package model;

import java.util.List;

public class Calendario {

    private List<Pedido> pedidos;
    private List<TareaProgramada> tareas;
    
    //Getter and Setters
    public List<Pedido> getPedidos() {
        return pedidos;
    }

    public void setPedidos(List<Pedido> pedidos) {
        this.pedidos = pedidos;
    }

    public List<TareaProgramada> getTareas() {
        return tareas;
    }

    public void setTareas(List<TareaProgramada> tareas) {
        this.tareas = tareas;
    }
    
    //Constructor
    public Calendario() {
    }

    public Calendario(List<Pedido> pedidos, List<TareaProgramada> tareas) {
        this.pedidos = pedidos;
        this.tareas = tareas;
    }
    
    //toString
    @Override
    public String toString() {
        return "-Calendario-" + "\n" +
                "pedidos: " + pedidos + "\n" +
                "tareas: " + tareas + "\n";
    }
    
}
