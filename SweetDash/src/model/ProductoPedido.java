package model;

import java.util.UUID;

public class ProductoPedido {
    private String id;
    private Producto producto;
    private int cantidad;
    private String notas; //Sin gluten,...
    private double precioEnPedido; // Precio congelado

    //Getter and Setter
    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
    
    public int getCantidad() {
        return cantidad;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }

    public String getNotas() {
        return notas;
    }

    public void setNotas(String notas) {
        this.notas = notas;
    }

    public double getPrecioEnPedido() {
        return precioEnPedido;
    }

    public void setPrecioEnPedido(double precioEnPedido) {
        this.precioEnPedido = precioEnPedido;
    }
    
    //Constructor

    public ProductoPedido() {
    }
    
    public ProductoPedido(Producto producto, int cantidad, String notas,
            double precioEnPedido) {
      
        this.id = "PED-" + UUID.randomUUID().toString().substring(0, 8); // Ej: "PED-A3B5F2C"
        
        this.producto = producto;
        this.cantidad = cantidad;
        this.notas = notas;
        this.precioEnPedido = precioEnPedido;
    }

    @Override
    public String toString() {
        return "-Producto Pedido- " + "\n" +
                "id: " + id + "\n" +
                "producto: " + producto + "\n" +
                "cantidad: " + cantidad + "\n" +
                "notas: " + notas + "\n" +
                "precioEnPedido: " + precioEnPedido + "\n";
    }
    
}
