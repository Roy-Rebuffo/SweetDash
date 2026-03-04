package com.roy.dto;

public class PlantillaProcesoDTO {
    private int idPlantilla;
    private String nombre;
    private String descripcion;

    public PlantillaProcesoDTO() {}

    public PlantillaProcesoDTO(int id, String nombre, String desc) {
        this.idPlantilla = id;
        this.nombre = nombre;
        this.descripcion = desc;
    }

	public int getIdPlantilla() {
		return idPlantilla;
	}

	public void setIdPlantilla(int idPlantilla) {
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