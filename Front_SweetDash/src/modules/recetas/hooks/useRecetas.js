import { useState, useEffect } from "react";
import { productosApi, procesosApi, pedidosApi, detallesPedidosApi, plantillasApi, recetasTamañoApi, tareasApi } from "../../../services/api";

export default function useRecetas({ productoParaEditar, onClearEditar, onNavigate }) {
  const [productos, setProductos] = useState([]);
  const [tamañosMap, setTamañosMap] = useState({});
  const [pedidos, setPedidos] = useState([]);
  const [usadaMap, setUsadaMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [catActiva, setCatActiva] = useState("Todas");
  const [modalOpen, setModalOpen] = useState(false);
  const [editProducto, setEditProducto] = useState(null);
  const [verProducto, setVerProducto] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [conflictoTarget, setConflictoTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [prods, peds, detalles] = await Promise.all([productosApi.getAll(), pedidosApi.getAll(), detallesPedidosApi.getAll()]);
      setProductos(prods);
      setPedidos(peds);
      const pedidosPorProducto = {};
      detalles.forEach(d => {
        if (!d.idProducto) return;
        if (!pedidosPorProducto[d.idProducto]) pedidosPorProducto[d.idProducto] = new Set();
        pedidosPorProducto[d.idProducto].add(d.idPedido);
      });
      const uMap = {};
      Object.entries(pedidosPorProducto).forEach(([id, set]) => { uMap[Number(id)] = set.size; });
      setUsadaMap(uMap);
      const map = {};
      await Promise.all(prods.map(async (p) => {
        try {
          const tams = await recetasTamañoApi.getByProducto(p.idProducto);
          map[p.idProducto] = tams?.length || 0;
        } catch { map[p.idProducto] = 0; }
      }));
      setTamañosMap(map);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  useEffect(() => {
    if (productoParaEditar) {
      setEditProducto(productoParaEditar);
      setModalOpen(true);
      onClearEditar && onClearEditar();
    }
  }, [productoParaEditar]);

  const handleNuevo = () => { setEditProducto(null); setModalOpen(true); };
  const handleEditar = (p) => { setVerProducto(null); setEditProducto(p); setModalOpen(true); };
  const handleSaved = () => { setModalOpen(false); cargarDatos(); };

  const ejecutarBorrado = async (producto, todosPedidos) => {
    const tamañosExistentes = await recetasTamañoApi.getByProducto(producto.idProducto);
    for (const t of tamañosExistentes) {
      await recetasTamañoApi.delete(t.id);
      if (t.idPlantilla) {
        const pasos = await procesosApi.getByPlantilla(t.idPlantilla);
        for (const p of pasos) await procesosApi.delete(p.idProceso);
        await plantillasApi.delete(t.idPlantilla);
      }
    }
    for (const ped of todosPedidos) {
      if (ped.estado === "Entregado") continue;
      try {
        const detalles = await pedidosApi.getDetalles(ped.idPedido);
        for (const det of detalles) {
          if (det.idProducto === producto.idProducto) {
            await pedidosApi.deleteDetalle(det.idDetalle);
          }
        }
      } catch { }
    }
    await productosApi.delete(producto.idProducto);
    setDeleteTarget(null);
    setConflictoTarget(null);
    cargarDatos();
  };

  const handleEliminar = async () => {
    setDeleting(true);
    try {
      const todosLosPedidos = await pedidosApi.getAll();
      const conflictos = [];
      for (const ped of todosLosPedidos) {
        if (ped.estado === "Entregado") continue;
        try {
          const detalles = await pedidosApi.getDetalles(ped.idPedido);
          if (!detalles.some((d) => d.idProducto === deleteTarget.idProducto)) continue;
          const tareas = await tareasApi.getByPedido(ped.idPedido);
          if (tareas.some((t) => t.estado === "Pendiente" || t.estado === "En proceso")) {
            conflictos.push(ped);
          }
        } catch { }
      }
      if (conflictos.length > 0) {
        setDeleteTarget(null);
        setConflictoTarget({ producto: deleteTarget, conflictos, todosPedidos: todosLosPedidos });
        return;
      }
      await ejecutarBorrado(deleteTarget, todosLosPedidos);
    } catch (e) {
      alert("Error al eliminar: " + e.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelarPedidosYBorrar = async () => {
    if (!conflictoTarget) return;
    setDeleting(true);
    try {
      for (const ped of conflictoTarget.conflictos) {
        await pedidosApi.delete(ped.idPedido);
      }
      const todosPedidos = await pedidosApi.getAll();
      await ejecutarBorrado(conflictoTarget.producto, todosPedidos);
    } catch (e) {
      alert("Error al eliminar: " + e.message);
    } finally {
      setDeleting(false);
    }
  };

  const pedidosEntregados = pedidos.filter((p) => p.estado === "Entregado").length;
  const categorias = ["Todas", ...Array.from(new Set(productos.map((p) => p.tipo)))];
  const totalTamaños = Object.values(tamañosMap).reduce((a, b) => a + b, 0);
  const promedioTamaños = productos.length > 0 ? (totalTamaños / productos.length).toFixed(1) : "0";

  const filtrados = productos.filter((p) => {
    const matchSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || (p.tipo || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = catActiva === "Todas" || p.tipo === catActiva;
    return matchSearch && matchCat;
  });

  return {
    productos, tamañosMap, pedidos, usadaMap, loading, error,
    searchTerm, setSearchTerm, catActiva, setCatActiva,
    modalOpen, setModalOpen, editProducto, verProducto, setVerProducto,
    deleteTarget, setDeleteTarget, conflictoTarget, setConflictoTarget, deleting,
    handleNuevo, handleEditar, handleSaved, handleEliminar, handleCancelarPedidosYBorrar,
    pedidosEntregados, categorias, promedioTamaños, filtrados,
  };
}
