package com.roy.dto;

public class StockMaterialDTO {
    private int idStock;
    private String nombre;
    private int cantidadStock;

    public StockMaterialDTO() {}

    public StockMaterialDTO(int id, String nombre, int stock) {
        this.idStock = id;
        this.nombre = nombre;
        this.cantidadStock = stock;
    }

	public int getIdStock() {
		return idStock;
	}

	public void setIdStock(int idStock) {
		this.idStock = idStock;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public int getCantidadStock() {
		return cantidadStock;
	}

	public void setCantidadStock(int cantidadStock) {
		this.cantidadStock = cantidadStock;
	}
    
}