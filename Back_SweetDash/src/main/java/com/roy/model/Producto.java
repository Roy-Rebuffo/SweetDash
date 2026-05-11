package com.roy.model;

import java.io.Serializable;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.List;


/**
 * The persistent class for the producto database table.
 * 
 */
@Entity
@NamedQuery(name="Producto.findAll", query="SELECT p FROM Producto p")
public class Producto implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="id_producto")
	private Integer idProducto;

	private String nombre;
	@Lob
	private String descripcion;
	private String tipo;
    @Column(name="cantidad_personas")
	private String cantidadPersonas;
	@Column(name="precio_base")
	private BigDecimal precioBase;
	
	@Column(name="imagen_url")
	private String imagenUrl;

	//bi-directional many-to-one association to PlantillaProceso
	@ManyToOne
	@JoinColumn(name="id_plantilla")
	private PlantillaProceso plantillaProceso;

	//bi-directional many-to-one association to Receta
	@OneToMany(mappedBy="producto")
	private List<Receta> recetas;
	
	@OneToMany(mappedBy="producto")
    private List<DetallePedido> ventas;
	
	@Column(name="coste_fijo")
	private BigDecimal costeFijo;

	public Producto() {
	}

	public Integer getIdProducto() {
		return this.idProducto;
	}

	public void setIdProducto(Integer idProducto) {
		this.idProducto = idProducto;
	}

	public String getCantidadPersonas() {
		return this.cantidadPersonas;
	}

	public void setCantidadPersonas(String cantidadPersonas) {
		this.cantidadPersonas = cantidadPersonas;
	}

	public String getDescripcion() {
		return this.descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public String getNombre() {
		return this.nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public BigDecimal getPrecioBase() {
		return this.precioBase;
	}

	public void setPrecioBase(BigDecimal precioBase) {
		this.precioBase = precioBase;
	}
	
	public String getImagenUrl() {
	    return this.imagenUrl;
	}
	
	public void setImagenUrl(String imagenUrl) {
	    this.imagenUrl = imagenUrl;
	}

	public String getTipo() {
		return this.tipo;
	}

	public void setTipo(String tipo) {
		this.tipo = tipo;
	}

	public PlantillaProceso getPlantillaProceso() {
		return this.plantillaProceso;
	}

	public void setPlantillaProceso(PlantillaProceso plantillaProceso) {
		this.plantillaProceso = plantillaProceso;
	}

	public List<Receta> getRecetas() {
		return this.recetas;
	}

	public void setRecetas(List<Receta> recetas) {
		this.recetas = recetas;
	}

	public Receta addReceta(Receta receta) {
		getRecetas().add(receta);
		receta.setProducto(this);

		return receta;
	}

	public Receta removeReceta(Receta receta) {
		getRecetas().remove(receta);
		receta.setProducto(null);

		return receta;
	}

	public List<DetallePedido> getVentas() {
		return ventas;
	}

	public void setVentas(List<DetallePedido> ventas) {
		this.ventas = ventas;
	}
	
	public BigDecimal getCosteFijo() {
	    return costeFijo;
	}
	
	public void setCosteFijo(BigDecimal costeFijo) {
	    this.costeFijo = costeFijo;
	}
}