package com.roy.dto;
import java.math.BigDecimal;

public class DetallePedidoDTO {
    private int idDetalle;
    private int cantidad;
    private String notas;
    private BigDecimal precioCongelado;
    private int idPedido;
    private String nombreProducto; // Muy útil para React

    public DetallePedidoDTO() {}

    public DetallePedidoDTO(int idDetalle, int cantidad, String notas, BigDecimal precioCongelado, int idPedido, String nombreProducto) {
        this.idDetalle = idDetalle;
        this.cantidad = cantidad;
        this.notas = notas;
        this.precioCongelado = precioCongelado;
        this.idPedido = idPedido;
        this.nombreProducto = nombreProducto;
    }

	public int getIdDetalle() {
		return idDetalle;
	}

	public void setIdDetalle(int idDetalle) {
		this.idDetalle = idDetalle;
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

	public BigDecimal getPrecioCongelado() {
		return precioCongelado;
	}

	public void setPrecioCongelado(BigDecimal precioCongelado) {
		this.precioCongelado = precioCongelado;
	}

	public int getIdPedido() {
		return idPedido;
	}

	public void setIdPedido(int idPedido) {
		this.idPedido = idPedido;
	}

	public String getNombreProducto() {
		return nombreProducto;
	}

	public void setNombreProducto(String nombreProducto) {
		this.nombreProducto = nombreProducto;
	}
    
}