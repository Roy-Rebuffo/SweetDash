package com.roy.model;

import java.io.Serializable;
import java.util.List;

import jakarta.persistence.*;


/**
 * The persistent class for the stock_material database table.
 * 
 */
@Entity
@Table(name="stock_material")
@NamedQuery(name="StockMaterial.findAll", query="SELECT s FROM StockMaterial s")
public class StockMaterial implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="id_stock")
	private Integer idStock;

	@Column(name="cantidad_stock")
	private Integer cantidadStock;

	private String nombre;
	
	@Column(name="stock_maximo")
	private Integer stockMaximo;
	
	@OneToMany(mappedBy="stockMaterial")
	private List<MaterialPedido> usosEnPedidos;

	public StockMaterial() {
	}

	public Integer getIdStock() {
		return this.idStock;
	}

	public void setIdStock(Integer idStock) {
		this.idStock = idStock;
	}

	public Integer getCantidadStock() {
		return this.cantidadStock;
	}

	public void setCantidadStock(Integer cantidadStock) {
		this.cantidadStock = cantidadStock;
	}

	public String getNombre() {
		return this.nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}
	
	public Integer getStockMaximo() {
	    return this.stockMaximo;
	}
	
	public void setStockMaximo(Integer stockMaximo) {
	    this.stockMaximo = stockMaximo;
	}
	
	public List<MaterialPedido> getUsosEnPedidos() {
		return usosEnPedidos;
	}

	public void setUsosEnPedidos(List<MaterialPedido> usosEnPedidos) {
		this.usosEnPedidos = usosEnPedidos;
	}

}