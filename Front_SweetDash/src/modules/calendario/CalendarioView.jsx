import palette from "../../theme/palette";
import useCalendario from "./hooks/useCalendario";
import StatCard from "./components/StatCard";
import { DIAS_HDR, MESES, LEGEND_TIPOS, tipoStyle } from "./calendarioUtils";

export default function CalendarioView({ isMobile = false }) {
  const {
    loading, error,
    viewYear, viewMonth, diaActivo, setDiaActivo,
    searchTerm, setSearchTerm,
    eventosDia,
    entregasHoy, pendientes, estaSemana, proximoHoy,
    cells, hasEvent, isToday,
    prevMonth, nextMonth,
    handleActualizarEstado, handleEntregarPedido,
  } = useCalendario();

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
            <StatCard label="Entregas hoy" value={String(entregasHoy)} />
            <StatCard label="Esta semana" value={String(estaSemana)} trend="entregas" trendColor={palette.accent3} />
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
                onBlur={(e) => (e.target.style.borderColor = palette.border)} />
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
                  const tod = isToday(day);
                  const hasEv = hasEvent(day);
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
                          {esTarea && ev.estado !== "Completada" && ev.estado !== "Entregada" && (
                            <button
                              onClick={() => handleActualizarEstado(ev.idTarea, ev.estado === "Pendiente" ? "En proceso" : "Completada")}
                              style={{ padding: "4px 10px", borderRadius: 7, border: `1px solid ${palette.primary}`, background: "none", fontSize: 11, fontWeight: 600, color: palette.primary, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = palette.primaryLt; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}>
                              {ev.estado === "Pendiente" ? "Iniciar" : "Completar"}
                            </button>
                          )}
                          {ev.tipo === "Entrega" && ev.estadoPedido !== "Entregado" && (
                            <button
                              onClick={() => handleEntregarPedido(ev.idPedido, ev.idCliente, ev.fechaEntrega)}
                              style={{ padding: "4px 10px", borderRadius: 7, border: `1px solid ${palette.accent3}`, background: "none", fontSize: 11, fontWeight: 600, color: palette.accent3, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = palette.accent3Lt; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}>
                              Listo para entregar
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
