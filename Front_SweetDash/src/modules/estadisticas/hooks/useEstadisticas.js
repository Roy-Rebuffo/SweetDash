import { useState, useEffect } from "react";
import { pedidosApi } from "../../../services/api";
import { parseFechaLocal } from "../../../utils/helpers";
import { mesLabel, getNombreCliente, categoriaProducto } from "../estadisticasUtils";

const HIST_PER_PAGE = 10;

export default function useEstadisticas() {
  const [tab,        setTab]        = useState("dashboard");
  const [periodo,    setPeriodo]    = useState("Todo");
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [pedidos,    setPedidos]    = useState([]);
  const [detallesMap, setDetallesMap] = useState({});
  const [histPage,   setHistPage]   = useState(1);

  useEffect(() => {
    setLoading(true);
    pedidosApi.getAll()
      .then(async (peds) => {
        setPedidos(peds);
        const map = {};
        await Promise.all(peds.map(async (p) => {
          try { map[p.idPedido] = await pedidosApi.getDetalles(p.idPedido); }
          catch { map[p.idPedido] = []; }
        }));
        setDetallesMap(map);
        setError(null);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSetPeriodo = (v) => { setPeriodo(v); setHistPage(1); };

  const hoy = new Date();
  const pedidosFiltrados = pedidos.filter((p) => {
    const f = parseFechaLocal(p.fechaEntrega);
    if (!f) return true;
    if (periodo === "Este mes") return f.getMonth() === hoy.getMonth() && f.getFullYear() === hoy.getFullYear();
    if (periodo === "Últimos 3 meses") {
      const hace3 = new Date(hoy); hace3.setMonth(hace3.getMonth() - 3);
      return f >= hace3;
    }
    if (periodo === "Este año") return f.getFullYear() === hoy.getFullYear();
    return true;
  });

  const totalIngresos = pedidosFiltrados.reduce((acc, p) => {
    const d = detallesMap[p.idPedido] || [];
    return acc + d.reduce((a, det) => a + (det.cantidad || 0) * (det.precioCongelado || 0), 0);
  }, 0);

  const pedidosConDetalles = pedidosFiltrados.filter(p => (detallesMap[p.idPedido] || []).length > 0);
  const ticketMedio = pedidosConDetalles.length > 0
    ? pedidosConDetalles.reduce((acc, p) => {
      const d = detallesMap[p.idPedido] || [];
      return acc + d.reduce((a, det) => a + (det.cantidad || 0) * (det.precioCongelado || 0), 0);
    }, 0) / pedidosConDetalles.length
    : 0;

  const clientesUnicos = new Set(pedidosFiltrados.map(p => getNombreCliente(p))).size;
  const pedidosEntregados = pedidosFiltrados.filter(p => p.estado === "Entregado").length;

  const mesesMap = {};
  pedidosFiltrados.forEach((p) => {
    const mes = mesLabel(p.fechaEntrega);
    if (!mes || mes === "—") return;
    if (!mesesMap[mes]) mesesMap[mes] = { mes, ingresos: 0, pedidos: 0 };
    const d = detallesMap[p.idPedido] || [];
    const total = d.reduce((a, det) => a + (det.cantidad || 0) * (det.precioCongelado || 0), 0);
    mesesMap[mes].ingresos += total;
    mesesMap[mes].pedidos += 1;
  });
  const datosMensuales = Object.values(mesesMap).sort((a, b) => {
    const pa = parseFechaLocal(pedidosFiltrados.find(p => mesLabel(p.fechaEntrega) === a.mes)?.fechaEntrega);
    const pb = parseFechaLocal(pedidosFiltrados.find(p => mesLabel(p.fechaEntrega) === b.mes)?.fechaEntrega);
    return (pa || 0) - (pb || 0);
  });

  const catMap = {};
  pedidosFiltrados.forEach((p) => {
    const d = detallesMap[p.idPedido] || [];
    d.forEach((det) => {
      const cat = categoriaProducto(det.nombreProducto || "");
      if (!catMap[cat]) catMap[cat] = { cat, ingresos: 0, pedidos: 0 };
      catMap[cat].ingresos += (det.cantidad || 0) * (det.precioCongelado || 0);
      catMap[cat].pedidos += 1;
    });
  });
  const datosCat = Object.values(catMap).sort((a, b) => b.ingresos - a.ingresos);

  const prodMap = {};
  pedidosFiltrados.forEach((p) => {
    const d = detallesMap[p.idPedido] || [];
    d.forEach((det) => {
      const key = (det.nombreProducto || "Desconocido").trim();
      if (!prodMap[key]) prodMap[key] = { nombre: key, ingresos: 0, veces: 0 };
      prodMap[key].ingresos += (det.cantidad || 0) * (det.precioCongelado || 0);
      prodMap[key].veces += 1;
    });
  });
  const topProductos = Object.values(prodMap).sort((a, b) => b.ingresos - a.ingresos).slice(0, 8);

  const cliMap = {};
  pedidosFiltrados.forEach((p) => {
    const nombre = getNombreCliente(p);
    if (!cliMap[nombre]) cliMap[nombre] = { nombre, ingresos: 0, pedidos: 0 };
    const d = detallesMap[p.idPedido] || [];
    cliMap[nombre].ingresos += d.reduce((a, det) => a + (det.cantidad || 0) * (det.precioCongelado || 0), 0);
    cliMap[nombre].pedidos += 1;
  });
  const topClientes = Object.values(cliMap).sort((a, b) => b.ingresos - a.ingresos).slice(0, 5);

  const historicoPedidos = [...pedidosFiltrados].sort((a, b) => b.idPedido - a.idPedido);
  const histTotal = Math.max(1, Math.ceil(historicoPedidos.length / HIST_PER_PAGE));
  const histPaginados = historicoPedidos.slice((histPage - 1) * HIST_PER_PAGE, histPage * HIST_PER_PAGE);

  return {
    tab, setTab,
    periodo, handleSetPeriodo,
    loading, error,
    pedidosFiltrados,
    totalIngresos, ticketMedio, clientesUnicos, pedidosEntregados,
    datosMensuales, datosCat, topProductos, topClientes,
    prodMap, catMap,
    historicoPedidos, histPage, setHistPage, histTotal, histPaginados,
    detallesMap,
  };
}
