	package com.roy.model;

import java.io.Serializable;
import jakarta.persistence.*;
import java.util.Date;
import java.util.List;


/**
 * The persistent class for the materia_prima database table.
 * 
 */
@Entity
@Table(name="materia_prima")
@NamedQuery(name="MateriaPrima.findAll", query="SELECT m FROM MateriaPrima m")
public class MateriaPrima implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="id_materia_prima")
	private int idMateriaPrima;

	@Column(name="cantidad_stock")
	private double cantidadStock;

	@Temporal(TemporalType.DATE)
	@Column(name="fecha_caducidad")
	private Date fechaCaducidad;

	private String nombre;

	private String unidad;
	
	@Column(name="stock_maximo")
	private int stockMaximo;

	//bi-directional many-to-one association to Receta
	@OneToMany(mappedBy="materiaPrima")
	private List<Receta> recetas;
	
	@Column(name="precio_paquete")
	private java.math.BigDecimal precioPaquete;

	@Column(name="unidades_paquete")
	private java.math.BigDecimal unidadesPaquete;

	public MateriaPrima() {
	}

	public int getIdMateriaPrima() {
		return this.idMateriaPrima;
	}

	public void setIdMateriaPrima(int idMateriaPrima) {
		this.idMateriaPrima = idMateriaPrima;
	}

	public double getCantidadStock() {
		return this.cantidadStock;
	}

	public void setCantidadStock(double cantidadStock) {
		this.cantidadStock = cantidadStock;
	}

	public Date getFechaCaducidad() {
		return this.fechaCaducidad;
	}

	public void setFechaCaducidad(Date fechaCaducidad) {
		this.fechaCaducidad = fechaCaducidad;
	}

	public String getNombre() {
		return this.nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getUnidad() {
		return this.unidad;
	}

	public void setUnidad(String unidad) {
		this.unidad = unidad;
	}
	
	public int getStockMaximo() {
	    return this.stockMaximo;
	}
	
	public void setStockMaximo(int stockMaximo) {
	    this.stockMaximo = stockMaximo;
	}

	public List<Receta> getRecetas() {
		return this.recetas;
	}

	public void setRecetas(List<Receta> recetas) {
		this.recetas = recetas;
	}

	public Receta addReceta(Receta receta) {
		getRecetas().add(receta);
		receta.setMateriaPrima(this);

		return receta;
	}

	public Receta removeReceta(Receta receta) {
		getRecetas().remove(receta);
		receta.setMateriaPrima(null);

		return receta;
	}
	
	public java.math.BigDecimal getPrecioPaquete() {
	    return precioPaquete;
	}
	public void setPrecioPaquete(java.math.BigDecimal precioPaquete) {
	    this.precioPaquete = precioPaquete;
	}

	public java.math.BigDecimal getUnidadesPaquete() {
	    return unidadesPaquete;
	}
	
	public void setUnidadesPaquete(java.math.BigDecimal unidadesPaquete) {
	    this.unidadesPaquete = unidadesPaquete;
	}
}