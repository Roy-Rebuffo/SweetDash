package com.roy.dto;
import java.util.Date;

public class PedidoDTO {
    private int idPedido;
    private Date fechaEntrega;
    private String estado;
    // Solo guardamos el ID y el nombre del cliente, no el objeto entero
    private int idCliente; 
    private String nombreCliente;

    public PedidoDTO() {}

    public PedidoDTO(int idPedido, Date fechaEntrega, String estado, int idCliente, String nombreCliente) {
        this.idPedido = idPedido;
        this.fechaEntrega = fechaEntrega;
        this.estado = estado;
        this.idCliente = idCliente;
        this.nombreCliente = nombreCliente;
    }

	public int getIdPedido() {
		return idPedido;
	}

	public void setIdPedido(int idPedido) {
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

	public int getIdCliente() {
		return idCliente;
	}

	public void setIdCliente(int idCliente) {
		this.idCliente = idCliente;
	}

	public String getNombreCliente() {
		return nombreCliente;
	}

	public void setNombreCliente(String nombreCliente) {
		this.nombreCliente = nombreCliente;
	}
    
}