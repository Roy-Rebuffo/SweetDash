package com.roy.dto;

public class ProcesoProduccionDTO {
    private Integer idProceso;
    private String nombre;
    private Integer diasAntesEntrega;
    private Integer idPlantilla;

    public ProcesoProduccionDTO() {}

    public ProcesoProduccionDTO(Integer id, String nombre, Integer dias, Integer idPlantilla) {
        this.idProceso = id;
        this.nombre = nombre;
        this.diasAntesEntrega = dias;
        this.idPlantilla = idPlantilla;
    }

	public Integer getIdProceso() {
		return idProceso;
	}

	public void setIdProceso(Integer idProceso) {
		this.idProceso = idProceso;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public Integer getDiasAntesEntrega() {
		return diasAntesEntrega;
	}

	public void setDiasAntesEntrega(Integer diasAntesEntrega) {
		this.diasAntesEntrega = diasAntesEntrega;
	}

	public Integer getIdPlantilla() {
		return idPlantilla;
	}

	public void setIdPlantilla(Integer idPlantilla) {
		this.idPlantilla = idPlantilla;
	}
    
}