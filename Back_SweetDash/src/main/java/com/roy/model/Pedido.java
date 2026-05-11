package com.roy.model;

import java.io.Serializable;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;


/**
 * The persistent class for the pedido database table.
 * 
 */
@Entity
@NamedQuery(name="Pedido.findAll", query="SELECT p FROM Pedido p")
public class Pedido implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="id_pedido")
	private Integer idPedido;

	@Temporal(TemporalType.DATE)
	@Column(name="fecha_entrega")
	private Date fechaEntrega;

	private String estado;

	// CORRECCIÓN: Usamos el Objeto, no el Integer
	@ManyToOne
	@JoinColumn(name="id_cliente") // Esta es la FK en la BD
	private Cliente cliente;
	
	// Relación con los detalles (productos del pedido)
    @OneToMany(mappedBy="pedido", cascade = CascadeType.ALL)
    private List<DetallePedido> detalles = new ArrayList<>();
    
    // Relación con los materiales extra gastados
    @OneToMany(mappedBy="pedido", cascade = CascadeType.ALL)
    private List<MaterialPedido> materiales;

    // Relación con las tareas
    @OneToMany(mappedBy="pedido", cascade = CascadeType.ALL)
    private List<TareaProgramada> tareas;

	public Pedido() {
	}

	public String getEstado() {
		return this.estado;
	}

	public void setEstado(String estado) {
		this.estado = estado;
	}

	public Date getFechaEntrega() {
		return this.fechaEntrega;
	}

	public void setFechaEntrega(Date fechaEntrega) {
		this.fechaEntrega = fechaEntrega;
	}

	public Cliente getCliente() { return cliente; }
	
	public void setCliente(Cliente cliente) { this.cliente = cliente; }

	public Integer getIdPedido() {
		return this.idPedido;
	}

	public void setIdPedido(Integer idPedido) {
		this.idPedido = idPedido;
	}
	
	public List<DetallePedido> getDetalles() {
	    return detalles;
	}

	public void setDetalles(List<DetallePedido> detalles) {
	    this.detalles = detalles;
	}
	
}