package com.roy.model;

import java.io.Serializable;
import jakarta.persistence.*;
import java.util.Date;


/**
 * The persistent class for the tarea_programada database table.
 * 
 */
@Entity
@Table(name="tarea_programada")
@NamedQuery(name="TareaProgramada.findAll", query="SELECT t FROM TareaProgramada t")
public class TareaProgramada implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="id_tarea")
	private Integer idTarea;

	private String estado;

	@Temporal(TemporalType.DATE)
	@Column(name="fecha_ejecucion")
	private Date fechaEjecucion;

	@ManyToOne
    @JoinColumn(name="id_pedido")
    private Pedido pedido;

    @ManyToOne
    @JoinColumn(name="id_proceso")
    private ProcesoProduccion procesoProduccion;

	public TareaProgramada() {
	}

	public Integer getIdTarea() {
		return this.idTarea;
	}

	public void setIdTarea(Integer idTarea) {
		this.idTarea = idTarea;
	}

	public String getEstado() {
		return this.estado;
	}

	public void setEstado(String estado) {
		this.estado = estado;
	}

	public Date getFechaEjecucion() {
		return this.fechaEjecucion;
	}

	public void setFechaEjecucion(Date fechaEjecucion) {
		this.fechaEjecucion = fechaEjecucion;
	}

	public Pedido getPedido() {
		return pedido;
	}

	public void setPedido(Pedido pedido) {
		this.pedido = pedido;
	}

	public ProcesoProduccion getProcesoProduccion() {
		return procesoProduccion;
	}

	public void setProcesoProduccion(ProcesoProduccion procesoProduccion) {
		this.procesoProduccion = procesoProduccion;
	}

}