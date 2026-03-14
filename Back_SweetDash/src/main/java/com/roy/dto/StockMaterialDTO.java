package com.roy.dto;

public class StockMaterialDTO {
    private int idStock;
    private String nombre;
    private int cantidadStock;
    private int stockMaximo;

    public StockMaterialDTO() {}

    public StockMaterialDTO(int id, String nombre, int stock, int stockMaximo) {
        this.idStock = id;
        this.nombre = nombre;
        this.cantidadStock = stock;
        this.stockMaximo = stockMaximo;
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
	public int getStockMaximo() {
	    return stockMaximo;
	}
	
	public void setStockMaximo(int stockMaximo) {
	    this.stockMaximo = stockMaximo;
	}
    
}