package com.roy.dto;

import java.math.BigDecimal;
import java.util.List;

public class RecetaTamañoDTO {
    private Integer id;
    private Integer tamañoCm;
    private String descripcionTamaño;
    private BigDecimal precioVenta;
    private Integer idProducto;
    private String nombreProducto;
    private Integer idPlantilla;
    private List<RecetaTamañoIngredienteDTO> ingredientes;
    private BigDecimal costeTotal;
    private BigDecimal ganancia;
    private BigDecimal margenPct;
    private Integer idPlantilla;
    private String nombrePlantilla;

    public RecetaTamañoDTO() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Integer getTamañoCm() { return tamañoCm; }
    public void setTamañoCm(Integer tamañoCm) { this.tamañoCm = tamañoCm; }
    public String getDescripcionTamaño() { return descripcionTamaño; }
    public void setDescripcionTamaño(String descripcionTamaño) { this.descripcionTamaño = descripcionTamaño; }
    public BigDecimal getPrecioVenta() { return precioVenta; }
    public void setPrecioVenta(BigDecimal precioVenta) { this.precioVenta = precioVenta; }
    public Integer getIdProducto() { return idProducto; }
    public void setIdProducto(Integer idProducto) { this.idProducto = idProducto; }
    public String getNombreProducto() { return nombreProducto; }
    public void setNombreProducto(String nombreProducto) { this.nombreProducto = nombreProducto; }
    public Integer getIdPlantilla() { return idPlantilla; }
    public void setIdPlantilla(Integer idPlantilla) { this.idPlantilla = idPlantilla; }
    public List<RecetaTamañoIngredienteDTO> getIngredientes() { return ingredientes; }
    public void setIngredientes(List<RecetaTamañoIngredienteDTO> ingredientes) { this.ingredientes = ingredientes; }
    public BigDecimal getCosteTotal() { return costeTotal; }
    public void setCosteTotal(BigDecimal costeTotal) { this.costeTotal = costeTotal; }
    public BigDecimal getGanancia() { return ganancia; }
    public void setGanancia(BigDecimal ganancia) { this.ganancia = ganancia; }
    public BigDecimal getMargenPct() { return margenPct; }
    public void setMargenPct(BigDecimal margenPct) { this.margenPct = margenPct; }

	public Integer getIdPlantilla() {
		return idPlantilla;
	}

	public void setIdPlantilla(Integer idPlantilla) {
		this.idPlantilla = idPlantilla;
	}

	public String getNombrePlantilla() {
		return nombrePlantilla;
	}

	public void setNombrePlantilla(String nombrePlantilla) {
		this.nombrePlantilla = nombrePlantilla;
	}
    
    
}