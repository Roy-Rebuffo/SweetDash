import palette from "../../theme/palette";
import FilterSelect from "../../components/FilterSelect";
import PedidoModal from "./components/PedidoModal";
import Avatar from "./components/Avatar";
import StatCard from "./components/StatCard";
import AvisoTareasModal from "./components/AvisoTareasModal";
import CambiarFechaModal from "./components/CambiarFechaModal";
import VistaPedidoModal from "./components/VistaPedidoModal";
import ConfirmModal from "./components/ConfirmModal";
import usePedidos, { FILTROS } from "./hooks/usePedidos";
import { estadoStyle, formatFecha, getNombreCompleto, calcularTotal, getProductoLabel } from "./pedidosUtils";

export default function PedidosView({ isMobile = false }) {
  const {
    detallesMap, loading, error,
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
  } = usePedidos();

  const paginationBtns = (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${palette.border}`, background: palette.bgCard, cursor: page === 1 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: palette.textMid, opacity: page === 1 ? 0.35 : 1 }}>
        <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <button key={n} onClick={() => setPage(n)} style={{ width: 28, height: 28, borderRadius: 7, fontSize: 12, fontWeight: 600, border: `1px solid ${n === page ? palette.primary : palette.border}`, background: n === page ? palette.primary : palette.bgCard, color: n === page ? "#fff" : palette.textMid, cursor: "pointer" }}>{n}</button>
      ))}
      <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${palette.border}`, background: palette.bgCard, cursor: page === totalPages ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: palette.textMid, opacity: page === totalPages ? 0.35 : 1 }}>
        <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  );

  return (
    <div style={{ maxWidth: 1150, margin: "0 auto", position: "relative" }}>

      {verPedido && (
        <VistaPedidoModal
          pedido={verPedido}
          detalles={detallesMap[verPedido.idPedido] || []}
          onClose={() => setVerPedido(null)}
          onEditar={handleEditar}
        />
      )}
      {modalOpen && <PedidoModal pedido={editPedido} onClose={() => setModalOpen(false)} onSaved={handleSaved} onNecesitaAviso={handleNecesitaAviso} />}

      {avisoData && (
        <AvisoTareasModal
          pedidoId={avisoData.pedidoId}
          fechaEntrega={avisoData.fechaEntrega}
          tareas={avisoData.tareas}
          tareasPasado={avisoData.tareasPasado}
          onGuardar={handleGuardarFechas}
          onDejarComoEsta={handleDejarComoEsta}
          onCambiarFecha={handleCambiarFecha}
          loading={redistribuyendo}
        />
      )}

      {cambiarFechaPedido && (
        <CambiarFechaModal
          pedido={cambiarFechaPedido}
          onClose={() => setCambiarFechaPedido(null)}
          onSaved={handleSaved}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          texto={`¿Seguro que quieres eliminar el pedido #${String(deleteTarget.idPedido).padStart(4, "0")} de ${getNombreCompleto(deleteTarget)}? Esta acción no se puede deshacer.`}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleEliminar}
          loading={deleting}
        />
      )}

      {loading && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, gap: 12, color: palette.textLight, fontSize: 14 }}>
          <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${palette.border}`, borderTop: `2px solid ${palette.primary}`, animation: "spin 0.8s linear infinite" }} />
          Cargando pedidos...
        </div>
      )}

      {!loading && error && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 14, padding: "18px 22px", marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 18 }}>⚠️</span>
          <div>
            <div style={{ fontWeight: 700, color: "#991B1B", fontSize: 13 }}>No se pudo conectar con el servidor</div>
            <div style={{ color: "#B91C1C", fontSize: 12, marginTop: 2 }}>{error} — Comprueba que Spring Boot está corriendo en <b>localhost:8080</b>.</div>
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${isMobile ? 2 : 4},1fr)`, gap: isMobile ? 10 : 14, marginBottom: isMobile ? 16 : 24 }}>
            <StatCard label="Pedidos hoy" value={String(pedidosHoy)} />
            <StatCard label="Pendientes" value={String(pendientes)} trend="esta semana" trendColor={palette.accent2} />
            <StatCard label="En proceso" value={String(enProceso)} />
            <StatCard label="Ingresos hoy" value={ingresosHoy > 0 ? `€ ${ingresosHoy.toFixed(2)}` : "€ 0"} trend="+12% vs ayer" trendColor={palette.accent3} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            <FilterSelect value={filtro} onChange={handleFiltro} options={FILTROS} minWidth={130} />
            <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center", ...(isMobile ? { width: "100%" } : {}) }}>
              <div style={{ position: "relative", flex: isMobile ? 1 : undefined }}>
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke={palette.textLight} strokeWidth={2} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                  <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                </svg>
                <input type="text" placeholder="Buscar pedido..." value={searchTerm} onChange={(e) => handleSearch(e.target.value)}
                  style={{ paddingLeft: 32, paddingRight: 14, height: 34, borderRadius: 20, border: `1px solid ${palette.border}`, background: palette.bgCard, fontSize: 12.5, color: palette.textDark, width: isMobile ? "100%" : 196 }}
                  onFocus={(e) => (e.target.style.borderColor = palette.primaryMid)}
                  onBlur={(e) => (e.target.style.borderColor = palette.border)} />
              </div>
              <button onClick={handleNuevo} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 20, fontSize: 11.5, fontWeight: 600, border: "none", background: palette.primary, color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap", flexShrink: 0 }}>
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Nuevo pedido
              </button>
            </div>
          </div>

          {isMobile && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {paginados.length === 0 ? (
                <div style={{ padding: "48px 0", textAlign: "center", color: palette.textLight, fontSize: 13 }}>No se encontraron pedidos</div>
              ) : (
                paginados.map((p, i) => {
                  const es = estadoStyle[p.estado] || estadoStyle["Pendiente"];
                  const detalles = detallesMap[p.idPedido] || [];
                  const producto = getProductoLabel(detalles);
                  const total = calcularTotal(detalles);
                  const nombreCompleto = getNombreCompleto(p);
                  return (
                    <div key={p.idPedido} onClick={() => setVerPedido(p)} style={{ background: palette.bgCard, borderRadius: 12, border: `1px solid ${palette.border}`, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8, cursor: "pointer" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                          <Avatar nombre={nombreCompleto} idx={i} />
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: palette.textDark }}>{nombreCompleto}</div>
                            <div style={{ fontSize: 11, color: palette.textLight }}>#{String(p.idPedido).padStart(4, "0")}</div>
                          </div>
                        </div>
                        <span style={{ display: "inline-flex", padding: "3.5px 10px", borderRadius: 20, background: es.bg, color: es.color, fontSize: 11, fontWeight: 600 }}>{p.estado}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 12, color: palette.textMid, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 8 }}>{producto}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: palette.textDark, flexShrink: 0 }}>{total}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontSize: 11, color: palette.textLight }}>{formatFecha(p.fechaEntrega)}</div>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button onClick={(e) => { e.stopPropagation(); handleEditar(p); }} title="Editar" style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${palette.border}`, background: palette.bgCard, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: palette.primary }}>
                            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(p); }} title="Eliminar" style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${palette.border}`, background: palette.bgCard, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#EF4444" }}>
                            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              {totalPages > 1 && <div style={{ display: "flex", justifyContent: "center", marginTop: 4 }}>{paginationBtns}</div>}
            </div>
          )}

          {!isMobile && (
            <div style={{ background: palette.bgCard, borderRadius: 14, border: `1px solid ${palette.border}`, boxShadow: "0 1px 4px oklch(0% 0 0 / 0.04)", overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "0.7fr 2fr 2.2fr 1.3fr 1.6fr 0.8fr 1fr", padding: "11px 22px", background: palette.bg, borderBottom: `1px solid ${palette.border}` }}>
                {["ID", "Cliente", "Producto", "Fecha entrega", "Estado", "Total", ""].map((h) => (
                  <span key={h} style={{ fontSize: 10, fontWeight: 700, color: palette.textLight, letterSpacing: "0.8px", textTransform: "uppercase" }}>{h}</span>
                ))}
              </div>

              {paginados.length === 0 ? (
                <div style={{ padding: "48px 24px", textAlign: "center", color: palette.textLight, fontSize: 13 }}>No se encontraron pedidos</div>
              ) : (
                paginados.map((p, i) => {
                  const es = estadoStyle[p.estado] || estadoStyle["Pendiente"];
                  const detalles = detallesMap[p.idPedido] || [];
                  const producto = getProductoLabel(detalles);
                  const total = calcularTotal(detalles);
                  const nombreCompleto = getNombreCompleto(p);
                  return (
                    <div key={p.idPedido}
                      onClick={() => setVerPedido(p)}
                      style={{ display: "grid", gridTemplateColumns: "0.7fr 2fr 2.2fr 1.3fr 1.6fr 0.8fr 1fr", padding: "13px 22px", alignItems: "center", borderTop: i > 0 ? `1px solid ${palette.border}` : "none", transition: "background 0.12s", cursor: "pointer" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = palette.bg)}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                      <span style={{ fontSize: 11, color: palette.textLight, fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>#{String(p.idPedido).padStart(4, "0")}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                        <Avatar nombre={nombreCompleto} idx={i} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: palette.textDark }}>{nombreCompleto}</span>
                      </div>
                      <span style={{ fontSize: 12.5, color: palette.textMid, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 12 }}>{producto}</span>
                      <span style={{ fontSize: 12, color: palette.textMid }}>{formatFecha(p.fechaEntrega)}</span>
                      <div>
                        <span style={{ display: "inline-flex", alignItems: "center", padding: "3.5px 10px", borderRadius: 20, background: es.bg, color: es.color, fontSize: 11, fontWeight: 600 }}>{p.estado}</span>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: palette.textDark }}>{total}</span>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={(e) => { e.stopPropagation(); handleEditar(p); }} title="Editar"
                          style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${palette.border}`, background: palette.bgCard, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: palette.primary, transition: "all 0.15s" }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = palette.primaryLt; e.currentTarget.style.borderColor = palette.primary; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = palette.bgCard; e.currentTarget.style.borderColor = palette.border; }}>
                          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(p); }} title="Eliminar"
                          style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${palette.border}`, background: palette.bgCard, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#EF4444", transition: "all 0.15s" }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "#FEF2F2"; e.currentTarget.style.borderColor = "#EF4444"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = palette.bgCard; e.currentTarget.style.borderColor = palette.border; }}>
                          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 22px", borderTop: `1px solid ${palette.border}`, background: palette.bg }}>
                <span style={{ fontSize: 12, color: palette.textLight }}>{paginados.length} de {filtrados.length} pedidos</span>
                {paginationBtns}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
