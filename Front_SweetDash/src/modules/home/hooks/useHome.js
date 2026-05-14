import { useState, useEffect } from "react";
import { pedidosApi, clientesApi, productosApi } from "../../../services/api";
import { formatFecha } from "../homeUtils";

export default function useHome() {
  const [loading, setLoading] = useState(true);
  const [pedidos, setPedidos] = useState([]);
  const [detallesMap, setDetallesMap] = useState({});
  const [totalClientes, setTotalClientes] = useState(0);
  const [totalProductos, setTotalProductos] = useState(0);

  useEffect(() => {
    Promise.all([
      pedidosApi.getAll(),
      clientesApi.getAll(),
      productosApi.getAll(),
    ]).then(async ([peds, clientes, productos]) => {
      setPedidos(peds);
      setTotalClientes(clientes.length);
      setTotalProductos(productos.length);

      const recientes = [...peds].sort((a, b) => b.idPedido - a.idPedido).slice(0, 8);
      const map = {};
      await Promise.all(recientes.map(async (p) => {
        try { map[p.idPedido] = await pedidosApi.getDetalles(p.idPedido); }
        catch { map[p.idPedido] = []; }
      }));
      setDetallesMap(map);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const hoy = new Date().toISOString().slice(0, 10);
  const pedidosHoy = pedidos.filter(p => formatFecha(p.fechaEntrega) === hoy).length;
  const pendientes = pedidos.filter(p => p.estado === "Pendiente" || p.estado === "En proceso").length;
  const ingresosEsteMes = (() => {
    const mesActual = new Date().toISOString().slice(0, 7);
    return pedidos
      .filter(p => formatFecha(p.fechaEntrega).startsWith(mesActual))
      .reduce((acc, p) => {
        const detalles = detallesMap[p.idPedido] || [];
        return acc + detalles.reduce((a, d) => a + d.cantidad * (d.precioCongelado || 0), 0);
      }, 0);
  })();

  const quickStats = [
    { label: "Pedidos hoy",      value: loading ? "—" : String(pedidosHoy),                  trend: "entregas programadas", trendKey: "accent3" },
    { label: "Ingresos del mes", value: loading ? "—" : `€ ${ingresosEsteMes.toFixed(0)}`,    trend: "este mes",             trendKey: "accent3" },
    { label: "Activos",          value: loading ? "—" : String(pendientes),                   trend: "pendientes o en curso", trendKey: "accent2" },
    { label: "Clientes",         value: loading ? "—" : String(totalClientes),                trend: "en base de datos",     trendKey: "accent1" },
  ];

  const pedidosRecientes = [...pedidos]
    .sort((a, b) => b.idPedido - a.idPedido)
    .slice(0, 4);

  return {
    loading,
    detallesMap,
    quickStats,
    pedidosRecientes,
  };
}
