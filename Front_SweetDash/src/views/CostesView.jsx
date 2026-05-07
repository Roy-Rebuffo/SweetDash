import { useState, useEffect } from "react";
import palette from "../theme/palette";
import { productosApi, materiasPrimasApi, recetasTamañoApi } from "../services/api";

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(n) {
  if (n == null) return "—";
  return `€ ${Number(n).toFixed(2)}`;
}

function pct(n) {
  if (n == null) return "—";
  return `${Number(n).toFixed(1)}%`;
}

function margenColor(margen) {
  if (margen == null) return palette.textLight;
  if (margen >= 50) return "#16A34A";
  if (margen >= 30) return palette.accent3;
  return "#EF4444";
}

function margenBg(margen) {
  if (margen == null) return palette.border;
  if (margen >= 50) return "#DCFCE7";
  if (margen >= 30) return palette.accent3Lt;
  return "#FEE2E2";
}

// ── Tarjeta de escandallo ─────────────────────────────────────────────────────
function EscandalloCard({ receta }) {
  const [expanded, setExpanded] = useState(false);
  const margen = receta.margenPct ? Number(receta.margenPct) : null;

  return (
    <div style={{ background: palette.bg, borderRadius: 12, border: `1px solid ${palette.border}`, overflow: "hidden" }}>
      {/* Cabecera */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer" }}
        onClick={() => setExpanded(e => !e)}>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: palette.textDark }}>
            {receta.descripcionTamaño || (receta.tamañoCm ? `${receta.tamañoCm} cm` : "Sin tamaño")}
          </div>
          <div style={{ fontSize: 11, color: palette.textLight, marginTop: 2 }}>
            {receta.ingredientes?.length || 0} ingrediente{receta.ingredientes?.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* KPIs */}
        <div style={{ display: "flex", gap: 16, alignItems: "center", flexShrink: 0 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: palette.textLight, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Coste</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: palette.textDark }}>{fmt(receta.costeTotal)}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: palette.textLight, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>PVP</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: palette.primary }}>{fmt(receta.precioVenta)}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: palette.textLight, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Ganancia</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#16A34A" }}>{fmt(receta.ganancia)}</div>
          </div>
          <div style={{ background: margenBg(margen), borderRadius: 20, padding: "4px 10px", textAlign: "center", minWidth: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: margenColor(margen) }}>{pct(margen)}</div>
            <div style={{ fontSize: 9, color: margenColor(margen), opacity: 0.8 }}>margen</div>
          </div>
        </div>

        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke={palette.textLight} strokeWidth={2}
          style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Detalle ingredientes */}
      {expanded && (
        <div style={{ borderTop: `1px solid ${palette.border}`, padding: "14px 16px" }}>
          {/* Cabecera tabla */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 8, paddingBottom: 8, borderBottom: `1px solid ${palette.border}`, marginBottom: 8 }}>
            {["Ingrediente", "Cantidad", "Paquete", "Precio/paq.", "Coste"].map(h => (
              <span key={h} style={{ fontSize: 10, fontWeight: 700, color: palette.textLight, letterSpacing: "0.6px", textTransform: "uppercase" }}>{h}</span>
            ))}
          </div>

          {receta.ingredientes?.length === 0 && (
            <div style={{ fontSize: 12, color: palette.textLight, padding: "8px 0" }}>Sin ingredientes definidos</div>
          )}

          {receta.ingredientes?.map((ing, i) => (
            <div key={ing.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 8, padding: "7px 0", borderTop: i > 0 ? `1px solid ${palette.border}` : "none", alignItems: "center" }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: palette.textDark }}>{ing.nombreMateriaPrima}</span>
              <span style={{ fontSize: 12, color: palette.textMid }}>{ing.cantidadUsada} {ing.unidad}</span>
              <span style={{ fontSize: 12, color: palette.textMid }}>{ing.unidadesPaquete} {ing.unidad}</span>
              <span style={{ fontSize: 12, color: palette.textMid }}>{fmt(ing.precioPaquete)}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: palette.primary }}>{fmt(ing.costeIngrediente)}</span>
            </div>
          ))}

          {/* Resumen */}
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${palette.border}`, display: "flex", justifyContent: "flex-end", gap: 28 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10, color: palette.textLight, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Coste ingredientes</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: palette.textDark }}>{fmt(receta.costeTotal)}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10, color: palette.textLight, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Ganancia</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#16A34A" }}>{fmt(receta.ganancia)}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10, color: palette.textLight, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Margen</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: margenColor(margen) }}>{pct(margen)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Vista principal ───────────────────────────────────────────────────────────
export default function CostesView({ isMobile = false, onNavigate, onEditarReceta }) {
  const [productos,      setProductos]      = useState([]);
  const [materiasPrimas, setMateriasPrimas] = useState([]);
  const [recetas,        setRecetas]        = useState([]);
  const [productoActivo, setProductoActivo] = useState(null);
  const [loading,        setLoading]        = useState(true);
  const [loadingRecetas, setLoadingRecetas] = useState(false);
  const [error,          setError]          = useState(null);
  const [searchTerm,     setSearchTerm]     = useState("");

  useEffect(() => {
    setLoading(true);
    Promise.all([productosApi.getAll(), materiasPrimasApi.getAll()])
      .then(([prods, mps]) => {
        setProductos(prods);
        setMateriasPrimas(mps);
        if (prods.length > 0) setProductoActivo(prods[0]);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!productoActivo) return;
    setLoadingRecetas(true);
    recetasTamañoApi.getByProducto(productoActivo.idProducto)
      .then(setRecetas)
      .catch(() => setRecetas([]))
      .finally(() => setLoadingRecetas(false));
  }, [productoActivo]);

  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // KPIs del producto activo
  const mejorMargen = recetas.length > 0
    ? recetas.reduce((best, r) => (Number(r.margenPct) > Number(best.margenPct) ? r : best), recetas[0])
    : null;
  const costePromedio = recetas.length > 0
    ? recetas.reduce((acc, r) => acc + Number(r.costeTotal || 0), 0) / recetas.length
    : 0;

  // Ingredientes sin precio configurado
  const mpsSinPrecio = materiasPrimas.filter(m => !m.precioPaquete || Number(m.precioPaquete) === 0);

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
    <div style={{ maxWidth: 1150, margin: "0 auto", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "260px 1fr", gap: 20, alignItems: "start" }}>

      {/* ── Panel izquierdo: lista de productos ── */}
      <div style={{ background: palette.bgCard, borderRadius: 16, border: `1px solid ${palette.border}`, overflow: "hidden", position: isMobile ? "static" : "sticky", top: 0 }}>
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

        <div style={{ maxHeight: isMobile ? 180 : 520, overflowY: "auto" }}>
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

      {/* ── Panel derecho ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Header producto */}
        {productoActivo && (
          <div style={{ background: palette.bgCard, borderRadius: 16, border: `1px solid ${palette.border}`, padding: "18px 22px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: palette.textDark }}>{productoActivo.nombre}</div>
                <div style={{ fontSize: 12, color: palette.textLight, marginTop: 3 }}>
                  {productoActivo.tipo && <span style={{ marginRight: 10 }}>{productoActivo.tipo}</span>}
                  Precio base {productoActivo.precioBase ? `€ ${Number(productoActivo.precioBase).toFixed(2)}` : "—"}
                  {productoActivo.costeFijo > 0 && ` · Coste fijo € ${Number(productoActivo.costeFijo).toFixed(2)}`}
                </div>
              </div>

              {/* Botón editar receta */}
              <button onClick={() => onEditarReceta && onEditarReceta(productoActivo)}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: `1px solid ${palette.primary}`, background: palette.primaryLt, color: palette.primary, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap", flexShrink: 0 }}>
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                Editar en Recetas
              </button>
            </div>

            {/* KPIs del producto */}
            {recetas.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 16, paddingTop: 16, borderTop: `1px solid ${palette.border}` }}>
                <div style={{ background: palette.bg, borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: palette.textLight, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>Tamaños definidos</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: palette.textDark }}>{recetas.length}</div>
                </div>
                <div style={{ background: palette.bg, borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: palette.textLight, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>Coste promedio</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: palette.textDark }}>€ {costePromedio.toFixed(2)}</div>
                </div>
                <div style={{ background: palette.bg, borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: palette.textLight, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>Mejor margen</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: margenColor(mejorMargen ? Number(mejorMargen.margenPct) : null) }}>
                    {mejorMargen ? pct(mejorMargen.margenPct) : "—"}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Comparativa rápida si hay varios tamaños */}
        {recetas.length > 1 && (
          <div style={{ background: palette.bgCard, borderRadius: 16, border: `1px solid ${palette.border}`, padding: "16px 20px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: palette.textLight, letterSpacing: "0.7px", textTransform: "uppercase", marginBottom: 12 }}>Comparativa de tamaños</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[...recetas].sort((a, b) => (a.tamañoCm || 0) - (b.tamañoCm || 0)).map(r => {
                const margen = r.margenPct ? Number(r.margenPct) : null;
                return (
                  <div key={r.id} style={{ flex: "1 1 110px", background: palette.bg, borderRadius: 10, border: `1px solid ${palette.border}`, padding: "12px 14px", textAlign: "center" }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: palette.textDark }}>{r.descripcionTamaño || (r.tamañoCm ? `${r.tamañoCm}cm` : "—")}</div>
                    <div style={{ fontSize: 11, color: palette.textMid, margin: "4px 0" }}>Coste {fmt(r.costeTotal)}</div>
                    <div style={{ fontSize: 11, color: palette.primary, fontWeight: 600, marginBottom: 6 }}>PVP {fmt(r.precioVenta)}</div>
                    <div style={{ display: "inline-block", background: margenBg(margen), borderRadius: 20, padding: "3px 10px" }}>
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
            {recetas.map(r => <EscandalloCard key={r.id} receta={r} />)}
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