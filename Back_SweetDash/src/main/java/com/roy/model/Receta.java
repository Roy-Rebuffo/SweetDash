package com.roy.model;

import java.io.Serializable;
import jakarta.persistence.*;


/**
 * The persistent class for the receta database table.
 * 
 */
@Entity
@NamedQuery(name="Receta.findAll", query="SELECT r FROM Receta r")
public class Receta implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="id_receta")
	private Integer idReceta;

	@Column(name="cantidad_necesaria")
	private double cantidadNecesaria;

	//bi-directional many-to-one association to MateriaPrima
	@ManyToOne
	@JoinColumn(name="id_materia_prima")
	private MateriaPrima materiaPrima;

	//bi-directional many-to-one association to Producto
	@ManyToOne
	@JoinColumn(name="id_producto")
	private Producto producto;

	public Receta() {
	}

	public Integer getIdReceta() {
		return this.idReceta;
	}

	public void setIdReceta(Integer idReceta) {
		this.idReceta = idReceta;
	}

	public double getCantidadNecesaria() {
		return this.cantidadNecesaria;
	}

	public void setCantidadNecesaria(double cantidadNecesaria) {
		this.cantidadNecesaria = cantidadNecesaria;
	}

	public MateriaPrima getMateriaPrima() {
		return this.materiaPrima;
	}

	public void setMateriaPrima(MateriaPrima materiaPrima) {
		this.materiaPrima = materiaPrima;
	}

	public Producto getProducto() {
		return this.producto;
	}

	public void setProducto(Producto producto) {
		this.producto = producto;
	}

}