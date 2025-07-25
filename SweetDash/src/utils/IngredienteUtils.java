package utils;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Scanner;
import model.Ingrediente;

public class IngredienteUtils {

    private static final Scanner dato = new Scanner(System.in);

    //Formateador de fecha a modo español
    private static final DateTimeFormatter FORMATO_FECHA = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    public static Ingrediente crearIngrediente() {

        System.out.println("-Crear nuevo ingrediente-");

        System.out.print("Nombre: ");
        String nombre = dato.nextLine();

        System.out.print("Cantidad (gr, ml, unidades,... ): ");
        //Pongo double y lo parseo por el atributo en la clase Ingrediente
        double cantidad = 0;
        boolean cantidadValida = false;

        while (!cantidadValida) {
            try {
                cantidad = Double.parseDouble(dato.nextLine());
                cantidadValida = true;
            } catch (NumberFormatException e) {
                System.out.println("Cantidad invalida. Ingresa un número (ej: 250 o 250.5)");
            }
        }

        System.out.print("Tiene fecha de caducidad? (s/n): ");
        String respuesta = dato.nextLine().trim().toLowerCase();

        LocalDate caducidad = null;
        if (respuesta.equals("s")) {
            boolean fechaValida = false;
            while (!fechaValida) {
                System.out.print("Fecha de caducidad (dd/mm/aaaa): ");
                try {
                    String entrada = dato.nextLine();
                    caducidad = LocalDate.parse(entrada, FORMATO_FECHA);
                    fechaValida = true;
                } catch (DateTimeParseException e) {
                    System.out.println("❌ Fecha inválida. Intenta con el formato dd/mm/aaaa");
                }
            }
        }

        Ingrediente nuevo = new Ingrediente(nombre, cantidad, caducidad);
        System.out.println("\nIngrediente creado: ");
        System.out.println(nuevo);
        return nuevo;
    }
}
