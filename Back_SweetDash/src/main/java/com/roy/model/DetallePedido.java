package com.roy.model;

import java.io.Serializable;
import jakarta.persistence.*;
import java.math.BigDecimal;


/**
 * The persistent class for the detalle_pedido database table.
 * 
 */
@Entity
@Table(name="detalle_pedido")
@NamedQuery(name="DetallePedido.findAll", query="SELECT d FROM DetallePedido d")
public class DetallePedido implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="id_detalle")
	private int idDetalle;

	private int cantidad;
	
    @Lob
	private String notas;
    
	@Column(name="precio_congelado")
	private BigDecimal precioCongelado;

	// CORRECCIÓN: En vez de idPedido (int), ponemos el Objeto
	@ManyToOne
	@JoinColumn(name="id_pedido")
	private Pedido pedido;

	// CORRECCIÓN: En vez de idProducto (int), ponemos el Objeto
	@ManyToOne
	@JoinColumn(name="id_producto")
	private Producto producto;

	public DetallePedido() {
	}

	public int getIdDetalle() {
		return this.idDetalle;
	}

	public void setIdDetalle(int idDetalle) {
		this.idDetalle = idDetalle;
	}

	public int getCantidad() {
		return this.cantidad;
	}

	public void setCantidad(int cantidad) {
		this.cantidad = cantidad;
	}

	public Pedido getPedido() { return pedido; }
	
	public void setPedido(Pedido pedido) { this.pedido = pedido; }

	public Producto getProducto() { return producto; }
	
	public void setProducto(Producto producto) { this.producto = producto; }

	public String getNotas() {
		return this.notas;
	}

	public void setNotas(String notas) {
		this.notas = notas;
	}

	public BigDecimal getPrecioCongelado() {
		return this.precioCongelado;
	}

	public void setPrecioCongelado(BigDecimal precioCongelado) {
		this.precioCongelado = precioCongelado;
	}

}