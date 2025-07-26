package sweetdash;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import model.Cliente;
import model.Ingrediente;
import utils.ClienteUtils;
import utils.IngredienteUtils;

public class SweetDash {

    //Importacion de Scanner
    public static Scanner dato = new Scanner(System.in);

    //Importamos a los clientes
    private static final List<Cliente> clientes = new ArrayList<>();

    private static final List<Ingrediente> ingredientes = new ArrayList<>();

    public static void main(String[] args) {
        mainMenu();
    }

    public static void mainMenu() {
        Scanner dato = new Scanner(System.in);
        int opcion = -1;
        imprimirEncabezado();
        while (opcion != 0) {
            System.out.println("--------------------------");
            System.out.println("1-> Crear nuevo pedido");
            System.out.println("--------------------------");
            System.out.println("2-> Ver pedidos existentes");
            System.out.println("--------------------------");
            System.out.println("3-> Ver calendario");
            System.out.println("--------------------------");
            System.out.println("4-> Gestionar Clientes");
            System.out.println("--------------------------");
            System.out.println("5-> Gestionar productos");
            System.out.println("--------------------------");
            System.out.println("6-> Gestionar stock");
            System.out.println("--------------------------");
            System.out.println("7-> Gestionar ingredientes");
            System.out.println("--------------------------");
            System.out.println("0-> Salir");
            System.out.println("--------------------------");

            System.out.print("\nSeleccione la opcion elegida: ");
            opcion = dato.nextInt();
            imprimirEncabezado();
            switch (opcion) {
                case 1:
                    //crearPedido();
                    break;
                case 2:
                    //verPedidos();
                    break;
                case 3:
                    //verCalendario();
                    break;
                case 4:
                    gestionarClientes();
                    break;
                case 5:
                    //gestionarProductos();
                    break;
                case 6:
                    //gestionarStock();
                    break;
                case 7:
                    gestionarIngredientes();
                    break;
                case 0:
                    System.out.println("\n👋 ¡Gracias por usar SweetDash!");
                    break;
                default:
                    System.out.println("Elija un número entre 1 y 2, en caso "
                            + "de salir 0.");
                    break;
            }
        }

    }

    private static void imprimirEncabezado() {
        System.out.println("==============================");
        System.out.println("                S");
        System.out.println("               //");
        System.out.println("               ||");
        System.out.println("               ||");
        System.out.println("        ,,,,,,,,,,,,,");
        System.out.println("     ,@@@@@@@@@@@@@@@@@,");
        System.out.println("   ,@@@@@@@@@@@@@@@@@@@@@,");
        System.out.println("   |@@@@@@@@@@@@@@@@@@@@@|");
        System.out.println("   |@@@@@@@@@@@@@@@@@@@@@|");
        System.out.println("   |_____________________|");
        System.out.println("   |_____________________|");
        System.out.println("   \\@@@@@@@@@@@@@@@@@@@@/");
        System.out.println("    \\@@@@@@@@@@@@@@@@@@/");
        System.out.println("     \\@@@@@@@@@@@@@@@@/");
        System.out.println("      '---------------'");
        System.out.println();
        System.out.println("     🎂  SweetDash System 🎂");
        System.out.println("  Gestion de pedidos reposteros");
        System.out.println("==================================");
        System.out.println();
        System.out.println();
    }

    // Métodos vacíos a implementar después
    private static void crearPedido() {
        System.out.println("🚧 Función 'crearPedido' aún no implementada.");
    }

    private static void verPedidos() {
        System.out.println("🚧 Función 'verPedidos' aún no implementada.");
    }

    private static void verCalendario() {
        System.out.println("🚧 Función 'verCalendario' aún no implementada.");
    }

    private static void gestionarClientes() {
        System.out.println("--------------------------");
        System.out.println("\nGestion de Clientes");
        System.out.println("--------------------------");
        System.out.println("1. Anadir nuevo cliente");
        System.out.println("--------------------------");
        System.out.println("2. Ver todos los clientes");
        System.out.println("--------------------------");
        System.out.println("0. Volver al menú");
        System.out.println("--------------------------");

        System.out.print("Selecciona una opcion: ");
        int opcion = Integer.parseInt(dato.nextLine());

        switch (opcion) {
            case 1 -> {
                Cliente nuevo = ClienteUtils.crearCliente();
                clientes.add(nuevo);
            }
            case 2 ->
                ClienteUtils.mostrarClientes(clientes);
            case 0 ->
                System.out.println("↩️ Volviendo al menu principal...");
            default ->
                System.out.println("❌ Opcion no valida.");
        }
    }

    private static void gestionarProductos() {
        System.out.println("🚧 Función 'gestionarProductos' aún no implementada.");
    }

    private static void gestionarStock() {
        System.out.println("🚧 Función 'gestionarStock' aún no implementada.");
    }

    private static void gestionarIngredientes() {
        System.out.println("-----------------------------------------");
        System.out.println("\nGestion de Ingredientes");
        System.out.println("-----------------------------------------");
        System.out.println("1. Anadir nuevo Ingrediente");
        System.out.println("-----------------------------------------");
        System.out.println("2. Ver todos los ingredientes dispoibles");
        System.out.println("-----------------------------------------");
        System.out.println("0. Volver al menu");
        System.out.println("-----------------------------------------");

        System.out.print("Selecciona una opcion: ");
        int opcion = Integer.parseInt(dato.nextLine());

        switch (opcion) {
            case 1 -> {
                Ingrediente ing = IngredienteUtils.crearIngrediente();
                ingredientes.add(ing);
            }
            case 2 -> {
                if (ingredientes.isEmpty()) {
                    System.out.println("No hay ingredientes registrados.");
                } else {
                    System.out.println("\n📋 Lista de ingredientes:");
                    for (Ingrediente i : ingredientes) {
                        System.out.println(i);
                    }
                }
            }
            case 0 ->
                System.out.println("↩️ Volviendo al menu principal...");
            default ->
                System.out.println("❌ Opcion no valida.");
        }

    }
}
