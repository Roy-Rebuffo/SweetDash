package com.roy.model;

import java.io.Serializable;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name="material_pedido")
@NamedQuery(name="MaterialPedido.findAll", query="SELECT m FROM MaterialPedido m")
public class MaterialPedido implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="id_material_pedido")
	private int idMaterialPedido;

	@Column(name="cantidad_necesaria")
	private int cantidadNecesaria;

	@Column(name="precio_venta")
	private BigDecimal precioVenta;

	// Relación con Pedido
	@ManyToOne
	@JoinColumn(name="id_pedido")
	private Pedido pedido;

	// Relación con StockMaterial
	@ManyToOne
	@JoinColumn(name="id_stock")
	private StockMaterial stockMaterial;

	public MaterialPedido() {
	}

	public int getIdMaterialPedido() {
		return this.idMaterialPedido;
	}

	public void setIdMaterialPedido(int idMaterialPedido) {
		this.idMaterialPedido = idMaterialPedido;
	}

	public int getCantidadNecesaria() {
		return this.cantidadNecesaria;
	}

	public void setCantidadNecesaria(int cantidadNecesaria) {
		this.cantidadNecesaria = cantidadNecesaria;
	}

	public BigDecimal getPrecioVenta() {
		return this.precioVenta;
	}

	public void setPrecioVenta(BigDecimal precioVenta) {
		this.precioVenta = precioVenta;
	}

	public Pedido getPedido() {
		return this.pedido;
	}

	public void setPedido(Pedido pedido) {
		this.pedido = pedido;
	}

	public StockMaterial getStockMaterial() {
		return this.stockMaterial;
	}

	public void setStockMaterial(StockMaterial stockMaterial) {
		this.stockMaterial = stockMaterial;
	}
}