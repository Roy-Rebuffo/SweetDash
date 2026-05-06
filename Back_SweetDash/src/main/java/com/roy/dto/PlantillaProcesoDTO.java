package com.roy.dto;

public class PlantillaProcesoDTO {
    private Integer idPlantilla;
    private String nombre;
    private String descripcion;

    public PlantillaProcesoDTO() {}

    public PlantillaProcesoDTO(Integer id, String nombre, String desc) {
        this.idPlantilla = id;
        this.nombre = nombre;
        this.descripcion = desc;
    }

	public Integer getIdPlantilla() {
		return idPlantilla;
	}

	public void setIdPlantilla(Integer idPlantilla) {
		this.idPlantilla = idPlantilla;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}
    
}