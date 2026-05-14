import { useState, useEffect } from "react";
import { pedidosApi, tareasApi, clientesApi } from "../../../services/api";
import { formatFechaKey } from "../calendarioUtils";

export default function useCalendario() {
  const now = new Date();
  const [viewYear,  setViewYear]  = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [diaActivo, setDiaActivo] = useState(now.getDate());
  const [searchTerm, setSearchTerm] = useState("");

  const [pedidos,  setPedidos]  = useState([]);
  const [tareas,   setTareas]   = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([pedidosApi.getAll(), tareasApi.getAll(), clientesApi.getAll()])
      .then(([peds, tar, clis]) => {
        setPedidos(peds);
        setTareas(tar);
        setClientes(clis);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Construir mapa de eventos por fecha "YYYY-MM-DD"
  const eventosMap = {};

  pedidos.forEach((p) => {
    const key = formatFechaKey(p.fechaEntrega);
    if (!key) return;
    if (!eventosMap[key]) eventosMap[key] = [];
    const cliente = clientes.find((c) => c.idCliente === p.idCliente);
    const nombreCliente = cliente ? `${cliente.nombre} ${cliente.apellidos || ""}`.trim() : p.nombreCliente || "Cliente";
    eventosMap[key].push({
      id: `pedido-${p.idPedido}`,
      titulo: `Entrega — ${nombreCliente}`,
      hora: "—",
      tipo: p.estado === "Entregado" ? "Entregada" : "Entrega",
      idPedido: p.idPedido,
      idCliente: p.idCliente,
      fechaEntrega: p.fechaEntrega,
      estadoPedido: p.estado,
    });
  });

  tareas.forEach((t) => {
    const key = formatFechaKey(t.fechaEjecucion);
    if (!key) return;
    if (!eventosMap[key]) eventosMap[key] = [];
    eventosMap[key].push({
      id: `tarea-${t.idTarea}`,
      titulo: t.nombreProceso,
      hora: "—",
      tipo: t.estado || "Pendiente",
      idTarea: t.idTarea,
      idPedido: t.idPedido,
      estado: t.estado,
    });
  });

  const diaKey = diaActivo
    ? `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(diaActivo).padStart(2, "0")}`
    : null;

  let eventosDia = diaKey ? (eventosMap[diaKey] || []) : [];
  if (searchTerm) {
    eventosDia = eventosDia.filter((e) => e.titulo.toLowerCase().includes(searchTerm.toLowerCase()));
  }

  const todayKey = formatFechaKey(new Date());
  const entregasHoy = (eventosMap[todayKey] || []).filter((e) => e.tipo === "Entrega").length;
  const pendientes = tareas.filter((t) => t.estado === "Pendiente").length;
  const estaSemana = (() => {
    const start = new Date(); start.setDate(start.getDate() - start.getDay() + 1);
    const end = new Date(start); end.setDate(end.getDate() + 6);
    return pedidos.filter((p) => {
      const f = new Date(p.fechaEntrega);
      return f >= start && f <= end;
    }).length;
  })();
  const proximoHoy = (eventosMap[todayKey] || [])[0];

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstWeekday = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;
  const cells = [...Array(firstWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const hasEvent = (day) => {
    const key = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return !!(eventosMap[key] && eventosMap[key].length > 0);
  };

  const isToday = (day) => {
    const t = new Date();
    return day === t.getDate() && viewMonth === t.getMonth() && viewYear === t.getFullYear();
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11); }
    else setViewMonth((m) => m - 1);
    setDiaActivo(null);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0); }
    else setViewMonth((m) => m + 1);
    setDiaActivo(null);
  };

  const handleActualizarEstado = async (idTarea, nuevoEstado) => {
    try {
      await tareasApi.actualizarEstado(idTarea, { estado: nuevoEstado });
      setTareas((prev) => prev.map((t) => t.idTarea === idTarea ? { ...t, estado: nuevoEstado } : t));
    } catch (e) {
      alert("Error al actualizar: " + e.message);
    }
  };

  const handleEntregarPedido = async (idPedido, idCliente, fechaEntrega) => {
    try {
      await pedidosApi.update(idPedido, { idCliente, fechaEntrega, estado: "Entregado" });
      const [newPeds, newTar, newClis] = await Promise.all([
        pedidosApi.getAll(),
        tareasApi.getAll(),
        clientesApi.getAll(),
      ]);
      setPedidos(newPeds);
      setTareas(newTar);
      setClientes(newClis);
    } catch (e) {
      alert("Error al entregar: " + e.message);
    }
  };

  return {
    loading, error,
    viewYear, viewMonth, diaActivo, setDiaActivo,
    searchTerm, setSearchTerm,
    eventosDia, eventosMap,
    entregasHoy, pendientes, estaSemana, proximoHoy,
    cells, hasEvent, isToday,
    prevMonth, nextMonth,
    handleActualizarEstado, handleEntregarPedido,
  };
}
