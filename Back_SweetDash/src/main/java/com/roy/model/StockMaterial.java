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
	private int idStock;

	@Column(name="cantidad_stock")
	private int cantidadStock;

	private String nombre;
	
	@Column(name="stock_maximo")
	private int stockMaximo;
	
	@OneToMany(mappedBy="stockMaterial")
	private List<MaterialPedido> usosEnPedidos;

	public StockMaterial() {
	}

	public int getIdStock() {
		return this.idStock;
	}

	public void setIdStock(int idStock) {
		this.idStock = idStock;
	}

	public int getCantidadStock() {
		return this.cantidadStock;
	}

	public void setCantidadStock(int cantidadStock) {
		this.cantidadStock = cantidadStock;
	}

	public String getNombre() {
		return this.nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}
	
	public int getStockMaximo() {
	    return this.stockMaximo;
	}
	
	public void setStockMaximo(int stockMaximo) {
	    this.stockMaximo = stockMaximo;
	}
	
	public List<MaterialPedido> getUsosEnPedidos() {
		return usosEnPedidos;
	}

	public void setUsosEnPedidos(List<MaterialPedido> usosEnPedidos) {
		this.usosEnPedidos = usosEnPedidos;
	}

}