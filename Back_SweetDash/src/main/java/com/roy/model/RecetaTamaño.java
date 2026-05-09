package com.roy.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="receta_tamaño")
public class RecetaTamaño implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    @Column(name="tamaño_cm")
    private Integer tamañoCm;

    @Column(name="descripcion_tamaño")
    private String descripcionTamaño;

    @Column(name="precio_venta")
    private BigDecimal precioVenta;

    @ManyToOne
    @JoinColumn(name="id_producto")
    private Producto producto;

    @OneToMany(mappedBy="recetaTamaño", cascade=CascadeType.ALL, orphanRemoval=true)
    private List<RecetaTamañoIngrediente> ingredientes = new ArrayList<>();
    
    @ManyToOne
    @JoinColumn(name = "id_plantilla")
    private PlantillaProceso plantillaProceso;

    public RecetaTamaño() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Integer getTamañoCm() { return tamañoCm; }
    public void setTamañoCm(Integer tamañoCm) { this.tamañoCm = tamañoCm; }
    public String getDescripcionTamaño() { return descripcionTamaño; }
    public void setDescripcionTamaño(String descripcionTamaño) { this.descripcionTamaño = descripcionTamaño; }
    public BigDecimal getPrecioVenta() { return precioVenta; }
    public void setPrecioVenta(BigDecimal precioVenta) { this.precioVenta = precioVenta; }
    public Producto getProducto() { return producto; }
    public void setProducto(Producto producto) { this.producto = producto; }
    public List<RecetaTamañoIngrediente> getIngredientes() { return ingredientes; }
    public void setIngredientes(List<RecetaTamañoIngrediente> ingredientes) { this.ingredientes = ingredientes; }
    
    public PlantillaProceso getPlantillaProceso() {
        return plantillaProceso;
    }

    public void setPlantillaProceso(PlantillaProceso plantillaProceso) {
        this.plantillaProceso = plantillaProceso;
    }
}