package com.roy.dto;
import java.util.Date;

public class PedidoDTO {
    private Integer idPedido;
    private Date fechaEntrega;
    private String estado;
    // Solo guardamos el ID y el nombre del cliente, no el objeto entero
    private Integer idCliente; 
    private String nombreCliente;

    public PedidoDTO() {}

    public PedidoDTO(Integer idPedido, Date fechaEntrega, String estado, Integer idCliente, String nombreCliente) {
        this.idPedido = idPedido;
        this.fechaEntrega = fechaEntrega;
        this.estado = estado;
        this.idCliente = idCliente;
        this.nombreCliente = nombreCliente;
    }

	public Integer getIdPedido() {
		return idPedido;
	}

	public void setIdPedido(Integer idPedido) {
		this.idPedido = idPedido;
	}

	public Date getFechaEntrega() {
		return fechaEntrega;
	}

	public void setFechaEntrega(Date fechaEntrega) {
		this.fechaEntrega = fechaEntrega;
	}

	public String getEstado() {
		return estado;
	}

	public void setEstado(String estado) {
		this.estado = estado;
	}

	public Integer getIdCliente() {
		return idCliente;
	}

	public void setIdCliente(Integer idCliente) {
		this.idCliente = idCliente;
	}

	public String getNombreCliente() {
		return nombreCliente;
	}

	public void setNombreCliente(String nombreCliente) {
		this.nombreCliente = nombreCliente;
	}
    
}