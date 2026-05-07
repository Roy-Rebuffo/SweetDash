package com.roy.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;

@Entity
@Table(name="receta_tamaño_ingrediente")
public class RecetaTamañoIngrediente implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    @Column(name="cantidad_usada")
    private BigDecimal cantidadUsada;

    @ManyToOne
    @JoinColumn(name="id_receta_tamaño")
    private RecetaTamaño recetaTamaño;

    @ManyToOne
    @JoinColumn(name="id_materia_prima")
    private MateriaPrima materiaPrima;

    public RecetaTamañoIngrediente() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public BigDecimal getCantidadUsada() { return cantidadUsada; }
    public void setCantidadUsada(BigDecimal cantidadUsada) { this.cantidadUsada = cantidadUsada; }
    public RecetaTamaño getRecetaTamaño() { return recetaTamaño; }
    public void setRecetaTamaño(RecetaTamaño recetaTamaño) { this.recetaTamaño = recetaTamaño; }
    public MateriaPrima getMateriaPrima() { return materiaPrima; }
    public void setMateriaPrima(MateriaPrima materiaPrima) { this.materiaPrima = materiaPrima; }
}