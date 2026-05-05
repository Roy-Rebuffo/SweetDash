import { useState, useEffect } from "react";
import palette from "../theme/palette";
import { pedidosApi, tareasApi, clientesApi } from "../services/api";

// ── Helpers ───────────────────────────────────────────────────────────────────
const DIAS_HDR = ["L", "M", "X", "J", "V", "S", "D"];
const MESES    = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

function tipoStyle(tipo) {
  return ({
    "Pendiente":  { bg: palette.accent2Lt, color: palette.accent2  },
    "En proceso": { bg: palette.accent1Lt, color: palette.accent1  },
    "Entrega":    { bg: palette.accent3Lt, color: palette.accent3  },
    "Finalizado": { bg: "oklch(93% 0.01 40)", color: "oklch(46% 0.02 40)" },
    "Preparado":  { bg: palette.primaryLt, color: palette.primary  },
  })[tipo] || { bg: palette.primaryLt, color: palette.primary };
}

const LEGEND_TIPOS = ["Pendiente", "En proceso", "Entrega", "Finalizado", "Preparado"];

function formatFechaKey(date) {
  // devuelve "YYYY-MM-DD"
  if (!date) return null;
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function StatCard({ label, value, trend, trendColor }) {
  return (
    <div style={{ background: palette.bgCard, borderRadius: 14, border: `1px solid ${palette.border}`, boxShadow: "0 1px 4px oklch(0% 0 0 / 0.04)", padding: "20px 22px" }}>
      <div style={{ fontSize: 10.5, fontWeight: 600, color: palette.textLight, letterSpacing: "0.7px", textTransform: "uppercase", marginBottom: 10 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: palette.textDark, letterSpacing: "-0.5px", lineHeight: 1, marginBottom: 8 }}>{value}</div>
      {trend && (
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: trendColor || palette.accent3, fontWeight: 500 }}>
          <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke={trendColor || palette.accent3} strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          {trend}
        </div>
      )}
    </div>
  );
}

export default function CalendarioView({ isMobile = false }) {
  const now = new Date();
  const [viewYear,  setViewYear]  = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [diaActivo, setDiaActivo] = useState(now.getDate());
  const [searchTerm, setSearchTerm] = useState("");

  const [pedidos,   setPedidos]   = useState([]);
  const [tareas,    setTareas]    = useState([]);
  const [clientes,  setClientes]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

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

  // Añadir entregas de pedidos
  pedidos.forEach((p) => {
    const key = formatFechaKey(p.fechaEntrega);
    if (!key) return;
    if (!eventosMap[key]) eventosMap[key] = [];
    const cliente = clientes.find((c) => c.idCliente === p.idCliente);
    const nombreCliente = cliente ? `${cliente.nombre} ${cliente.apellidos || ""}`.trim() : p.nombreCliente || "Cliente";
    eventosMap[key].push({
      id:     `pedido-${p.idPedido}`,
      titulo: `Entrega — ${nombreCliente}`,
      hora:   "—",
      tipo:   "Entrega",
      idPedido: p.idPedido,
    });
  });

  // Añadir tareas programadas
  tareas.forEach((t) => {
    const key = formatFechaKey(t.fechaEjecucion);
    if (!key) return;
    if (!eventosMap[key]) eventosMap[key] = [];
    eventosMap[key].push({
      id:     `tarea-${t.idTarea}`,
      titulo: t.nombreProceso,
      hora:   "—",
      tipo:   t.estado || "Pendiente",
      idTarea:  t.idTarea,
      idPedido: t.idPedido,
      estado:   t.estado,
    });
  });

  // Día seleccionado
  const diaKey = diaActivo
    ? `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(diaActivo).padStart(2, "0")}`
    : null;

  let eventosDia = diaKey ? (eventosMap[diaKey] || []) : [];
  if (searchTerm) {
    eventosDia = eventosDia.filter((e) => e.titulo.toLowerCase().includes(searchTerm.toLowerCase()));
  }

  // KPIs
  const todayKey = formatFechaKey(new Date());
  const entregasHoy  = (eventosMap[todayKey] || []).filter((e) => e.tipo === "Entrega").length;
  const pendientes   = tareas.filter((t) => t.estado === "Pendiente").length;
  const estaSemana   = (() => {
    const start = new Date(); start.setDate(start.getDate() - start.getDay() + 1);
    const end   = new Date(start); end.setDate(end.getDate() + 6);
    return pedidos.filter((p) => {
      const f = new Date(p.fechaEntrega);
      return f >= start && f <= end;
    }).length;
  })();

  // Próximo evento hoy
  const proximoHoy = (eventosMap[todayKey] || [])[0];

  // Calendario
  const daysInMonth  = new Date(viewYear, viewMonth + 1, 0).getDate();
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

  // Actualizar estado de tarea
  const handleActualizarEstado = async (idTarea, nuevoEstado) => {
    try {
      await tareasApi.actualizarEstado(idTarea, { estado: nuevoEstado });
      const nuevasTareas = tareas.map((t) =>
        t.idTarea === idTarea ? { ...t, estado: nuevoEstado } : t
      );
      setTareas(nuevasTareas);
    } catch (e) {
      alert("Error al actualizar: " + e.message);
    }
  };

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto" }}>

      {/* Loading */}
      {loading && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, gap: 12, color: palette.textLight, fontSize: 14 }}>
          <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${palette.border}`, borderTop: `2px solid ${palette.primary}`, animation: "spin 0.8s linear infinite" }} />
          Cargando calendario...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 14, padding: "18px 22px", marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 18 }}>⚠️</span>
          <div>
            <div style={{ fontWeight: 700, color: "#991B1B", fontSize: 13 }}>No se pudo conectar con el servidor</div>
            <div style={{ color: "#B91C1C", fontSize: 12, marginTop: 2 }}>{error}</div>
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${isMobile ? 2 : 4},1fr)`, gap: isMobile ? 10 : 14, marginBottom: isMobile ? 12 : 16 }}>
            <StatCard label="Entregas hoy"  value={String(entregasHoy)} />
            <StatCard label="Esta semana"   value={String(estaSemana)} trend="entregas" trendColor={palette.accent3} />
            <StatCard label="Tareas pendientes" value={String(pendientes)} />
            <StatCard label="Próximo evento" value={proximoHoy ? proximoHoy.tipo : "—"} />
          </div>

          {/* Search */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, marginBottom: 24, ...(isMobile ? { flexWrap: "wrap" } : {}) }}>
            <div style={{ position: "relative", flex: isMobile ? 1 : undefined }}>
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke={palette.textLight} strokeWidth={2}
                style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
              </svg>
              <input type="text" placeholder="Buscar evento..." value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: 32, paddingRight: 14, height: 34, borderRadius: 20, border: `1px solid ${palette.border}`, background: palette.bgCard, fontSize: 12.5, color: palette.textDark, width: isMobile ? "100%" : 196, outline: "none" }}
                onFocus={(e) => (e.target.style.borderColor = palette.primaryMid)}
                onBlur={(e)  => (e.target.style.borderColor = palette.border)} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.55fr", gap: 20 }}>

            {/* Calendario */}
            <div style={{ background: palette.bgCard, borderRadius: 14, border: `1px solid ${palette.border}`, boxShadow: "0 1px 4px oklch(0% 0 0 / 0.04)", padding: 22 }}>

              {/* Nav mes */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <button onClick={prevMonth} style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${palette.border}`, background: palette.bg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: palette.textMid, transition: "all 0.15s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = palette.primaryLt; e.currentTarget.style.borderColor = palette.primary; e.currentTarget.style.color = palette.primary; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = palette.bg; e.currentTarget.style.borderColor = palette.border; e.currentTarget.style.color = palette.textMid; }}>
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16, color: palette.textDark }}>{MESES[viewMonth]}</div>
                  <div style={{ fontSize: 10.5, color: palette.textLight, marginTop: 1 }}>{viewYear}</div>
                </div>
                <button onClick={nextMonth} style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${palette.border}`, background: palette.bg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: palette.textMid, transition: "all 0.15s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = palette.primaryLt; e.currentTarget.style.borderColor = palette.primary; e.currentTarget.style.color = palette.primary; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = palette.bg; e.currentTarget.style.borderColor = palette.border; e.currentTarget.style.color = palette.textMid; }}>
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>

              {/* Cabecera días */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 4 }}>
                {DIAS_HDR.map((d) => (
                  <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 700, color: palette.textLight, letterSpacing: "0.3px", padding: "0 0 6px" }}>{d}</div>
                ))}
              </div>

              {/* Grid días */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
                {cells.map((day, idx) => {
                  if (!day) return <div key={`e-${idx}`} />;
                  const isActive = day === diaActivo;
                  const tod      = isToday(day);
                  const hasEv    = hasEvent(day);
                  return (
                    <button key={day} onClick={() => setDiaActivo(day === diaActivo ? null : day)}
                      style={{ position: "relative", width: "100%", aspectRatio: "1", borderRadius: 7, fontSize: 12, border: isActive ? `1.5px solid ${palette.primary}` : tod ? `1px dashed ${palette.primaryMid}` : "1px solid transparent", background: isActive ? palette.primary : tod ? palette.primaryLt : "transparent", color: isActive ? "#fff" : tod ? palette.primary : palette.textDark, fontWeight: isActive || tod ? 700 : 400, cursor: "pointer", transition: "all 0.15s" }}
                      onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = palette.primaryLt; e.currentTarget.style.color = palette.primary; } }}
                      onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = tod ? palette.primaryLt : "transparent"; e.currentTarget.style.color = tod ? palette.primary : palette.textDark; } }}>
                      {day}
                      {hasEv && (
                        <span style={{ position: "absolute", bottom: 3, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, borderRadius: "50%", background: isActive ? "rgba(255,255,255,0.8)" : palette.primary }} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Leyenda */}
              <div style={{ height: 1, background: palette.border, margin: "16px 0 14px" }} />
              <div style={{ fontSize: 10, color: palette.textLight, marginBottom: 10, fontWeight: 700, letterSpacing: "0.7px", textTransform: "uppercase" }}>Tipos de evento</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px 8px" }}>
                {LEGEND_TIPOS.map((tipo) => {
                  const s = tipoStyle(tipo);
                  return (
                    <div key={tipo} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: palette.textMid }}>{tipo}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Panel eventos */}
            <div style={{ background: palette.bgCard, borderRadius: 14, border: `1px solid ${palette.border}`, boxShadow: "0 1px 4px oklch(0% 0 0 / 0.04)", padding: 24 }}>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 17, color: palette.textDark }}>
                  {diaActivo ? `${diaActivo} de ${MESES[viewMonth].toLowerCase()}` : `${MESES[viewMonth]} ${viewYear}`}
                </div>
                <div style={{ fontSize: 11.5, color: palette.textLight, marginTop: 3 }}>
                  {diaActivo
                    ? `${eventosDia.length} evento${eventosDia.length !== 1 ? "s" : ""} programado${eventosDia.length !== 1 ? "s" : ""}`
                    : "Selecciona un día para ver sus eventos"}
                </div>
              </div>

              {!diaActivo ? (
                <div style={{ textAlign: "center", padding: "48px 0", color: palette.textLight, fontSize: 13 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: palette.primaryLt, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke={palette.primary} strokeWidth={1.7}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  Haz clic en un día del calendario
                </div>
              ) : eventosDia.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 0", color: palette.textLight, fontSize: 13 }}>Sin eventos este día</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: isMobile ? "none" : 420, overflowY: "auto" }}>
                  {eventosDia.map((ev) => {
                    const s = tipoStyle(ev.tipo);
                    const esTarea = ev.id?.startsWith("tarea-");
                    return (
                      <div key={ev.id}
                        style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 11, background: palette.bg, border: `1px solid ${palette.border}`, borderLeft: `3px solid ${s.color}`, flexWrap: isMobile ? "wrap" : "nowrap" }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: palette.textDark, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ev.titulo}</div>
                          {ev.idPedido && (
                            <div style={{ fontSize: 11, color: palette.textLight, marginTop: 2 }}>Pedido #{String(ev.idPedido).padStart(4, "0")}</div>
                          )}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                          <span style={{ display: "inline-flex", padding: "3px 9px", borderRadius: 20, background: s.bg, color: s.color, fontSize: 10.5, fontWeight: 600 }}>{ev.tipo}</span>
                          {esTarea && ev.estado !== "Finalizado" && (
                            <button
                              onClick={() => handleActualizarEstado(ev.idTarea, ev.estado === "Pendiente" ? "En proceso" : "Finalizado")}
                              style={{ padding: "4px 10px", borderRadius: 7, border: `1px solid ${palette.primary}`, background: "none", fontSize: 11, fontWeight: 600, color: palette.primary, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = palette.primaryLt; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}>
                              {ev.estado === "Pendiente" ? "Iniciar" : "Finalizar"}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}