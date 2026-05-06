package com.roy.dto;
import java.math.BigDecimal;

public class MaterialPedidoDTO {
    private Integer idMaterialPedido;
    private Integer cantidadNecesaria;
    private BigDecimal precioVenta;
    private Integer idPedido;
    private Integer idStock;
    private String nombreMaterial; // Del StockMaterial

    public MaterialPedidoDTO() {}

    public MaterialPedidoDTO(Integer idMaterial, Integer cant, BigDecimal precio, Integer idPed, Integer idSt, String nombreMat) {
        this.idMaterialPedido = idMaterial;
        this.cantidadNecesaria = cant;
        this.precioVenta = precio;
        this.idPedido = idPed;
        this.idStock = idSt;
        this.nombreMaterial = nombreMat;
    }

	public Integer getIdMaterialPedido() {
		return idMaterialPedido;
	}

	public void setIdMaterialPedido(Integer idMaterialPedido) {
		this.idMaterialPedido = idMaterialPedido;
	}

	public Integer getCantidadNecesaria() {
		return cantidadNecesaria;
	}

	public void setCantidadNecesaria(Integer cantidadNecesaria) {
		this.cantidadNecesaria = cantidadNecesaria;
	}

	public BigDecimal getPrecioVenta() {
		return precioVenta;
	}

	public void setPrecioVenta(BigDecimal precioVenta) {
		this.precioVenta = precioVenta;
	}

	public Integer getIdPedido() {
		return idPedido;
	}

	public void setIdPedido(Integer idPedido) {
		this.idPedido = idPedido;
	}

	public Integer getIdStock() {
		return idStock;
	}

	public void setIdStock(Integer idStock) {
		this.idStock = idStock;
	}

	public String getNombreMaterial() {
		return nombreMaterial;
	}

	public void setNombreMaterial(String nombreMaterial) {
		this.nombreMaterial = nombreMaterial;
	}
    
}