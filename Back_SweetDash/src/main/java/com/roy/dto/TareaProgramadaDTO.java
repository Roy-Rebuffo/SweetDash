package com.roy.dto;
import java.util.Date;

public class TareaProgramadaDTO {
    private Integer idTarea;
    private String estado;
    private Date fechaEjecucion;
    private Integer idPedido;
    private String nombreProceso; // Para saber qué tarea es (ej: "Hornear")
    private Integer diasAntesEntrega;

    public TareaProgramadaDTO() {}

    public TareaProgramadaDTO(Integer id, String estado, Date fecha, Integer idPed, String nomProc, Integer diasAntesEntrega) {
        this.idTarea = id;
        this.estado = estado;
        this.fechaEjecucion = fecha;
        this.idPedido = idPed;
        this.nombreProceso = nomProc;
        this.diasAntesEntrega = diasAntesEntrega;
    }

	public Integer getIdTarea() {
		return idTarea;
	}

	public void setIdTarea(Integer idTarea) {
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

	public Integer getIdPedido() {
		return idPedido;
	}

	public void setIdPedido(Integer idPedido) {
		this.idPedido = idPedido;
	}

	public String getNombreProceso() {
		return nombreProceso;
	}

	public void setNombreProceso(String nombreProceso) {
		this.nombreProceso = nombreProceso;
	}
	
	public Integer getDiasAntesEntrega() { return diasAntesEntrega; }
	
	public void setDiasAntesEntrega(Integer diasAntesEntrega) { this.diasAntesEntrega = diasAntesEntrega; }
    
}