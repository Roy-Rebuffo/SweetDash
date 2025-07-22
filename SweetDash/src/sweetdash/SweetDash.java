package sweetdash;

import java.util.Scanner;

public class SweetDash {

    public static void main(String[] args) {
        mainMenu();
    }

    public static void mainMenu() {
        Scanner dato = new Scanner(System.in);
        int opcion = -1;
        imprimirEncabezado();
        while (opcion != 0) {
            System.out.println("Crear nuevo pedido");
            System.out.println("Ver pedidos existentes");
            System.out.println("Ver calendario");
            System.out.println("Gestionar Clientes");
            System.out.println("Gestionar productos");
            System.out.println("Gestionar stock");
            System.out.println("Salir");

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
                    //gestionarClientes();
                    break;
                case 5:
                    //gestionarProductos();
                    break;
                case 6:
                    //gestionarStock();
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
        System.out.println("  Gestioon de pedidos reposteros");
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
        System.out.println("🚧 Función 'gestionarClientes' aún no implementada.");
    }

    private static void gestionarProductos() {
        System.out.println("🚧 Función 'gestionarProductos' aún no implementada.");
    }

    private static void gestionarStock() {
        System.out.println("🚧 Función 'gestionarStock' aún no implementada.");
    }
}
