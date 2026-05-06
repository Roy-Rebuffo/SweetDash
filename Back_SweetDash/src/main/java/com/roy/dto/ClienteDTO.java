package com.roy.dto;

public class ClienteDTO {
    private Integer idCliente;
    private String nombre;
    private String apellidos;
    private String direccion;
    private String email;
    private String telefono;
    private String notas;

    public ClienteDTO() {}

    public ClienteDTO(Integer idCliente, String nombre, String apellidos, String direccion, String email, String telefono, String notas) {
        this.idCliente = idCliente;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.direccion = direccion;
        this.email = email;
        this.telefono = telefono;
        this.notas = notas;
    }

	public Integer getIdCliente() {
		return idCliente;
	}

	public void setIdCliente(Integer idCliente) {
		this.idCliente = idCliente;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getApellidos() {
		return apellidos;
	}

	public void setApellidos(String apellidos) {
		this.apellidos = apellidos;
	}

	public String getDireccion() {
		return direccion;
	}

	public void setDireccion(String direccion) {
		this.direccion = direccion;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getTelefono() {
		return telefono;
	}

	public void setTelefono(String telefono) {
		this.telefono = telefono;
	}

	public String getNotas() {
		return notas;
	}

	public void setNotas(String notas) {
		this.notas = notas;
	}
    
}