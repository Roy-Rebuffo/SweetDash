package com.roy.dto;

public class RecetaDTO {
    private int idReceta;
    private double cantidadNecesaria;
    private int idProducto;
    private String nombreProducto;
    private int idMateriaPrima;
    private String nombreMateriaPrima;

    public RecetaDTO() {}

    public RecetaDTO(int id, double cant, int idProd, String nomProd, int idMat, String nomMat) {
        this.idReceta = id;
        this.cantidadNecesaria = cant;
        this.idProducto = idProd;
        this.nombreProducto = nomProd;
        this.idMateriaPrima = idMat;
        this.nombreMateriaPrima = nomMat;
    }

	public int getIdReceta() {
		return idReceta;
	}

	public void setIdReceta(int idReceta) {
		this.idReceta = idReceta;
	}

	public double getCantidadNecesaria() {
		return cantidadNecesaria;
	}

	public void setCantidadNecesaria(double cantidadNecesaria) {
		this.cantidadNecesaria = cantidadNecesaria;
	}

	public int getIdProducto() {
		return idProducto;
	}

	public void setIdProducto(int idProducto) {
		this.idProducto = idProducto;
	}

	public String getNombreProducto() {
		return nombreProducto;
	}

	public void setNombreProducto(String nombreProducto) {
		this.nombreProducto = nombreProducto;
	}

	public int getIdMateriaPrima() {
		return idMateriaPrima;
	}

	public void setIdMateriaPrima(int idMateriaPrima) {
		this.idMateriaPrima = idMateriaPrima;
	}

	public String getNombreMateriaPrima() {
		return nombreMateriaPrima;
	}

	public void setNombreMateriaPrima(String nombreMateriaPrima) {
		this.nombreMateriaPrima = nombreMateriaPrima;
	}
    
}