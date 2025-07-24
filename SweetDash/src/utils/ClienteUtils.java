package utils;

import model.Cliente;
import java.util.List;
import java.util.Scanner;

public class ClienteUtils {

    private static final Scanner dato = new Scanner(System.in);

    public static Cliente crearCliente() {
        System.out.println("\n👤 Creando nuevo cliente...");

        System.out.print("Nombre: ");
        String nombre = dato.nextLine();

        System.out.print("Apellido: ");
        String apellido = dato.nextLine();

        System.out.print("Telefono: ");
        String telefono = dato.nextLine();

        System.out.print("Email (Opcional): ");
        String email = dato.nextLine();

        System.out.print("Dirección (Opcional): ");
        String direccion = dato.nextLine();

        Cliente nuevo = new Cliente(nombre, apellido, telefono, email, direccion);
        System.out.println("✅ Cliente creado con éxito:\n" + nuevo);

        return nuevo;
    }

     public static void mostrarClientes(List<Cliente> listaClientes) {
        if (listaClientes.isEmpty()) {
            System.out.println("📭 La lista de clientes está vacía.");
        } else {
            System.out.println("📋 Lista de clientes:");
            for (Cliente c : listaClientes) {
                System.out.println(c);
            }
        }
     }
}
