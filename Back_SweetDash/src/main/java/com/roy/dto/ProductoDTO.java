package com.roy.dto;

import java.math.BigDecimal;

public class ProductoDTO {
	private Integer idProducto;
	private String nombre;
	private String descripcion;
	private String tipo;
	private String cantidadPersonas;
	private BigDecimal precioBase;
	private String imagenUrl;
	private Integer idPlantilla;
	private BigDecimal costeFijo;

	public ProductoDTO() {
	}

	public ProductoDTO(Integer idProducto, String nombre, String descripcion, String tipo, String cantidadPersonas,
			BigDecimal precioBase, String imagenUrl, Integer idPlantilla, BigDecimal costeFijo) {
		this.idProducto = idProducto;
		this.nombre = nombre;
		this.descripcion = descripcion;
		this.tipo = tipo;
		this.cantidadPersonas = cantidadPersonas;
		this.precioBase = precioBase;
		this.imagenUrl = imagenUrl;
		this.idPlantilla = idPlantilla;
		this.costeFijo = costeFijo;
	}

	public Integer getIdProducto() {
		return idProducto;
	}

	public void setIdProducto(Integer idProducto) {
		this.idProducto = idProducto;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public String getTipo() {
		return tipo;
	}

	public void setTipo(String tipo) {
		this.tipo = tipo;
	}

	public String getCantidadPersonas() {
		return cantidadPersonas;
	}

	public void setCantidadPersonas(String cantidadPersonas) {
		this.cantidadPersonas = cantidadPersonas;
	}

	public BigDecimal getPrecioBase() {
		return precioBase;
	}

	public void setPrecioBase(BigDecimal precioBase) {
		this.precioBase = precioBase;
	}

	public String getImagenUrl() {
		return imagenUrl;
	}

	public void setImagenUrl(String imagenUrl) {
		this.imagenUrl = imagenUrl;
	}

	public Integer getIdPlantilla() {
		return idPlantilla;
	}

	public void setIdPlantilla(Integer idPlantilla) {
		this.idPlantilla = idPlantilla;
	}
	
	public BigDecimal getCosteFijo() { return costeFijo; }
	public void setCosteFijo(BigDecimal costeFijo) { this.costeFijo = costeFijo; }
}