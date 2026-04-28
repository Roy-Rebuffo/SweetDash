import { useState, useEffect } from "react";
import palette from "../theme/palette";
import { stockMaterialesApi, materiasPrimasApi } from "../services/api";

function getEstado(stock, max) {
  const pct = (stock / max) * 100;
  if (pct >= 50) return { label: "OK",      color: palette.accent3,  bg: palette.accent3Lt,  barColor: palette.accent3  };
  if (pct >= 20) return { label: "BAJO",    color: palette.accent2,  bg: palette.accent2Lt,  barColor: palette.accent2  };
  return             { label: "CRÍTICO", color: palette.primary,  bg: palette.primaryLt,  barColor: palette.primary  };
}

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

function StatCard({ label, value, trend, trendColor }) {
  return (
    <div
      style={{
        background: palette.bgCard, borderRadius: 14,
        border: `1px solid ${palette.border}`,
        boxShadow: "0 1px 4px oklch(0% 0 0 / 0.04)",
        padding: "20px 22px",
      }}
    >
      <div style={{ fontSize: 10.5, fontWeight: 600, color: palette.textLight, letterSpacing: "0.7px", textTransform: "uppercase", marginBottom: 10 }}>
        {label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: palette.textDark, letterSpacing: "-0.5px", lineHeight: 1, marginBottom: 8 }}>
        {value}
      </div>
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

function PillBtn({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 15px", borderRadius: 20, fontSize: 12, fontWeight: 600,
        border: `1px solid ${active ? palette.primary : palette.border}`,
        background: active ? palette.primary : palette.bgCard,
        color: active ? "#fff" : palette.textMid,
        cursor: "pointer", transition: "all 0.15s",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {label}
    </button>
  );
}

const ITEMS_PER_PAGE = 8;
const TABS = ["Todos", "Materias Primas", "Materiales"];

export default function InventarioView({ isMobile = false }) {
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
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const itemsUnificados = [
    ...materias.map((m) => ({
      id:        `mp-${m.idMateriaPrima}`,
      nombre:    m.nombre,
      categoria: "Materias Primas",
      stock:     m.cantidadStock,
      stockMax:  m.stockMaximo,
      unidad:    m.unidad,
      caducidad: m.fechaCaducidad,
      emoji:     emojiParaNombre(m.nombre),
    })),
    ...materiales.map((m) => ({
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

  const filtrados = itemsUnificados.filter((item) => {
    const matchTab    = tab === "Todos" || item.categoria === tab;
    const matchSearch = item.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    return matchTab && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtrados.length / ITEMS_PER_PAGE));
  const paginados  = filtrados.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const handleSearch = (v) => { setSearchTerm(v); setPage(1); };
  const handleTab    = (t) => { setTab(t);        setPage(1); };

  const totalItems  = itemsUnificados.length;
  const criticos    = itemsUnificados.filter((i) => getEstado(i.stock, i.stockMax).label === "CRÍTICO").length;
  const proxCaducar = materias.filter((m) => { const d = diasHastaCaducidad(m.fechaCaducidad); return d !== null && d <= 30; }).length;

  return (
    <div style={{ maxWidth: 1050, margin: "0 auto", position: "relative" }}>

      {/* Loading */}
      {loading && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, gap: 12, color: palette.textLight, fontSize: 14 }}>
          <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${palette.border}`, borderTop: `2px solid ${palette.primary}`, animation: "spin 0.8s linear infinite" }} />
          Cargando inventario...
        </div>
      )}

      {/* Error */}
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
          {/* KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${isMobile ? 2 : 3},1fr)`, gap: isMobile ? 10 : 14, marginBottom: isMobile ? 14 : 24 }}>
            <StatCard label="Total artículos"       value={String(totalItems)} />
            <StatCard label="Stock crítico"          value={String(criticos)}    trend="Requieren reposición" trendColor={palette.primary} />
            <StatCard label="Próx. a caducar (30d)" value={String(proxCaducar)} trend="Revisar pronto"        trendColor={palette.accent2} />
          </div>

          {/* Tabs + search + button */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            {/* Dropdown filtro */}
            <div style={{ position: "relative" }}>
              <select
                value={tab}
                onChange={(e) => handleTab(e.target.value)}
                style={{
                  height: 34, paddingLeft: 14, paddingRight: 32, borderRadius: 20,
                  border: `1px solid ${palette.border}`, background: palette.bgCard,
                  fontSize: 12.5, color: palette.textDark, cursor: "pointer",
                  appearance: "none", WebkitAppearance: "none", outline: "none",
                  fontFamily: "'DM Sans', sans-serif",
                }}
                onFocus={(e) => (e.target.style.borderColor = palette.primaryMid)}
                onBlur={(e)  => (e.target.style.borderColor = palette.border)}
              >
                {TABS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke={palette.textLight} strokeWidth={2.5}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center", ...(isMobile ? { width: "100%" } : {}) }}>
              <div style={{ position: "relative", flex: isMobile ? 1 : undefined }}>
                <svg
                  width="13" height="13" fill="none" viewBox="0 0 24 24" stroke={palette.textLight} strokeWidth={2}
                  style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                >
                  <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Buscar producto..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  style={{
                    paddingLeft: 32, paddingRight: 14, height: 34, borderRadius: 20,
                    border: `1px solid ${palette.border}`, background: palette.bgCard,
                    fontSize: 12.5, color: palette.textDark, width: isMobile ? "100%" : 196,
                  }}
                  onFocus={(e) => (e.target.style.borderColor = palette.primaryMid)}
                  onBlur={(e)  => (e.target.style.borderColor = palette.border)}
                />
              </div>
              <button
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "7px 16px", borderRadius: 20, fontSize: 12.5, fontWeight: 600,
                  border: "none", background: palette.primary, color: "#fff", cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  boxShadow: `0 2px 10px ${palette.primary}33`,
                }}
              >
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Agregar
              </button>
            </div>
          </div>

          {/* Mobile: tarjetas apiladas */}
          {isMobile && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {paginados.length === 0 ? (
                <div style={{ padding: "48px 0", textAlign: "center", color: palette.textLight, fontSize: 13 }}>
                  No se encontraron artículos
                </div>
              ) : (
                paginados.map((item) => {
                  const pct    = Math.round((item.stock / item.stockMax) * 100);
                  const estado = getEstado(item.stock, item.stockMax);
                  const dias   = diasHastaCaducidad(item.caducidad);
                  const fechaStr = formatFecha(item.caducidad);
                  const caducWarning = dias !== null && dias <= 30;
                  return (
                    <div
                      key={item.id}
                      style={{
                        background: estado.label === "CRÍTICO" ? `${palette.primaryLt}88` : palette.bgCard,
                        borderRadius: 12, border: `1px solid ${palette.border}`,
                        padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: palette.primaryLt, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                            {item.emoji}
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: palette.textDark }}>{item.nombre}</div>
                            <div style={{ fontSize: 11, color: palette.textLight }}>{item.stock} {item.unidad} en stock</div>
                          </div>
                        </div>
                        <span style={{ display: "inline-flex", padding: "3.5px 10px", borderRadius: 20, background: estado.bg, color: estado.color, fontSize: 11, fontWeight: 700 }}>
                          {estado.label}
                        </span>
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
                      {fechaStr && (
                        <div style={{ fontSize: 11, color: caducWarning ? palette.primary : palette.textLight }}>
                          Caduca: {fechaStr}{caducWarning ? ` ⚠️ ${dias}d` : ""}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
              {/* Paginación mobile — única, sin duplicado */}
              {totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 4 }}>
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.bgCard, cursor: page === 1 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: page === 1 ? 0.35 : 1 }}>
                    <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button key={n} onClick={() => setPage(n)} style={{ width: 32, height: 32, borderRadius: 8, fontSize: 13, fontWeight: 600, border: `1px solid ${n === page ? palette.primary : palette.border}`, background: n === page ? palette.primary : palette.bgCard, color: n === page ? "#fff" : palette.textMid, cursor: "pointer" }}>{n}</button>
                  ))}
                  <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.bgCard, cursor: page === totalPages ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: page === totalPages ? 0.35 : 1 }}>
                    <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Desktop: tabla completa */}
          {!isMobile && <div
            style={{
              background: palette.bgCard, borderRadius: 14,
              border: `1px solid ${palette.border}`,
              boxShadow: "0 1px 4px oklch(0% 0 0 / 0.04)",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2.2fr 1.2fr 2.4fr 1fr 0.9fr",
                padding: "11px 22px",
                background: palette.bg,
                borderBottom: `1px solid ${palette.border}`,
              }}
            >
              {["Producto", "Categoría", "Nivel de stock", "Caducidad", "Estado"].map((h) => (
                <span
                  key={h}
                  style={{ fontSize: 10, fontWeight: 700, color: palette.textLight, letterSpacing: "0.8px", textTransform: "uppercase" }}
                >
                  {h}
                </span>
              ))}
            </div>

            {/* Rows */}
            {paginados.length === 0 ? (
              <div style={{ padding: "48px 24px", textAlign: "center", color: palette.textLight, fontSize: 13 }}>
                No se encontraron artículos
              </div>
            ) : (
              paginados.map((item, i) => {
                const pct      = Math.round((item.stock / item.stockMax) * 100);
                const estado   = getEstado(item.stock, item.stockMax);
                const dias     = diasHastaCaducidad(item.caducidad);
                const fechaStr = formatFecha(item.caducidad);
                const caducWarning = dias !== null && dias <= 30;

                return (
                  <div
                    key={item.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "2.2fr 1.2fr 2.4fr 1fr 0.9fr",
                      padding: "16px 22px", alignItems: "center",
                      borderTop: i > 0 ? `1px solid ${palette.border}` : "none",
                      transition: "background 0.12s",
                      background: estado.label === "CRÍTICO" ? `${palette.primaryLt}88` : "transparent",
                    }}
                    onMouseEnter={(e) => { if (estado.label !== "CRÍTICO") e.currentTarget.style.background = palette.bg; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = estado.label === "CRÍTICO" ? `${palette.primaryLt}88` : "transparent"; }}
                  >
                    {/* Producto */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div
                        style={{
                          width: 36, height: 36, borderRadius: 10,
                          background: palette.primaryLt,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 18, flexShrink: 0,
                        }}
                      >
                        {item.emoji}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: palette.textDark }}>{item.nombre}</div>
                        <div style={{ fontSize: 11, color: palette.textLight, marginTop: 1 }}>{item.stock} {item.unidad} en stock</div>
                      </div>
                    </div>

                    {/* Categoría */}
                    <span
                      style={{
                        display: "inline-flex", padding: "3px 9px", borderRadius: 20,
                        background: item.categoria === "Materias Primas" ? palette.accent3Lt : palette.accent1Lt,
                        color:      item.categoria === "Materias Primas" ? palette.accent3   : palette.accent1,
                        fontSize: 11, fontWeight: 600, width: "fit-content",
                      }}
                    >
                      {item.categoria === "Materias Primas" ? "M. Prima" : "Material"}
                    </span>

                    {/* Nivel de stock */}
                    <div style={{ paddingRight: 20 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: estado.color }}>{Math.min(pct, 100)}%</span>
                        <span style={{ fontSize: 11, color: palette.textLight }}>{item.stock} {item.unidad}</span>
                      </div>
                      <div style={{ height: 6, borderRadius: 99, background: palette.border, overflow: "hidden" }}>
                        <div
                          style={{
                            height: "100%",
                            width: `${Math.min(pct, 100)}%`,
                            borderRadius: 99,
                            background: estado.barColor,
                            transition: "width 0.4s ease",
                          }}
                        />
                      </div>
                    </div>

                    {/* Caducidad */}
                    <div>
                      {fechaStr ? (
                        <>
                          <div style={{ fontSize: 12, fontWeight: 600, color: caducWarning ? palette.primary : palette.textMid }}>
                            {fechaStr}
                          </div>
                          {caducWarning && (
                            <div style={{ fontSize: 11, color: palette.primary, marginTop: 1 }}>⚠️ {dias}d</div>
                          )}
                        </>
                      ) : (
                        <span style={{ fontSize: 12, color: palette.textLight }}>—</span>
                      )}
                    </div>

                    {/* Estado badge */}
                    <span
                      style={{
                        display: "inline-flex", padding: "3.5px 10px", borderRadius: 20,
                        background: estado.bg, color: estado.color,
                        fontSize: 11, fontWeight: 700, letterSpacing: "0.3px",
                      }}
                    >
                      {estado.label}
                    </span>
                  </div>
                );
              })
            )}

            {/* Pagination */}
            <div
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "12px 22px", borderTop: `1px solid ${palette.border}`,
                background: palette.bg,
              }}
            >
              <span style={{ fontSize: 12, color: palette.textLight }}>
                {paginados.length} de {filtrados.length} artículos
              </span>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{
                    width: 28, height: 28, borderRadius: 7,
                    border: `1px solid ${palette.border}`, background: palette.bgCard,
                    cursor: page === 1 ? "default" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: palette.textMid, opacity: page === 1 ? 0.35 : 1,
                  }}
                >
                  <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    style={{
                      width: 28, height: 28, borderRadius: 7, fontSize: 12, fontWeight: 600,
                      border: `1px solid ${n === page ? palette.primary : palette.border}`,
                      background: n === page ? palette.primary : palette.bgCard,
                      color: n === page ? "#fff" : palette.textMid, cursor: "pointer",
                    }}
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={{
                    width: 28, height: 28, borderRadius: 7,
                    border: `1px solid ${palette.border}`, background: palette.bgCard,
                    cursor: page === totalPages ? "default" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: palette.textMid, opacity: page === totalPages ? 0.35 : 1,
                  }}
                >
                  <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          </div>}
        </>
      )}
    </div>
  );
}
