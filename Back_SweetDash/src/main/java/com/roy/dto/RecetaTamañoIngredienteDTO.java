package com.roy.dto;

import java.math.BigDecimal;

public class RecetaTamañoIngredienteDTO {
    private Integer id;
    private Integer idMateriaPrima;
    private String nombreMateriaPrima;
    private String unidad;
    private BigDecimal cantidadUsada;
    private BigDecimal precioPaquete;
    private BigDecimal unidadesPaquete;
    private BigDecimal costeIngrediente; // (cantidadUsada / unidadesPaquete) * precioPaquete

    public RecetaTamañoIngredienteDTO() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Integer getIdMateriaPrima() { return idMateriaPrima; }
    public void setIdMateriaPrima(Integer idMateriaPrima) { this.idMateriaPrima = idMateriaPrima; }
    public String getNombreMateriaPrima() { return nombreMateriaPrima; }
    public void setNombreMateriaPrima(String nombreMateriaPrima) { this.nombreMateriaPrima = nombreMateriaPrima; }
    public String getUnidad() { return unidad; }
    public void setUnidad(String unidad) { this.unidad = unidad; }
    public BigDecimal getCantidadUsada() { return cantidadUsada; }
    public void setCantidadUsada(BigDecimal cantidadUsada) { this.cantidadUsada = cantidadUsada; }
    public BigDecimal getPrecioPaquete() { return precioPaquete; }
    public void setPrecioPaquete(BigDecimal precioPaquete) { this.precioPaquete = precioPaquete; }
    public BigDecimal getUnidadesPaquete() { return unidadesPaquete; }
    public void setUnidadesPaquete(BigDecimal unidadesPaquete) { this.unidadesPaquete = unidadesPaquete; }
    public BigDecimal getCosteIngrediente() { return costeIngrediente; }
    public void setCosteIngrediente(BigDecimal costeIngrediente) { this.costeIngrediente = costeIngrediente; }
}