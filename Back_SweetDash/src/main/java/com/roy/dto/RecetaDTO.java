package com.roy.dto;

public class RecetaDTO {
    private Integer idReceta;
    private double cantidadNecesaria;
    private Integer idProducto;
    private String nombreProducto;
    private Integer idMateriaPrima;
    private String nombreMateriaPrima;

    public RecetaDTO() {}

    public RecetaDTO(Integer id, double cant, Integer idProd, String nomProd, Integer idMat, String nomMat) {
        this.idReceta = id;
        this.cantidadNecesaria = cant;
        this.idProducto = idProd;
        this.nombreProducto = nomProd;
        this.idMateriaPrima = idMat;
        this.nombreMateriaPrima = nomMat;
    }

	public Integer getIdReceta() {
		return idReceta;
	}

	public void setIdReceta(Integer idReceta) {
		this.idReceta = idReceta;
	}

	public double getCantidadNecesaria() {
		return cantidadNecesaria;
	}

	public void setCantidadNecesaria(double cantidadNecesaria) {
		this.cantidadNecesaria = cantidadNecesaria;
	}

	public Integer getIdProducto() {
		return idProducto;
	}

	public void setIdProducto(Integer idProducto) {
		this.idProducto = idProducto;
	}

	public String getNombreProducto() {
		return nombreProducto;
	}

	public void setNombreProducto(String nombreProducto) {
		this.nombreProducto = nombreProducto;
	}

	public Integer getIdMateriaPrima() {
		return idMateriaPrima;
	}

	public void setIdMateriaPrima(Integer idMateriaPrima) {
		this.idMateriaPrima = idMateriaPrima;
	}

	public String getNombreMateriaPrima() {
		return nombreMateriaPrima;
	}

	public void setNombreMateriaPrima(String nombreMateriaPrima) {
		this.nombreMateriaPrima = nombreMateriaPrima;
	}
    
}