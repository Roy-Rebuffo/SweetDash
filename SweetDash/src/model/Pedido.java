package model;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public class Pedido {
    private String id;
    private Cliente cliente; //Conexion con model/cliente
    private LocalDate fechaEntrega;
    private String estado;
    private List <ProductoPedido> productos; //Conexion con model/productoPedido

    //Getter and Setter
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public LocalDate getFechaEntrega() {
        return fechaEntrega;
    }

    public void setFechaEntrega(LocalDate fechaEntrega) {
        this.fechaEntrega = fechaEntrega;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public List<ProductoPedido> getProductos() {
        return productos;
    }

    public void setProductos(List<ProductoPedido> productos) {
        this.productos = productos;
    }

    //Constructor
    public Pedido() {
    }

    public Pedido(Cliente cliente, List<ProductoPedido> productos, LocalDate fechaEntrega) {
        this.id = "PED-" + UUID.randomUUID().toString().substring(0, 8);
        this.cliente = cliente;
        this.fechaEntrega = fechaEntrega;
        this.estado = "PENDIENTE";
        this.productos = productos;
    }
    
    //toString
    @Override
    public String toString() {
        return "-Pedido-" +"\n"+
                "id: " + id +"\n"+
                "cliente: " + cliente +"\n"+
                "fechaEntrega: " + fechaEntrega +"\n"+
                "estado: " + estado + "\n"+
                "productos: " + productos + "\n";
    }
    
}
