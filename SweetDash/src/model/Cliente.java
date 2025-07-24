package model;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class Cliente {

    private String id;
    private String nombre;
    private String apellido;
    private String telefono;
    private String email;
    private String direccion;   // Opcional (para entregas)
    //lista de clientes
    public static List<Cliente> listaClientes = new ArrayList<>();

    //Getter and Setter
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    //Constructor
    public Cliente() {
    }

    public Cliente(String nombre, String apellido, String telefono, String email,
            String direccion) {

        this.id = "CLI-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        this.nombre = nombre;
        this.apellido = apellido;
        this.telefono = telefono;
        this.email = email;
        this.direccion = direccion;
    }

    @Override
    public String toString() {
        return "-Cliente-" + "\n"
                + "Id: " + id + "\n"
                + "Nombre: " + nombre + "\n"
                + "Apellido: " + apellido + "\n"
                + "Telefono: " + telefono + "\n"
                + "Email: " + email + "\n"
                + "Direccion: " + direccion + "\n";
    } 
}
