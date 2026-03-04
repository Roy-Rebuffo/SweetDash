package com.roy.dto;
import java.util.Date;

public class TareaProgramadaDTO {
    private int idTarea;
    private String estado;
    private Date fechaEjecucion;
    private int idPedido;
    private String nombreProceso; // Para saber qué tarea es (ej: "Hornear")

    public TareaProgramadaDTO() {}

    public TareaProgramadaDTO(int id, String estado, Date fecha, int idPed, String nomProc) {
        this.idTarea = id;
        this.estado = estado;
        this.fechaEjecucion = fecha;
        this.idPedido = idPed;
        this.nombreProceso = nomProc;
    }

	public int getIdTarea() {
		return idTarea;
	}

	public void setIdTarea(int idTarea) {
		this.idTarea = idTarea;
	}

	public String getEstado() {
		return estado;
	}

	public void setEstado(String estado) {
		this.estado = estado;
	}

	public Date getFechaEjecucion() {
		return fechaEjecucion;
	}

	public void setFechaEjecucion(Date fechaEjecucion) {
		this.fechaEjecucion = fechaEjecucion;
	}

	public int getIdPedido() {
		return idPedido;
	}

	public void setIdPedido(int idPedido) {
		this.idPedido = idPedido;
	}

	public String getNombreProceso() {
		return nombreProceso;
	}

	public void setNombreProceso(String nombreProceso) {
		this.nombreProceso = nombreProceso;
	}
    
}