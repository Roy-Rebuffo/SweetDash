package com.roy.dto;
import java.math.BigDecimal;

public class MaterialPedidoDTO {
    private int idMaterialPedido;
    private int cantidadNecesaria;
    private BigDecimal precioVenta;
    private int idPedido;
    private int idStock;
    private String nombreMaterial; // Del StockMaterial

    public MaterialPedidoDTO() {}

    public MaterialPedidoDTO(int idMaterial, int cant, BigDecimal precio, int idPed, int idSt, String nombreMat) {
        this.idMaterialPedido = idMaterial;
        this.cantidadNecesaria = cant;
        this.precioVenta = precio;
        this.idPedido = idPed;
        this.idStock = idSt;
        this.nombreMaterial = nombreMat;
    }

	public int getIdMaterialPedido() {
		return idMaterialPedido;
	}

	public void setIdMaterialPedido(int idMaterialPedido) {
		this.idMaterialPedido = idMaterialPedido;
	}

	public int getCantidadNecesaria() {
		return cantidadNecesaria;
	}

	public void setCantidadNecesaria(int cantidadNecesaria) {
		this.cantidadNecesaria = cantidadNecesaria;
	}

	public BigDecimal getPrecioVenta() {
		return precioVenta;
	}

	public void setPrecioVenta(BigDecimal precioVenta) {
		this.precioVenta = precioVenta;
	}

	public int getIdPedido() {
		return idPedido;
	}

	public void setIdPedido(int idPedido) {
		this.idPedido = idPedido;
	}

	public int getIdStock() {
		return idStock;
	}

	public void setIdStock(int idStock) {
		this.idStock = idStock;
	}

	public String getNombreMaterial() {
		return nombreMaterial;
	}

	public void setNombreMaterial(String nombreMaterial) {
		this.nombreMaterial = nombreMaterial;
	}
    
}