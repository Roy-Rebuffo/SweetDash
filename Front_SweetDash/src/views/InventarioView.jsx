import { useState, useEffect } from "react";
import palette from "../theme/palette";
import { stockMaterialesApi, materiasPrimasApi } from "../services/api";

function getEstado(stock, max) {
  const pct = (stock / max) * 100;
  if (pct >= 50) return { label: "OK",      color: "#10B981", bg: "#ECFDF5", barColor: "#10B981" };
  if (pct >= 20) return { label: "BAJO",    color: "#F97316", bg: "#FFF7ED", barColor: "#F97316" };
  return             { label: "CRÍTICO", color: "#EF4444", bg: "#FEF2F2", barColor: "#EF4444" };
}

// Formatea fecha ISO → "30 dic 2026"
function formatFecha(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
}

// Días hasta caducidad
function diasHastaCaducidad(iso) {
  if (!iso) return null;
  const diff = new Date(iso) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// Emoji genérico por nombre (heurístico simple, sin imágenes)
function emojiParaNombre(nombre) {
  const n = nombre.toLowerCase();
  if (n.includes("harina"))      return "🌾";
  if (n.includes("azúcar") || n.includes("azucar")) return "🍬";
  if (n.includes("huevo"))       return "🥚";
  if (n.includes("chocolate"))   return "🍫";
  if (n.includes("mantequilla")) return "🧈";
  if (n.includes("vainilla"))    return "🌿";
  if (n.includes("almendra"))    return "🌰";
  if (n.includes("cacao"))       return "🍫";
  if (n.includes("nata"))        return "🥛";
  if (n.includes("queso"))       return "🧀";
  if (n.includes("fondant"))     return "🎂";
  if (n.includes("frambuesa"))   return "🍓";
  if (n.includes("limón") || n.includes("limon")) return "🍋";
  if (n.includes("pistacho"))    return "🌱";
  if (n.includes("caja"))        return "📦";
  if (n.includes("lazo"))        return "🎀";
  if (n.includes("cinta"))       return "🎗️";
  if (n.includes("bolsa"))       return "🛍️";
  if (n.includes("cápsula") || n.includes("capsula")) return "🧁";
  if (n.includes("manga"))       return "🍦";
  if (n.includes("papel"))       return "📄";
  if (n.includes("etiqueta"))    return "🏷️";
  if (n.includes("base") || n.includes("cartón")) return "🗂️";
  return "📦";
}

const ITEMS_PER_PAGE = 8;
const TABS = ["Todos", "Materias Primas", "Materiales"];

export default function InventarioView() {
  const [materias,    setMaterias]    = useState([]);
  const [materiales,  setMateriales]  = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [tab,         setTab]         = useState("Todos");
  const [searchTerm,  setSearchTerm]  = useState("");
  const [page,        setPage]        = useState(1);

  useEffect(() => {
    setLoading(true);
    Promise.all([materiasPrimasApi.getAll(), stockMaterialesApi.getAll()])
      .then(([mp, mat]) => {
        setMaterias(mp);
        setMateriales(mat);
        setError(null);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Unificamos los dos arrays en uno con campos comunes
  const itemsUnificados = [
    ...materias.map(m => ({
      id:        `mp-${m.idMateriaPrima}`,
      nombre:    m.nombre,
      categoria: "Materias Primas",
      stock:     m.cantidadStock,
      stockMax:  m.stockMaximo,
      unidad:    m.unidad,
      caducidad: m.fechaCaducidad,
      emoji:     emojiParaNombre(m.nombre),
    })),
    ...materiales.map(m => ({
      id:        `mat-${m.idStock}`,
      nombre:    m.nombre,
      categoria: "Materiales",
      stock:     m.cantidadStock,
      stockMax:  m.stockMaximo,
      unidad:    "ud",
      caducidad: null,
      emoji:     emojiParaNombre(m.nombre),
    })),
  ];

  const filtrados = itemsUnificados.filter(item => {
    const matchTab    = tab === "Todos" || item.categoria === tab;
    const matchSearch = item.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    return matchTab && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtrados.length / ITEMS_PER_PAGE));
  const paginados  = filtrados.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const handleSearch = (v) => { setSearchTerm(v); setPage(1); };
  const handleTab    = (t) => { setTab(t);        setPage(1); };

  // KPIs
  const totalItems  = itemsUnificados.length;
  const criticos    = itemsUnificados.filter(i => getEstado(i.stock, i.stockMax).label === "CRÍTICO").length;
  const proxCaducar = materias.filter(m => { const d = diasHastaCaducidad(m.fechaCaducidad); return d !== null && d <= 30; }).length;

  return (
    <div style={{ maxWidth: 1050, margin: "0 auto", position: "relative" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Loading */}
      {loading && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, gap: 12, color: palette.textMuted, fontSize: 15 }}>
          <div style={{ width: 20, height: 20, borderRadius: "50%", border: `3px solid ${palette.cardBorder}`, borderTop: `3px solid ${palette.primary}`, animation: "spin 0.8s linear infinite" }} />
          Cargando inventario...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 16, padding: "20px 24px", marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 20 }}>⚠️</span>
          <div>
            <div style={{ fontWeight: 800, color: "#991B1B", fontSize: 14 }}>No se pudo conectar con el servidor</div>
            <div style={{ color: "#B91C1C", fontSize: 13, marginTop: 2 }}>{error} — Comprueba que Spring Boot está en <b>localhost:8080</b>.</div>
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, gap: 16, flexWrap: "wrap" }}>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: palette.textPrimary, margin: 0, letterSpacing: "-0.5px" }}>
                Gestión de Inventario
              </h1>
              <p style={{ color: palette.textMuted, margin: "4px 0 0", fontSize: 14 }}>
                Controla el stock de ingredientes y materiales
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, background: palette.soft, border: `1px solid ${palette.cardBorder}`, borderRadius: 20, padding: "6px 14px" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981" }} />
                <span style={{ fontSize: 12, fontWeight: 800, color: palette.primary, letterSpacing: "0.4px" }}>
                  {totalItems} ARTÍCULOS EN TOTAL
                </span>
              </div>
              <div style={{ position: "relative" }}>
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF" strokeWidth={2}
                  style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                  <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                </svg>
                <input type="text" placeholder="Buscar producto..." value={searchTerm} onChange={e => handleSearch(e.target.value)}
                  style={{ paddingLeft: 36, paddingRight: 16, height: 38, borderRadius: 20, border: `1px solid ${palette.cardBorder}`, background: "#fff", fontSize: 13, color: palette.textPrimary, outline: "none", width: 200, fontFamily: "inherit" }} />
              </div>
            </div>
          </div>

          {/* KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 20 }}>
            {[
              { label: "Total artículos",    value: totalItems,    color: palette.textPrimary },
              { label: "Stock crítico",      value: criticos,      color: "#EF4444"           },
              { label: "Próx. a caducar (30d)", value: proxCaducar, color: "#F97316"          },
            ].map(k => (
              <div key={k.label} style={{ background: "#fff", borderRadius: 14, padding: "14px 20px", boxShadow: palette.cardShadow, border: `1px solid ${palette.cardBorder}` }}>
                <div style={{ fontSize: 12, color: palette.textMuted, fontWeight: 600, marginBottom: 6 }}>{k.label}</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: k.color }}>{k.value}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {TABS.map(t => (
              <button key={t} onClick={() => handleTab(t)} style={{ padding: "6px 18px", borderRadius: 20, fontSize: 12, fontWeight: 700, border: `1px solid ${tab === t ? palette.primary : palette.cardBorder}`, background: tab === t ? palette.primary : "#fff", color: tab === t ? "#fff" : palette.textSecondary, cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit" }}>
                {t}
              </button>
            ))}
          </div>

          {/* Tabla */}
          <div style={{ background: "#fff", borderRadius: 20, boxShadow: palette.cardShadow, border: `1px solid ${palette.cardBorder}`, overflow: "hidden" }}>
            {/* Cabecera */}
            <div style={{ display: "grid", gridTemplateColumns: "2.2fr 1.2fr 2.4fr 0.9fr 0.8fr", padding: "14px 24px", borderBottom: `1px solid ${palette.cardBorder}` }}>
              {[
                { label: "PRODUCTO",       align: "left"   },
                { label: "CATEGORÍA",      align: "left"   },
                { label: "NIVEL DE STOCK", align: "left"   },
                { label: "CADUCIDAD",      align: "left"   },
                { label: "ESTADO",         align: "center" },
              ].map(h => (
                <span key={h.label} style={{ fontSize: 11, fontWeight: 800, color: palette.textMuted, letterSpacing: "0.6px", textAlign: h.align }}>{h.label}</span>
              ))}
            </div>

            {/* Filas */}
            {paginados.length === 0 ? (
              <div style={{ padding: "40px 24px", textAlign: "center", color: palette.textMuted, fontSize: 14 }}>No se encontraron artículos</div>
            ) : (
              paginados.map((item, i) => {
                const pct    = Math.round((item.stock / item.stockMax) * 100);
                const estado = getEstado(item.stock, item.stockMax);
                const dias   = diasHastaCaducidad(item.caducidad);
                const fechaStr = formatFecha(item.caducidad);
                const caducWarning = dias !== null && dias <= 30;

                return (
                  <div key={item.id}
                    style={{ display: "grid", gridTemplateColumns: "2.2fr 1.2fr 2.4fr 0.9fr 0.8fr", padding: "18px 24px", alignItems: "center", borderTop: i > 0 ? `1px solid ${palette.cardBorder}` : "none", transition: "background 0.12s", background: estado.label === "CRÍTICO" ? `${estado.bg}60` : "transparent" }}
                    onMouseEnter={e => { if (estado.label !== "CRÍTICO") e.currentTarget.style.background = palette.background; }}
                    onMouseLeave={e => { e.currentTarget.style.background = estado.label === "CRÍTICO" ? `${estado.bg}60` : "transparent"; }}
                  >
                    {/* Producto */}
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 42, height: 42, borderRadius: 12, background: palette.soft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                        {item.emoji}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: "#1A0D2E" }}>{item.nombre}</div>
                        <div style={{ fontSize: 12, color: palette.textMuted, marginTop: 1 }}>{item.stock} {item.unidad} en stock</div>
                      </div>
                    </div>

                    {/* Categoría */}
                    <div style={{ fontSize: 12, fontWeight: 700, color: item.categoria === "Materias Primas" ? "#10B981" : "#6366F1", background: item.categoria === "Materias Primas" ? "#ECFDF5" : "#EEF2FF", padding: "3px 10px", borderRadius: 20, display: "inline-block", whiteSpace: "nowrap" }}>
                      {item.categoria === "Materias Primas" ? "M. Prima" : "Material"}
                    </div>

                    {/* Nivel de stock */}
                    <div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 800, color: estado.color }}>{pct}%</span>
                        <span style={{ fontSize: 12, color: palette.textMuted }}>{item.stock} {item.unidad}</span>
                      </div>
                      <div style={{ height: 7, borderRadius: 10, background: "#F3F4F6", overflow: "hidden", marginRight: 24 }}>
                        <div style={{ height: "100%", width: `${Math.min(pct, 100)}%`, borderRadius: 10, background: estado.barColor, transition: "width 0.4s ease" }} />
                      </div>
                    </div>

                    {/* Caducidad */}
                    <div>
                      {fechaStr ? (
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: caducWarning ? "#EF4444" : "#6B7280" }}>{fechaStr}</div>
                          {caducWarning && <div style={{ fontSize: 11, color: "#EF4444", marginTop: 1 }}>⚠️ {dias}d</div>}
                        </div>
                      ) : (
                        <span style={{ fontSize: 12, color: "#D1D5DB" }}>—</span>
                      )}
                    </div>

                    {/* Estado */}
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.5px", color: estado.color, background: estado.bg, padding: "4px 10px", borderRadius: 20 }}>
                        {estado.label}
                      </span>
                    </div>
                  </div>
                );
              })
            )}

            {/* Paginación */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", borderTop: `1px solid ${palette.cardBorder}` }}>
              <span style={{ fontSize: 13, color: palette.textMuted }}>Mostrando {paginados.length} de {filtrados.length} artículos</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${palette.cardBorder}`, background: page === 1 ? palette.background : "#fff", color: page === 1 ? palette.textMuted : palette.textPrimary, cursor: page === 1 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: palette.primary, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>{page}</div>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${palette.cardBorder}`, background: page === totalPages ? palette.background : "#fff", color: page === totalPages ? palette.textMuted : palette.textPrimary, cursor: page === totalPages ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          </div>

          {/* FAB */}
          <button title="Añadir artículo" style={{ position: "fixed", bottom: 36, right: 36, width: 52, height: 52, borderRadius: "50%", background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`, color: "#fff", border: "none", fontSize: 26, cursor: "pointer", boxShadow: "0 6px 20px rgba(82,37,102,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit", zIndex: 100 }}>
            +
          </button>
        </>
      )}
    </div>
  );
}