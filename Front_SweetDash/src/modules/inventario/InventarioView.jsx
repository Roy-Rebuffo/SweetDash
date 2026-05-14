import palette from "../../theme/palette";
import FilterSelect from "../../components/FilterSelect";
import useInventario, { getEstado, TABS } from "./hooks/useInventario";
import StatCard from "./components/StatCard";
import NuevoItemModal from "./components/NuevoItemModal";
import MateriaPrimaModal from "./components/MateriaPrimaModal";
import MaterialModal from "./components/MaterialModal";
import ConfirmModal from "./components/ConfirmModal";

function formatFecha(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
}

function diasHastaCaducidad(iso) {
  if (!iso) return null;
  const diff = new Date(iso) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function InventarioView({ isMobile = false }) {
  const {
    loading, error,
    tab, searchTerm, page, setPage,
    modalTipo, setModalTipo,
    editItem, setEditItem,
    deleteTarget, setDeleteTarget,
    deleting,
    handleNuevo, handleEditar, handleSaved, handleEliminar,
    filtrados, totalPages, paginados, handleSearch, handleTab,
    totalItems, criticos, proxCaducar,
  } = useInventario();

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
    <div style={{ maxWidth: 1050, margin: "0 auto", position: "relative" }}>

      {modalTipo === "nuevo" && !editItem && <NuevoItemModal onClose={() => setModalTipo(null)} onSaved={handleSaved} />}
      {modalTipo === "mp" && editItem && <MateriaPrimaModal item={editItem} onClose={() => { setModalTipo(null); setEditItem(null); }} onSaved={handleSaved} />}
      {modalTipo === "mat" && editItem && <MaterialModal item={editItem} onClose={() => { setModalTipo(null); setEditItem(null); }} onSaved={handleSaved} />}
      {deleteTarget && <ConfirmModal nombre={deleteTarget.nombre} onClose={() => setDeleteTarget(null)} onConfirm={handleEliminar} loading={deleting} />}

      {loading && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, gap: 12, color: palette.textLight, fontSize: 14 }}>
          <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${palette.border}`, borderTop: `2px solid ${palette.primary}`, animation: "spin 0.8s linear infinite" }} />
          Cargando inventario...
        </div>
      )}

      {!loading && error && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 14, padding: "18px 22px", marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 18 }}>⚠️</span>
          <div>
            <div style={{ fontWeight: 700, color: "#991B1B", fontSize: 13 }}>No se pudo conectar con el servidor</div>
            <div style={{ color: "#B91C1C", fontSize: 12, marginTop: 2 }}>{error} — Comprueba que Spring Boot está en <b>localhost:8080</b>.</div>
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${isMobile ? 2 : 3},1fr)`, gap: isMobile ? 10 : 14, marginBottom: isMobile ? 14 : 24 }}>
            <StatCard label="Total artículos" value={String(totalItems)} />
            <StatCard label="Stock crítico" value={String(criticos)} trend="Requieren reposición" trendColor={palette.primary} />
            <StatCard label="Próx. a caducar (30d)" value={String(proxCaducar)} trend="Revisar pronto" trendColor={palette.accent2} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            <FilterSelect value={tab} onChange={handleTab} options={TABS} minWidth={155} />
            <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center", ...(isMobile ? { width: "100%" } : {}) }}>
              <div style={{ position: "relative", flex: isMobile ? 1 : undefined }}>
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke={palette.textLight} strokeWidth={2} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                  <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                </svg>
                <input type="text" placeholder="Buscar producto..." value={searchTerm} onChange={(e) => handleSearch(e.target.value)}
                  style={{ paddingLeft: 32, paddingRight: 14, height: 34, borderRadius: 20, border: `1px solid ${palette.border}`, background: palette.bgCard, fontSize: 12.5, color: palette.textDark, width: isMobile ? "100%" : 196 }}
                  onFocus={(e) => (e.target.style.borderColor = palette.primaryMid)}
                  onBlur={(e) => (e.target.style.borderColor = palette.border)} />
              </div>
              <button onClick={handleNuevo} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 20, fontSize: 12.5, fontWeight: 600, border: "none", background: palette.primary, color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: `0 2px 10px ${palette.primary}33` }}>
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Agregar
              </button>
            </div>
          </div>

          {isMobile && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {paginados.length === 0 ? (
                <div style={{ padding: "48px 0", textAlign: "center", color: palette.textLight, fontSize: 13 }}>No se encontraron artículos</div>
              ) : (
                paginados.map((item) => {
                  const pct = Math.round((item.stock / item.stockMax) * 100);
                  const estado = getEstado(item.stock, item.stockMax);
                  const dias = diasHastaCaducidad(item.caducidad);
                  const fechaStr = formatFecha(item.caducidad);
                  const caducWarning = dias !== null && dias <= 30;
                  return (
                    <div key={item.id} style={{ background: estado.label === "CRÍTICO" ? `${palette.primaryLt}88` : palette.bgCard, borderRadius: 12, border: `1px solid ${palette.border}`, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: palette.primaryLt, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{item.emoji}</div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: palette.textDark }}>{item.nombre}</div>
                            <div style={{ fontSize: 11, color: palette.textLight }}>{item.stock} {item.unidad} en stock</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                          <span style={{ display: "inline-flex", padding: "3.5px 10px", borderRadius: 20, background: estado.bg, color: estado.color, fontSize: 11, fontWeight: 700 }}>{estado.label}</span>
                          <div style={{ display: "flex", gap: 5 }}>
                            <button onClick={() => handleEditar(item)} style={{ width: 26, height: 26, borderRadius: 6, border: `1px solid ${palette.border}`, background: palette.bgCard, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: palette.primary }}>
                              <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </button>
                            <button onClick={() => setDeleteTarget(item)} style={{ width: 26, height: 26, borderRadius: 6, border: `1px solid ${palette.border}`, background: palette.bgCard, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#EF4444" }}>
                              <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                          <span style={{ fontSize: 11.5, fontWeight: 700, color: estado.color }}>{Math.min(pct, 100)}%</span>
                          <span style={{ fontSize: 11, color: palette.textLight }}>{item.categoria === "Materias Primas" ? "M. Prima" : "Material"}</span>
                        </div>
                        <div style={{ height: 6, borderRadius: 99, background: palette.border, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${Math.min(pct, 100)}%`, borderRadius: 99, background: estado.barColor, transition: "width 0.4s ease" }} />
                        </div>
                      </div>
                      {fechaStr && <div style={{ fontSize: 11, color: caducWarning ? palette.primary : palette.textLight }}>Caduca: {fechaStr}{caducWarning ? ` ⚠️ ${dias}d` : ""}</div>}
                    </div>
                  );
                })
              )}
              {totalPages > 1 && <div style={{ display: "flex", justifyContent: "center", marginTop: 4 }}>{paginationBtns}</div>}
            </div>
          )}

          {!isMobile && (
            <div style={{ background: palette.bgCard, borderRadius: 14, border: `1px solid ${palette.border}`, boxShadow: "0 1px 4px oklch(0% 0 0 / 0.04)", overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "2.2fr 1.2fr 2.4fr 1fr 0.9fr 0.6fr", padding: "11px 22px", background: palette.bg, borderBottom: `1px solid ${palette.border}` }}>
                {["Producto", "Categoría", "Nivel de stock", "Caducidad", "Estado", ""].map((h) => (
                  <span key={h} style={{ fontSize: 10, fontWeight: 700, color: palette.textLight, letterSpacing: "0.8px", textTransform: "uppercase" }}>{h}</span>
                ))}
              </div>

              {paginados.length === 0 ? (
                <div style={{ padding: "48px 24px", textAlign: "center", color: palette.textLight, fontSize: 13 }}>No se encontraron artículos</div>
              ) : (
                paginados.map((item, i) => {
                  const pct = Math.round((item.stock / item.stockMax) * 100);
                  const estado = getEstado(item.stock, item.stockMax);
                  const dias = diasHastaCaducidad(item.caducidad);
                  const fechaStr = formatFecha(item.caducidad);
                  const caducWarning = dias !== null && dias <= 30;
                  return (
                    <div key={item.id}
                      style={{ display: "grid", gridTemplateColumns: "2.2fr 1.2fr 2.4fr 1fr 0.9fr 0.6fr", padding: "16px 22px", alignItems: "center", borderTop: i > 0 ? `1px solid ${palette.border}` : "none", transition: "background 0.12s", background: estado.label === "CRÍTICO" ? `${palette.primaryLt}88` : "transparent" }}
                      onMouseEnter={(e) => { if (estado.label !== "CRÍTICO") e.currentTarget.style.background = palette.bg; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = estado.label === "CRÍTICO" ? `${palette.primaryLt}88` : "transparent"; }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: palette.primaryLt, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{item.emoji}</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: palette.textDark }}>{item.nombre}</div>
                          <div style={{ fontSize: 11, color: palette.textLight, marginTop: 1 }}>{item.stock} {item.unidad} en stock</div>
                        </div>
                      </div>
                      <span style={{ display: "inline-flex", padding: "3px 9px", borderRadius: 20, background: item.categoria === "Materias Primas" ? palette.accent3Lt : palette.accent1Lt, color: item.categoria === "Materias Primas" ? palette.accent3 : palette.accent1, fontSize: 11, fontWeight: 600, width: "fit-content" }}>
                        {item.categoria === "Materias Primas" ? "M. Prima" : "Material"}
                      </span>
                      <div style={{ paddingRight: 20 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: estado.color }}>{Math.min(pct, 100)}%</span>
                          <span style={{ fontSize: 11, color: palette.textLight }}>{item.stock} {item.unidad}</span>
                        </div>
                        <div style={{ height: 6, borderRadius: 99, background: palette.border, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${Math.min(pct, 100)}%`, borderRadius: 99, background: estado.barColor, transition: "width 0.4s ease" }} />
                        </div>
                      </div>
                      <div>
                        {fechaStr ? (
                          <>
                            <div style={{ fontSize: 12, fontWeight: 600, color: caducWarning ? palette.primary : palette.textMid }}>{fechaStr}</div>
                            {caducWarning && <div style={{ fontSize: 11, color: palette.primary, marginTop: 1 }}>⚠️ {dias}d</div>}
                          </>
                        ) : (
                          <span style={{ fontSize: 12, color: palette.textLight }}>—</span>
                        )}
                      </div>
                      <span style={{ display: "inline-flex", padding: "3.5px 10px", borderRadius: 20, background: estado.bg, color: estado.color, fontSize: 11, fontWeight: 700, letterSpacing: "0.3px" }}>{estado.label}</span>
                      <div style={{ display: "flex", gap: 5 }}>
                        <button onClick={() => handleEditar(item)} title="Editar"
                          style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${palette.border}`, background: palette.bgCard, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: palette.primary, transition: "all 0.15s" }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = palette.primaryLt; e.currentTarget.style.borderColor = palette.primary; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = palette.bgCard; e.currentTarget.style.borderColor = palette.border; }}>
                          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => setDeleteTarget(item)} title="Eliminar"
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
                <span style={{ fontSize: 12, color: palette.textLight }}>{paginados.length} de {filtrados.length} artículos</span>
                {paginationBtns}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
