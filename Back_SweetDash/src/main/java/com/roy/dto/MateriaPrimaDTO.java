package com.roy.dto;
import java.util.Date;

public class MateriaPrimaDTO {
    private Integer idMateriaPrima;
    private String nombre;
    private double cantidadStock;
    private String unidad;
    private Date fechaCaducidad;
    private Integer stockMaximo;

    public MateriaPrimaDTO() {}

    public MateriaPrimaDTO(Integer id, String nombre, double stock, String unidad, Date caducidad, Integer stockMaximo) {
        this.idMateriaPrima = id;
        this.nombre = nombre;
        this.cantidadStock = stock;
        this.unidad = unidad;
        this.fechaCaducidad = caducidad;
        this.stockMaximo = stockMaximo;
        
    }

	public Integer getIdMateriaPrima() {
		return idMateriaPrima;
	}

	public void setIdMateriaPrima(Integer idMateriaPrima) {
		this.idMateriaPrima = idMateriaPrima;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public double getCantidadStock() {
		return cantidadStock;
	}

	public void setCantidadStock(double cantidadStock) {
		this.cantidadStock = cantidadStock;
	}

	public String getUnidad() {
		return unidad;
	}

	public void setUnidad(String unidad) {
		this.unidad = unidad;
	}

	public Date getFechaCaducidad() {
		return fechaCaducidad;
	}

	public void setFechaCaducidad(Date fechaCaducidad) {
		this.fechaCaducidad = fechaCaducidad;
	}
	
	public Integer getStockMaximo() {
	    return stockMaximo;
	}
	
	public void setStockMaximo(Integer stockMaximo) {
	    this.stockMaximo = stockMaximo;
	}
    
}