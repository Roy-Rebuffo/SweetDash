package com.roy.dto;
import java.math.BigDecimal;

public class DetallePedidoDTO {
    private Integer idDetalle;
    private Integer cantidad;
    private String notas;
    private BigDecimal precioCongelado;
    private Integer idPedido;
    private String nombreProducto; // Muy útil para React
    private Integer idProducto;

    public DetallePedidoDTO() {}

    public DetallePedidoDTO(Integer idDetalle, Integer cantidad, String notas, BigDecimal precioCongelado, Integer idPedido, String nombreProducto, Integer idProducto) {
        this.idDetalle = idDetalle;
        this.cantidad = cantidad;
        this.notas = notas;
        this.precioCongelado = precioCongelado;
        this.idPedido = idPedido;
        this.nombreProducto = nombreProducto;
        this.idProducto = idProducto;
    }

	public Integer getIdDetalle() {
		return idDetalle;
	}

	public void setIdDetalle(Integer idDetalle) {
		this.idDetalle = idDetalle;
	}

	public Integer getCantidad() {
		return cantidad;
	}

	public void setCantidad(Integer cantidad) {
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

	public Integer getIdPedido() {
		return idPedido;
	}

	public void setIdPedido(Integer idPedido) {
		this.idPedido = idPedido;
	}

	public String getNombreProducto() {
		return nombreProducto;
	}

	public void setNombreProducto(String nombreProducto) {
		this.nombreProducto = nombreProducto;
	}
	
	public Integer getIdProducto() {
	    return idProducto;
	}
	public void setIdProducto(Integer idProducto) {
	    this.idProducto = idProducto;
	}
    
}