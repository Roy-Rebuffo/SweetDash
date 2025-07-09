package model;

import java.util.UUID;

public class Cliente {
    private String id;          
    private String nombre;
    private String telefono;
    private String email;
    private String direccion;   // Opcional (para entregas)

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

    public Cliente(String nombre, String telefono, String email, 
            String direccion) {
        
        this.id = "CLI-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        
        this.nombre = nombre;
        this.telefono = telefono;
        this.email = email;
        this.direccion = direccion;
    }

    @Override
    public String toString() {
        return "-Cliente-" + "\n" +
                "id: " + id + "\n" +
                "nombre: " + nombre + "\n" +
                "telefono: " + telefono + "\n" +
                "email: " + email + "\n" +
                "direccion: " + direccion + "\n";
    }
    
    
    
}
