import { useState, useEffect } from "react";
import { stockMaterialesApi, materiasPrimasApi } from "../../../services/api";
import palette from "../../../theme/palette";

function diasHastaCaducidad(iso) {
  if (!iso) return null;
  const diff = new Date(iso) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function emojiParaNombre(nombre) {
  const n = nombre.toLowerCase();
  if (n.includes("harina")) return "🌾";
  if (n.includes("azúcar") || n.includes("azucar")) return "🍬";
  if (n.includes("huevo")) return "🥚";
  if (n.includes("chocolate")) return "🍫";
  if (n.includes("mantequilla")) return "🧈";
  if (n.includes("vainilla")) return "🌿";
  if (n.includes("almendra")) return "🌰";
  if (n.includes("cacao")) return "🍫";
  if (n.includes("nata")) return "🥛";
  if (n.includes("queso")) return "🧀";
  if (n.includes("fondant")) return "🎂";
  if (n.includes("frambuesa")) return "🍓";
  if (n.includes("limón") || n.includes("limon")) return "🍋";
  if (n.includes("pistacho")) return "🌱";
  if (n.includes("caja")) return "📦";
  if (n.includes("lazo")) return "🎀";
  if (n.includes("cinta")) return "🎗️";
  if (n.includes("bolsa")) return "🛍️";
  if (n.includes("cápsula") || n.includes("capsula")) return "🧁";
  if (n.includes("manga")) return "🍦";
  if (n.includes("papel")) return "📄";
  if (n.includes("etiqueta")) return "🏷️";
  if (n.includes("base") || n.includes("cartón")) return "🗂️";
  return "📦";
}

export function getEstado(stock, max) {
  const pct = (stock / max) * 100;
  if (pct >= 50) return { label: "OK", color: palette.accent3, bg: palette.accent3Lt, barColor: palette.accent3 };
  if (pct >= 20) return { label: "BAJO", color: palette.accent2, bg: palette.accent2Lt, barColor: palette.accent2 };
  return { label: "CRÍTICO", color: palette.primary, bg: palette.primaryLt, barColor: palette.primary };
}

const ITEMS_PER_PAGE = 8;
export const TABS = ["Todos", "Materias Primas", "Materiales"];

export default function useInventario() {
  const [materias,    setMaterias]    = useState([]);
  const [materiales,  setMateriales]  = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [tab,         setTab]         = useState("Todos");
  const [searchTerm,  setSearchTerm]  = useState("");
  const [page,        setPage]        = useState(1);
  const [modalTipo,   setModalTipo]   = useState(null);
  const [editItem,    setEditItem]    = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting,    setDeleting]    = useState(false);

  const cargarDatos = () => {
    setLoading(true);
    Promise.all([materiasPrimasApi.getAll(), stockMaterialesApi.getAll()])
      .then(([mp, mat]) => { setMaterias(mp); setMateriales(mat); setError(null); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { cargarDatos(); }, []);

  const itemsUnificados = [
    ...materias.map((m) => ({
      id: `mp-${m.idMateriaPrima}`,
      rawId: m.idMateriaPrima,
      tipo: "mp",
      nombre: m.nombre,
      categoria: "Materias Primas",
      stock: m.cantidadStock,
      stockMax: m.stockMaximo,
      unidad: m.unidad,
      caducidad: m.fechaCaducidad,
      precioPaquete: m.precioPaquete,
      unidadesPaquete: m.unidadesPaquete,
      emoji: emojiParaNombre(m.nombre),
    })),
    ...materiales.map((m) => ({
      id: `mat-${m.idStock}`,
      rawId: m.idStock,
      tipo: "mat",
      nombre: m.nombre,
      categoria: "Materiales",
      stock: m.cantidadStock,
      stockMax: m.stockMaximo,
      unidad: "ud",
      caducidad: null,
      precioPaquete: null,
      unidadesPaquete: null,
      emoji: emojiParaNombre(m.nombre),
    })),
  ];

  const filtrados = itemsUnificados.filter((item) => {
    const matchTab = tab === "Todos" || item.categoria === tab;
    const matchSearch = item.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    return matchTab && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtrados.length / ITEMS_PER_PAGE));
  const paginados = filtrados.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const handleSearch = (v) => { setSearchTerm(v); setPage(1); };
  const handleTab = (t) => { setTab(t); setPage(1); };

  const handleNuevo = () => { setEditItem(null); setModalTipo("nuevo"); };
  const handleEditar = (item) => { setEditItem(item); setModalTipo(item.tipo); };
  const handleSaved = () => { setModalTipo(null); setEditItem(null); cargarDatos(); };

  const handleEliminar = async () => {
    setDeleting(true);
    try {
      if (deleteTarget.tipo === "mp") await materiasPrimasApi.delete(deleteTarget.rawId);
      else await stockMaterialesApi.delete(deleteTarget.rawId);
      setDeleteTarget(null);
      cargarDatos();
    } catch (e) {
      setDeleteTarget(null);
      alert(e.message.includes("409")
        ? "No se puede eliminar porque está siendo usado en recetas o pedidos existentes."
        : "Error al eliminar: " + e.message);
    } finally {
      setDeleting(false);
    }
  };

  const totalItems = itemsUnificados.length;
  const criticos = itemsUnificados.filter((i) => getEstado(i.stock, i.stockMax).label === "CRÍTICO").length;
  const proxCaducar = materias.filter((m) => { const d = diasHastaCaducidad(m.fechaCaducidad); return d !== null && d <= 30; }).length;

  return {
    loading, error,
    tab, searchTerm, page, setPage,
    modalTipo, setModalTipo,
    editItem, setEditItem,
    deleteTarget, setDeleteTarget,
    deleting,
    handleNuevo, handleEditar, handleSaved, handleEliminar,
    filtrados, totalPages, paginados, handleSearch, handleTab,
    totalItems, criticos, proxCaducar,
  };
}
