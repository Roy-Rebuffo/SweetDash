package com.roy.dto;

public class StockMaterialDTO {
    private Integer idStock;
    private String nombre;
    private Integer cantidadStock;
    private Integer stockMaximo;

    public StockMaterialDTO() {}

    public StockMaterialDTO(Integer id, String nombre, Integer stock, Integer stockMaximo) {
        this.idStock = id;
        this.nombre = nombre;
        this.cantidadStock = stock;
        this.stockMaximo = stockMaximo;
    }

	public Integer getIdStock() {
		return idStock;
	}

	public void setIdStock(Integer idStock) {
		this.idStock = idStock;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public Integer getCantidadStock() {
		return cantidadStock;
	}

	public void setCantidadStock(Integer cantidadStock) {
		this.cantidadStock = cantidadStock;
	}
	public Integer getStockMaximo() {
	    return stockMaximo;
	}
	
	public void setStockMaximo(Integer stockMaximo) {
	    this.stockMaximo = stockMaximo;
	}
    
}