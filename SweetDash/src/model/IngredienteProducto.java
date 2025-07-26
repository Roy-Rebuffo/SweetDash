package model;

public class IngredienteProducto {
    private Ingrediente ingrediente;
    private double cantidadNecesaria;
    
    //Getter and Setter
    public Ingrediente getIngrediente() {
        return ingrediente;
    }

    public void setIngrediente(Ingrediente ingrediente) {
        this.ingrediente = ingrediente;
    }

    public double getCantidadNecesaria() {
        return cantidadNecesaria;
    }

    public void setCantidadNecesaria(double cantidadNecesaria) {
        this.cantidadNecesaria = cantidadNecesaria;
    }
    
    // Constructor vacío
    public IngredienteProducto() {}

    // Constructor completo
    public IngredienteProducto(Ingrediente ingrediente, double cantidadNecesaria) {
        this.ingrediente = ingrediente;
        this.cantidadNecesaria = cantidadNecesaria;
    }
    
    //toString

    @Override
    public String toString() {
        return "-Ingrediente Producto-" + "\n" +
               "ingrediente: " + ingrediente + "\n" +
               "cantidadNecesaria: " + cantidadNecesaria;
    }
}
