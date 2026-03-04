package com.roy.dto;

public class ProcesoProduccionDTO {
    private int idProceso;
    private String nombre;
    private int diasAntesEntrega;
    private int idPlantilla;

    public ProcesoProduccionDTO() {}

    public ProcesoProduccionDTO(int id, String nombre, int dias, int idPlantilla) {
        this.idProceso = id;
        this.nombre = nombre;
        this.diasAntesEntrega = dias;
        this.idPlantilla = idPlantilla;
    }

	public int getIdProceso() {
		return idProceso;
	}

	public void setIdProceso(int idProceso) {
		this.idProceso = idProceso;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public int getDiasAntesEntrega() {
		return diasAntesEntrega;
	}

	public void setDiasAntesEntrega(int diasAntesEntrega) {
		this.diasAntesEntrega = diasAntesEntrega;
	}

	public int getIdPlantilla() {
		return idPlantilla;
	}

	public void setIdPlantilla(int idPlantilla) {
		this.idPlantilla = idPlantilla;
	}
    
}