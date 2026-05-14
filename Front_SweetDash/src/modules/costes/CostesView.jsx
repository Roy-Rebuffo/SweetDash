import { useState } from "react";
import palette from "../../theme/palette";
import useCostes from "./hooks/useCostes";
import EscandalloCard from "./components/EscandalloCard";
import { fmt, pct, margenColor, margenBg } from "./costesUtils";

export default function CostesView({ isMobile = false, onNavigate, onEditarReceta }) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const {
    loading, loadingRecetas, error,
    recetas, productoActivo, setProductoActivo,
    searchTerm, setSearchTerm,
    productosFiltrados,
    mejorMargen, costePromedio, mpsSinPrecio,
  } = useCostes();

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, gap: 12, color: palette.textLight, fontSize: 14 }}>
      <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${palette.border}`, borderTop: `2px solid ${palette.primary}`, animation: "spin 0.8s linear infinite" }} />
      Cargando costes...
    </div>
  );

  if (error) return (
    <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 14, padding: "18px 22px", display: "flex", gap: 12, alignItems: "center" }}>
      <span style={{ fontSize: 18 }}>⚠️</span>
      <div style={{ fontSize: 13, color: "#991B1B" }}>{error}</div>
    </div>
  );

  return (
    <div style={{ maxWidth: 1150, margin: "0 auto", width: "100%", overflowX: "hidden", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "260px 1fr", gap: 20, alignItems: "start" }}>

      {/* ── Panel izquierdo: lista de productos (solo desktop) ── */}
      {!isMobile && (
        <div style={{ background: palette.bgCard, borderRadius: 16, border: `1px solid ${palette.border}`, overflow: "hidden", position: "sticky", top: 0 }}>
          <div style={{ padding: "16px 16px 10px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: palette.textLight, letterSpacing: "0.7px", textTransform: "uppercase", marginBottom: 10 }}>Productos</div>
            <div style={{ position: "relative" }}>
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke={palette.textLight} strokeWidth={2}
                style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
              </svg>
              <input type="text" placeholder="Buscar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                style={{ width: "100%", paddingLeft: 28, paddingRight: 10, height: 32, borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.bg, fontSize: 12, color: palette.textDark, fontFamily: "'DM Sans', sans-serif" }}
                onFocus={e => e.target.style.borderColor = palette.primaryMid}
                onBlur={e  => e.target.style.borderColor = palette.border} />
            </div>
          </div>

          <div style={{ maxHeight: 520, overflowY: "auto" }}>
            {productosFiltrados.map(p => {
              const activo = productoActivo?.idProducto === p.idProducto;
              return (
                <button key={p.idProducto} onClick={() => setProductoActivo(p)}
                  style={{ width: "100%", textAlign: "left", padding: "11px 16px", border: "none", borderTop: `1px solid ${palette.border}`, background: activo ? palette.primaryLt : "transparent", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "background 0.1s" }}
                  onMouseEnter={e => { if (!activo) e.currentTarget.style.background = palette.bg; }}
                  onMouseLeave={e => { if (!activo) e.currentTarget.style.background = "transparent"; }}>
                  <div style={{ fontSize: 13, fontWeight: activo ? 700 : 500, color: activo ? palette.primary : palette.textDark, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.nombre}</div>
                  {p.tipo && <div style={{ fontSize: 11, color: palette.textLight, marginTop: 1 }}>{p.tipo}</div>}
                </button>
              );
            })}
            {productosFiltrados.length === 0 && (
              <div style={{ padding: "24px 16px", textAlign: "center", color: palette.textLight, fontSize: 12 }}>Sin resultados</div>
            )}
          </div>
        </div>
      )}

      {/* ── Panel derecho ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Mobile: dropdown selector de producto */}
        {isMobile && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: palette.textLight, letterSpacing: "0.7px", textTransform: "uppercase", marginBottom: 8 }}>Productos</div>
            <button onClick={() => setPickerOpen(v => !v)}
              style={{ width: "100%", background: palette.primaryLt, border: `1px solid #F0C5D0`, borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                <div style={{ fontWeight: 600, color: palette.primary, fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {productoActivo ? productoActivo.nombre : "Selecciona un producto"}
                </div>
                {productoActivo && (
                  <div style={{ fontSize: 12, color: palette.primaryMid, marginTop: 2 }}>
                    {productoActivo.tipo ? `${productoActivo.tipo} · ` : ""}{recetas.length} tamaño{recetas.length !== 1 ? "s" : ""}
                  </div>
                )}
              </div>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke={palette.primary} strokeWidth={2}
                style={{ flexShrink: 0, transform: pickerOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {pickerOpen && (
              <div style={{ background: palette.bgCard, border: `1px solid ${palette.border}`, borderRadius: 14, marginTop: 6, overflow: "hidden" }}>
                <div style={{ padding: "10px 12px" }}>
                  <div style={{ position: "relative" }}>
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke={palette.textLight} strokeWidth={2}
                      style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                      <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                    </svg>
                    <input type="text" placeholder="Buscar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                      style={{ width: "100%", paddingLeft: 28, paddingRight: 10, height: 34, borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.bg, fontSize: 12, color: palette.textDark, fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" }}
                      onFocus={e => e.target.style.borderColor = palette.primaryMid}
                      onBlur={e  => e.target.style.borderColor = palette.border} />
                  </div>
                </div>
                <div style={{ maxHeight: 220, overflowY: "auto" }}>
                  {productosFiltrados.map(p => {
                    const activo = productoActivo?.idProducto === p.idProducto;
                    return (
                      <button key={p.idProducto} onClick={() => { setProductoActivo(p); setPickerOpen(false); }}
                        style={{ width: "100%", textAlign: "left", padding: "11px 16px", border: "none", borderTop: `1px solid ${palette.border}`, background: activo ? palette.primaryLt : "transparent", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                        <div style={{ fontSize: 13, fontWeight: activo ? 700 : 500, color: activo ? palette.primary : palette.textDark, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.nombre}</div>
                        {p.tipo && <div style={{ fontSize: 11, color: palette.textLight, marginTop: 1 }}>{p.tipo}</div>}
                      </button>
                    );
                  })}
                  {productosFiltrados.length === 0 && (
                    <div style={{ padding: "20px 16px", textAlign: "center", color: palette.textLight, fontSize: 12 }}>Sin resultados</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Header producto */}
        {productoActivo && (
          <div style={{ background: palette.bgCard, borderRadius: 16, border: `1px solid ${palette.border}`, padding: isMobile ? "14px 14px" : "18px 22px" }}>
            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "stretch" : "flex-start", justifyContent: "space-between", gap: isMobile ? 10 : 12 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? 17 : 18, fontWeight: 700, color: palette.textDark }}>{productoActivo.nombre}</div>
                <div style={{ fontSize: 12, color: palette.textLight, marginTop: 3 }}>
                  {productoActivo.tipo && <span style={{ marginRight: 10 }}>{productoActivo.tipo}</span>}
                  Precio base {productoActivo.precioBase ? `€ ${Number(productoActivo.precioBase).toFixed(2)}` : "—"}
                  {productoActivo.costeFijo > 0 && ` · Coste fijo € ${Number(productoActivo.costeFijo).toFixed(2)}`}
                </div>
              </div>

              {/* Botón editar receta */}
              <button onClick={() => onEditarReceta && onEditarReceta(productoActivo)}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 14px", borderRadius: 10, border: `1px solid ${palette.primary}`, background: palette.primaryLt, color: palette.primary, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap", width: isMobile ? "100%" : undefined, flexShrink: 0 }}>
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                Editar en Recetas
              </button>
            </div>

            {/* KPIs del producto */}
            {recetas.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: isMobile ? 8 : 12, marginTop: 14, paddingTop: 14, borderTop: `1px solid ${palette.border}` }}>
                <div style={{ background: palette.bg, borderRadius: 10, padding: isMobile ? "10px 10px" : "12px 14px" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: palette.textLight, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>Tamaños</div>
                  <div style={{ fontSize: isMobile ? 18 : 20, fontWeight: 800, color: palette.textDark }}>{recetas.length}</div>
                </div>
                <div style={{ background: palette.bg, borderRadius: 10, padding: isMobile ? "10px 10px" : "12px 14px" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: palette.textLight, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>Coste prom.</div>
                  <div style={{ fontSize: isMobile ? 16 : 20, fontWeight: 800, color: palette.textDark }}>€ {costePromedio.toFixed(2)}</div>
                </div>
                <div style={{ background: palette.bg, borderRadius: 10, padding: isMobile ? "10px 10px" : "12px 14px" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: palette.textLight, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>Mejor margen</div>
                  <div style={{ fontSize: isMobile ? 16 : 20, fontWeight: 800, color: margenColor(mejorMargen ? Number(mejorMargen.margenPct) : null) }}>
                    {mejorMargen ? pct(mejorMargen.margenPct) : "—"}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Comparativa rápida si hay varios tamaños */}
        {recetas.length > 1 && (
          <div style={{ background: palette.bgCard, borderRadius: 16, border: `1px solid ${palette.border}`, padding: isMobile ? "14px 0 14px" : "16px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, padding: isMobile ? "0 16px" : undefined }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: palette.textLight, letterSpacing: "0.7px", textTransform: "uppercase" }}>Comparativa de tamaños</div>
              {isMobile && (
                <div style={{ fontSize: 11, fontWeight: 600, color: palette.textLight }}>{recetas.length} tamaño{recetas.length !== 1 ? "s" : ""}</div>
              )}
            </div>
            <div style={{ display: "flex", gap: isMobile ? 10 : 8, flexWrap: isMobile ? "nowrap" : "wrap", overflowX: isMobile ? "auto" : undefined, scrollSnapType: isMobile ? "x mandatory" : undefined, WebkitOverflowScrolling: isMobile ? "touch" : undefined, paddingLeft: isMobile ? 16 : undefined, paddingRight: isMobile ? 16 : undefined, paddingBottom: isMobile ? 4 : undefined }}>
              {[...recetas].sort((a, b) => (a.tamañoCm || 0) - (b.tamañoCm || 0)).map(r => {
                const margen = r.margenPct ? Number(r.margenPct) : null;
                const parts = (r.descripcionTamaño || "").split(" - ");
                const mainLabel = parts[0] || (r.tamañoCm ? `${r.tamañoCm}cm` : "—");
                const subLabel = parts.slice(1).join(" - ");
                return (
                  <div key={r.id} style={{ flex: isMobile ? "0 0 200px" : "1 1 110px", scrollSnapAlign: isMobile ? "start" : undefined, background: palette.bg, borderRadius: 10, border: `1px solid ${palette.border}`, padding: "12px 14px", textAlign: isMobile ? "left" : "center" }}>
                    <div style={{ fontSize: isMobile ? 18 : 15, fontWeight: 800, color: palette.textDark }}>{mainLabel}</div>
                    {isMobile && subLabel ? (
                      <div style={{ fontSize: 11, color: palette.textLight, marginBottom: 10, marginTop: 1 }}>{subLabel}</div>
                    ) : null}
                    {isMobile ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: 10, fontWeight: 600, color: palette.textLight, textTransform: "uppercase", letterSpacing: "0.4px" }}>Coste</span>
                          <span style={{ fontSize: 13, fontWeight: 700, color: palette.textDark }}>{fmt(r.costeTotal)}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: 10, fontWeight: 600, color: palette.textLight, textTransform: "uppercase", letterSpacing: "0.4px" }}>PVP</span>
                          <span style={{ fontSize: 13, fontWeight: 700, color: palette.primary }}>{fmt(r.precioVenta)}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: 10, fontWeight: 600, color: palette.textLight, textTransform: "uppercase", letterSpacing: "0.4px" }}>Ganancia</span>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#16A34A" }}>{fmt(r.ganancia)}</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div style={{ fontSize: 11, color: palette.textMid, margin: "4px 0" }}>Coste {fmt(r.costeTotal)}</div>
                        <div style={{ fontSize: 11, color: palette.primary, fontWeight: 600, marginBottom: 6 }}>PVP {fmt(r.precioVenta)}</div>
                      </>
                    )}
                    <div style={{ display: isMobile ? "flex" : "inline-block", justifyContent: isMobile ? "flex-start" : undefined, background: margenBg(margen), borderRadius: 20, padding: "3px 10px" }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: margenColor(margen) }}>{pct(margen)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Lista escandallos */}
        {loadingRecetas ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 120, gap: 10, color: palette.textLight, fontSize: 13 }}>
            <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${palette.border}`, borderTop: `2px solid ${palette.primary}`, animation: "spin 0.8s linear infinite" }} />
            Cargando escandallos...
          </div>
        ) : recetas.length === 0 ? (
          <div style={{ background: palette.bgCard, borderRadius: 16, border: `1px dashed ${palette.border}`, padding: "48px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📊</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: palette.textDark, marginBottom: 6 }}>Sin escandallos todavía</div>
            <div style={{ fontSize: 12, color: palette.textLight, marginBottom: 18 }}>Ve a Recetas, edita este producto y añade los tamaños con sus ingredientes y precios.</div>
            <button onClick={() => onNavigate && onNavigate("recetas")}
              style={{ padding: "8px 18px", borderRadius: 10, border: "none", background: palette.primary, fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Ir a Recetas
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {recetas.map(r => <EscandalloCard key={r.id} receta={r} isMobile={isMobile} />)}
          </div>
        )}

        {/* Aviso ingredientes sin precio */}
        {mpsSinPrecio.length > 0 && (
          <div style={{ background: "oklch(98% 0.02 80)", border: "1px solid oklch(88% 0.08 80)", borderRadius: 12, padding: "12px 16px", display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
            <div style={{ fontSize: 12, color: "oklch(45% 0.08 80)" }}>
              <b>{mpsSinPrecio.length} materia{mpsSinPrecio.length !== 1 ? "s prima" : " prima"} sin precio configurado</b> ({mpsSinPrecio.map(m => m.nombre).join(", ")}).
              {" "}
              <button onClick={() => onNavigate && onNavigate("productos")}
                style={{ background: "none", border: "none", cursor: "pointer", color: "oklch(45% 0.08 80)", textDecoration: "underline", fontFamily: "'DM Sans', sans-serif", fontSize: 12, padding: 0 }}>
                Ir a Inventario a configurarlas
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
