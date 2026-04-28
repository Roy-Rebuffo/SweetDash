import { useState, useEffect } from "react";
import palette from "../theme/palette";
import { productosApi, procesosApi, pedidosApi } from "../services/api";
import FilterSelect from "../components/FilterSelect";

// ── Colores por índice para el placeholder de foto ────────────────────────────
const STRIPE_COLORS = [
  [palette.primaryLt,  palette.primary  + "22"],
  [palette.accent1Lt,  palette.accent1  + "22"],
  [palette.accent2Lt,  palette.accent2  + "22"],
  [palette.accent3Lt,  palette.accent3  + "22"],
];

// ── Dificultad por pasos ──────────────────────────────────────────────────────
function getDificultad(pasos) {
  if (pasos === 0) return { label: "—",    bg: palette.border,    color: palette.textLight };
  if (pasos <= 2)  return { label: "Baja", bg: palette.accent3Lt, color: palette.accent3   };
  if (pasos <= 4)  return { label: "Media",bg: palette.accent2Lt, color: palette.accent2   };
  return               { label: "Alta", bg: palette.primaryLt,  color: palette.primary   };
}

// ── Foto placeholder con patrón de rayas ─────────────────────────────────────
function PhotoPlaceholder({ idx, imagenUrl, tipo }) {
  const [sc1, sc2] = STRIPE_COLORS[idx % STRIPE_COLORS.length];
  const accentColors = [palette.primary, palette.accent1, palette.accent2, palette.accent3];
  const accentColor  = accentColors[idx % accentColors.length];

  if (imagenUrl) {
    return (
      <div
        style={{
          height: 130,
          background: `url(${imagenUrl}) center/cover no-repeat`,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute", top: 10, right: 10,
            background: "rgba(255,255,255,0.9)", borderRadius: 20,
            padding: "3px 10px", fontSize: 11, fontWeight: 700, color: palette.textMid,
          }}
        >
          {tipo}
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", height: 130, background: sc1, overflow: "hidden" }}>
      {/* Stripe pattern */}
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id={`stripe-${idx}`} patternUnits="userSpaceOnUse" width="16" height="16" patternTransform="rotate(45)">
            <rect width="16" height="16" fill={sc1} />
            <rect width="8" height="16" fill={sc2} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#stripe-${idx})`} />
      </svg>
      {/* Center icon */}
      <div
        style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 6,
        }}
      >
        <div
          style={{
            width: 40, height: 40, borderRadius: 12,
            background: "rgba(255,255,255,0.7)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke={accentColor} strokeWidth={1.6}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <span
          style={{
            fontSize: 9.5, color: palette.textMid,
            background: "rgba(255,255,255,0.6)",
            padding: "2px 7px", borderRadius: 4,
          }}
        >
          foto de receta
        </span>
      </div>
      {/* Tipo badge */}
      <div
        style={{
          position: "absolute", top: 10, right: 10,
          background: "rgba(255,255,255,0.85)", borderRadius: 20,
          padding: "3px 10px", fontSize: 11, fontWeight: 700, color: palette.textMid,
        }}
      >
        {tipo}
      </div>
    </div>
  );
}

// ── Recipe card ───────────────────────────────────────────────────────────────
function RecetaCard({ producto, pasos, usada, idx }) {
  const [hovered, setHovered] = useState(false);
  const dif = getDificultad(pasos);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: palette.bgCard,
        borderRadius: 14,
        border: `1px solid ${hovered ? palette.primaryMid + "55" : palette.border}`,
        boxShadow: hovered ? `0 4px 20px ${palette.primary}0F` : "0 1px 4px oklch(0% 0 0 / 0.04)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.18s ease",
        cursor: "pointer",
      }}
    >
      <PhotoPlaceholder idx={idx} imagenUrl={producto.imagenUrl} tipo={producto.tipo} />

      <div style={{ padding: "16px 18px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 600, fontSize: 14.5,
            color: palette.textDark, marginBottom: 3, lineHeight: 1.3,
          }}
        >
          {producto.nombre}
        </div>
        <div style={{ fontSize: 11.5, color: palette.textLight, marginBottom: 12 }}>
          {producto.descripcion}
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 14 }}>
          {/* Pasos */}
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: palette.textMid }}>
            <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke={palette.textLight} strokeWidth={1.8}>
              <circle cx="12" cy="12" r="10"/><path strokeLinecap="round" d="M12 6v6l4 2"/>
            </svg>
            {pasos > 0 ? `${pasos} paso${pasos !== 1 ? "s" : ""}` : "—"}
          </span>
          {/* Porciones */}
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: palette.textMid }}>
            <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke={palette.textLight} strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            {producto.cantidadPersonas || "—"}
          </span>
          {/* Precio */}
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: palette.textMid }}>
            <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke={palette.textLight} strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0M8 10.5h4m-4 3h4"/>
            </svg>
            € {producto.precioBase}
          </span>
          {/* Dificultad */}
          <span
            style={{
              marginLeft: "auto",
              display: "inline-flex", padding: "2.5px 9px", borderRadius: 20,
              background: dif.bg, color: dif.color,
              fontSize: 10.5, fontWeight: 600,
            }}
          >
            {dif.label}
          </span>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
          <span style={{ fontSize: 11, color: palette.textLight }}>
            {usada > 0 ? `Pedida ${usada} vez${usada !== 1 ? "es" : ""}` : "Sin pedidos aún"}
          </span>
          <button
            style={{
              background: "none", border: `1px solid ${palette.primary}`,
              borderRadius: 20, padding: "5px 14px",
              fontSize: 11.5, fontWeight: 600, color: palette.primary,
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = palette.primaryLt; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
          >
            Ver receta
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, valueColor }) {
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
      <div style={{ fontSize: 26, fontWeight: 700, color: valueColor || palette.textDark, letterSpacing: "-0.5px", lineHeight: 1 }}>
        {value}
      </div>
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

// ── Main component ────────────────────────────────────────────────────────────
export default function RecetasView({ isMobile = false }) {
  const [productos,  setProductos]  = useState([]);
  const [procesos,   setProcesos]   = useState([]);
  const [pedidos,    setPedidos]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [catActiva,  setCatActiva]  = useState("Todas");

  useEffect(() => {
    setLoading(true);
    Promise.all([productosApi.getAll(), procesosApi.getAll(), pedidosApi.getAll()])
      .then(([prods, procs, peds]) => {
        setProductos(prods);
        setProcesos(procs);
        setPedidos(peds);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function getPasos(idProducto) {
    return procesos.filter((p) => p.idPlantilla === idProducto).length;
  }

  const pedidosEntregados = pedidos.filter((p) => p.estado === "Entregado").length;
  const categorias = ["Todas", ...Array.from(new Set(productos.map((p) => p.tipo)))];
  const tiempoPromedio = productos.length > 0
    ? Math.round(productos.reduce((acc, p) => acc + getPasos(p.idProducto), 0) / productos.length)
    : 0;

  const filtrados = productos.filter((p) => {
    const matchSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (p.tipo || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat    = catActiva === "Todas" || p.tipo === catActiva;
    return matchSearch && matchCat;
  });

  return (
    <div style={{ maxWidth: 1150, margin: "0 auto", position: "relative" }}>

      {/* Loading */}
      {loading && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, gap: 12, color: palette.textLight, fontSize: 14 }}>
          <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${palette.border}`, borderTop: `2px solid ${palette.primary}`, animation: "spin 0.8s linear infinite" }} />
          Cargando recetas...
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
          {/* KPI cards */}
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${isMobile ? 2 : 4},1fr)`, gap: isMobile ? 10 : 14, marginBottom: isMobile ? 14 : 24 }}>
            <StatCard label="Total productos"    value={String(productos.length)} />
            <StatCard label="Tipos distintos"    value={String(categorias.length - 1)} valueColor={palette.accent1} />
            <StatCard label="Pedidos entregados" value={String(pedidosEntregados)}     valueColor={palette.accent3} />
            <StatCard label="Pasos promedio"     value={`${tiempoPromedio} pasos`}     valueColor={palette.accent2} />
          </div>

          {/* Filters + search */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
            {/* Dropdown filtro */}
            <FilterSelect
              value={catActiva}
              onChange={(v) => { setCatActiva(v); setSearchTerm(""); }}
              options={categorias}
              minWidth={130}
            />

            <div style={{ marginLeft: isMobile ? 0 : "auto", display: "flex", gap: 8, alignItems: "center", ...(isMobile ? { width: "100%" } : {}) }}>
              <div style={{ position: "relative", flex: isMobile ? 1 : undefined }}>
                <svg
                  width="13" height="13" fill="none" viewBox="0 0 24 24" stroke={palette.textLight} strokeWidth={2}
                  style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                >
                  <circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="M21 21l-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  placeholder="Buscar receta..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCatActiva("Todas"); }}
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
                Nueva receta
              </button>
            </div>
          </div>

          {/* Grid */}
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${isMobile ? 1 : 3},1fr)`, gap: 16 }}>
            {filtrados.map((p, i) => (
              <RecetaCard
                key={p.idProducto}
                producto={p}
                pasos={getPasos(p.idProducto)}
                usada={0}
                idx={i}
              />
            ))}
            {filtrados.length === 0 && (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 0", color: palette.textLight, fontSize: 13 }}>
                No se encontraron recetas
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
