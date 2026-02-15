package com.roy.model;

import java.io.Serializable;
import jakarta.persistence.*;
import java.util.List;


/**
 * The persistent class for the plantilla_proceso database table.
 * 
 */
@Entity
@Table(name="plantilla_proceso")
@NamedQuery(name="PlantillaProceso.findAll", query="SELECT p FROM PlantillaProceso p")
public class PlantillaProceso implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="id_plantilla")
	private int idPlantilla;

	@Lob
	private String descripcion;

	private String nombre;

	//bi-directional many-to-one association to ProcesoProduccion
	@OneToMany(mappedBy="plantillaProceso")
	private List<ProcesoProduccion> procesoProduccions;

	//bi-directional many-to-one association to Producto
	@OneToMany(mappedBy="plantillaProceso")
	private List<Producto> productos;

	public PlantillaProceso() {
	}

	public int getIdPlantilla() {
		return this.idPlantilla;
	}

	public void setIdPlantilla(int idPlantilla) {
		this.idPlantilla = idPlantilla;
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

	public List<ProcesoProduccion> getProcesoProduccions() {
		return this.procesoProduccions;
	}

	public void setProcesoProduccions(List<ProcesoProduccion> procesoProduccions) {
		this.procesoProduccions = procesoProduccions;
	}

	public ProcesoProduccion addProcesoProduccion(ProcesoProduccion procesoProduccion) {
		getProcesoProduccions().add(procesoProduccion);
		procesoProduccion.setPlantillaProceso(this);

		return procesoProduccion;
	}

	public ProcesoProduccion removeProcesoProduccion(ProcesoProduccion procesoProduccion) {
		getProcesoProduccions().remove(procesoProduccion);
		procesoProduccion.setPlantillaProceso(null);

		return procesoProduccion;
	}

	public List<Producto> getProductos() {
		return this.productos;
	}

	public void setProductos(List<Producto> productos) {
		this.productos = productos;
	}

	public Producto addProducto(Producto producto) {
		getProductos().add(producto);
		producto.setPlantillaProceso(this);

		return producto;
	}

	public Producto removeProducto(Producto producto) {
		getProductos().remove(producto);
		producto.setPlantillaProceso(null);

		return producto;
	}
	
}