import { useState, useEffect } from "react";
import { pedidosApi, tareasApi } from "../../../services/api";
import { formatFecha, getNombreCompleto, getProductoLabel } from "../pedidosUtils";

const ITEMS_PER_PAGE = 7;
export const FILTROS = ["Todos", "Pendiente", "En proceso", "Preparado", "Entregado"];

export default function usePedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [detallesMap, setDetallesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editPedido, setEditPedido] = useState(null);
  const [verPedido, setVerPedido] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [avisoData, setAvisoData] = useState(null);
  const [redistribuyendo, setRedistribuyendo] = useState(false);
  const [cambiarFechaPedido, setCambiarFechaPedido] = useState(null);

  const cargarPedidos = async () => {
    setLoading(true);
    try {
      const data = await pedidosApi.getAll();
      data.sort((a, b) => b.idPedido - a.idPedido);
      setPedidos(data);
      const map = {};
      await Promise.all(data.map(async (p) => {
        try { map[p.idPedido] = await pedidosApi.getDetalles(p.idPedido); }
        catch { map[p.idPedido] = []; }
      }));
      setDetallesMap(map);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarPedidos(); }, []);

  const handleNuevo = () => { setEditPedido(null); setModalOpen(true); };
  const handleEditar = (p) => { setVerPedido(null); setEditPedido(p); setModalOpen(true); };

  const handleNecesitaAviso = (data) => {
    setModalOpen(false);
    setAvisoData(data);
  };

  const handleSaved = () => {
    setModalOpen(false);
    setAvisoData(null);
    setCambiarFechaPedido(null);
    cargarPedidos();
  };

  const handleGuardarFechas = async (tareasActualizadas) => {
    setRedistribuyendo(true);
    try {
      for (const t of tareasActualizadas) {
        await tareasApi.actualizarFecha(t.idTarea, { ...t, fechaEjecucion: t.fechaEjecucion });
      }
      setAvisoData(null);
      cargarPedidos();
    } catch (e) {
      alert("Error al guardar fechas: " + e.message);
    } finally {
      setRedistribuyendo(false);
    }
  };

  const handleDejarComoEsta = () => {
    setAvisoData(null);
    cargarPedidos();
  };

  const handleCambiarFecha = () => {
    if (!avisoData) return;
    const pedidoEncontrado = pedidos.find((p) => p.idPedido === avisoData.pedidoId);
    const pedidoParaModal = pedidoEncontrado || {
      idPedido: avisoData.pedidoId,
      idCliente: avisoData.idCliente,
      fechaEntrega: avisoData.fechaEntrega,
      estado: "Pendiente",
      nombreCliente: "",
    };
    setAvisoData(null);
    setCambiarFechaPedido(pedidoParaModal);
  };

  const handleEliminar = async () => {
    setDeleting(true);
    try {
      await pedidosApi.delete(deleteTarget.idPedido);
      setDeleteTarget(null);
      cargarPedidos();
    } catch (e) {
      alert("Error al eliminar: " + e.message);
    } finally {
      setDeleting(false);
    }
  };

  const filtrados = pedidos.filter((p) => {
    const matchFiltro = filtro === "Todos" || p.estado === filtro;
    const nombre = getNombreCompleto(p);
    const detalles = detallesMap[p.idPedido] || [];
    const matchSearch =
      nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(p.idPedido).includes(searchTerm) ||
      getProductoLabel(detalles).toLowerCase().includes(searchTerm.toLowerCase());
    return matchFiltro && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtrados.length / ITEMS_PER_PAGE));
  const paginados = filtrados.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const handleFiltro = (f) => { setFiltro(f); setPage(1); };
  const handleSearch = (v) => { setSearchTerm(v); setPage(1); };

  const TODAY = new Date().toISOString().slice(0, 10);
  const pedidosHoy = pedidos.filter((p) => formatFecha(p.fechaEntrega) === TODAY).length;
  const pendientes = pedidos.filter((p) => p.estado === "Pendiente").length;
  const enProceso = pedidos.filter((p) => p.estado === "En proceso").length;
  const ingresosHoy = pedidos
    .filter((p) => formatFecha(p.fechaEntrega) === TODAY)
    .reduce((acc, p) => {
      const detalles = detallesMap[p.idPedido] || [];
      return acc + detalles.reduce((a, d) => a + d.cantidad * (d.precioCongelado || 0), 0);
    }, 0);

  return {
    pedidos, detallesMap, loading, error,
    filtro, searchTerm, page, setPage,
    modalOpen, setModalOpen,
    editPedido,
    verPedido, setVerPedido,
    deleteTarget, setDeleteTarget,
    deleting,
    avisoData,
    redistribuyendo,
    cambiarFechaPedido, setCambiarFechaPedido,
    handleNuevo, handleEditar, handleNecesitaAviso, handleSaved,
    handleGuardarFechas, handleDejarComoEsta, handleCambiarFecha, handleEliminar,
    filtrados, totalPages, paginados, handleFiltro, handleSearch,
    pedidosHoy, pendientes, enProceso, ingresosHoy,
  };
}
