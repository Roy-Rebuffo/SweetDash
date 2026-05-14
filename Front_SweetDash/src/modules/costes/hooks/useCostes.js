import { useState, useEffect } from "react";
import { productosApi, materiasPrimasApi, recetasTamañoApi } from "../../../services/api";

export default function useCostes() {
  const [productos,      setProductos]      = useState([]);
  const [materiasPrimas, setMateriasPrimas] = useState([]);
  const [recetas,        setRecetas]        = useState([]);
  const [productoActivo, setProductoActivo] = useState(null);
  const [loading,        setLoading]        = useState(true);
  const [loadingRecetas, setLoadingRecetas] = useState(false);
  const [error,          setError]          = useState(null);
  const [searchTerm,     setSearchTerm]     = useState("");

  useEffect(() => {
    setLoading(true);
    Promise.all([productosApi.getAll(), materiasPrimasApi.getAll()])
      .then(([prods, mps]) => {
        setProductos(prods);
        setMateriasPrimas(mps);
        if (prods.length > 0) setProductoActivo(prods[0]);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!productoActivo) return;
    setLoadingRecetas(true);
    recetasTamañoApi.getByProducto(productoActivo.idProducto)
      .then(setRecetas)
      .catch(() => setRecetas([]))
      .finally(() => setLoadingRecetas(false));
  }, [productoActivo]);

  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const mejorMargen = recetas.length > 0
    ? recetas.reduce((best, r) => (Number(r.margenPct) > Number(best.margenPct) ? r : best), recetas[0])
    : null;
  const costePromedio = recetas.length > 0
    ? recetas.reduce((acc, r) => acc + Number(r.costeTotal || 0), 0) / recetas.length
    : 0;

  const mpsSinPrecio = materiasPrimas.filter(m => !m.precioPaquete || Number(m.precioPaquete) === 0);

  return {
    loading, loadingRecetas, error,
    recetas, productoActivo, setProductoActivo,
    searchTerm, setSearchTerm,
    productosFiltrados,
    mejorMargen, costePromedio, mpsSinPrecio,
  };
}
