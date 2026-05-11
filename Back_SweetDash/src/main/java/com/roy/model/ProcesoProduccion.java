package com.roy.model;

import java.io.Serializable;
import java.util.List;

import jakarta.persistence.*;


/**
 * The persistent class for the proceso_produccion database table.
 * 
 */
@Entity
@Table(name="proceso_produccion")
@NamedQuery(name="ProcesoProduccion.findAll", query="SELECT p FROM ProcesoProduccion p")
public class ProcesoProduccion implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="id_proceso")
	private Integer idProceso;

	@Column(name="dias_antes_entrega")
	private Integer diasAntesEntrega;

	private String nombre;

	//bi-directional many-to-one association to PlantillaProceso
	@ManyToOne
	@JoinColumn(name="plantilla_proceso_id_plantilla")
	private PlantillaProceso plantillaProceso;
	
	@OneToMany(mappedBy="procesoProduccion")
	private List<TareaProgramada> tareasProgramadas;

	public ProcesoProduccion() {
	}

	public Integer getIdProceso() {
		return this.idProceso;
	}

	public void setIdProceso(Integer idProceso) {
		this.idProceso = idProceso;
	}

	public Integer getDiasAntesEntrega() {
		return this.diasAntesEntrega;
	}

	public void setDiasAntesEntrega(Integer diasAntesEntrega) {
		this.diasAntesEntrega = diasAntesEntrega;
	}

	public String getNombre() {
		return this.nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public PlantillaProceso getPlantillaProceso() {
		return this.plantillaProceso;
	}

	public void setPlantillaProceso(PlantillaProceso plantillaProceso) {
		this.plantillaProceso = plantillaProceso;
	}

	public List<TareaProgramada> getTareasProgramadas() {
		return tareasProgramadas;
	}

	public void setTareasProgramadas(List<TareaProgramada> tareasProgramadas) {
		this.tareasProgramadas = tareasProgramadas;
	}
	
}