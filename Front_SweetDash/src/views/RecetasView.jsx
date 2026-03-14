import { useState, useEffect } from "react";
import palette from "../theme/palette";
import { productosApi, procesosApi, materiasPrimasApi, pedidosApi } from "../services/api";

// ── Emoji por tipo de producto ─────────────────────────────────────────────
function emojiPorTipo(tipo) {
  const t = (tipo || "").toLowerCase();
  if (t.includes("tarta"))   return "🎂";
  if (t.includes("cupcake")) return "🧁";
  if (t.includes("galleta")) return "🍪";
  if (t.includes("macaron")) return "🍬";
  if (t.includes("brownie")) return "🍫";
  if (t.includes("éclair") || t.includes("eclair")) return "🥐";
  if (t.includes("cakepop")) return "🍡";
  return "🍰";
}

// ── Placeholder SVG (lamparita) ───────────────────────────────────────────
function PlaceholderImg() {
  return (
    <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#F97316" strokeWidth={1.2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────
function RecetaCard({ producto, pasos, usada }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff", borderRadius: 18, overflow: "hidden",
        boxShadow: hovered ? "0 10px 32px rgba(82,37,102,0.14)" : "0 2px 12px rgba(82,37,102,0.07)",
        border: `1px solid ${hovered ? palette.accent : "#F0EBF4"}`,
        transition: "all 0.18s ease", cursor: "pointer",
        display: "flex", flexDirection: "column",
      }}
    >
      {/* Imagen / placeholder */}
      <div style={{
        height: 140,
        background: producto.imagenUrl
          ? `url(${producto.imagenUrl}) center/cover no-repeat`
          : "linear-gradient(135deg, #FFE0B2 0%, #FFCCBC 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative",
      }}>
        {!producto.imagenUrl && <PlaceholderImg />}
        {/* Badge tipo */}
        <div style={{
          position: "absolute", top: 10, right: 10,
          background: "rgba(255,255,255,0.9)", borderRadius: 20,
          padding: "3px 10px", fontSize: 11, fontWeight: 700, color: "#F97316",
        }}>
          {producto.tipo}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "16px 18px 18px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: "#1A0D2E", marginBottom: 4, lineHeight: 1.25 }}>
          {producto.nombre}
        </div>
        <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 12, lineHeight: 1.4 }}>
          {producto.descripcion}
        </div>

        {/* Datos */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
          {/* Tiempo: días de proceso */}
          <DataRow
            icon={<ClockIcon />}
            label="Tiempo elaboración:"
            value={pasos > 0 ? `${pasos} paso${pasos !== 1 ? "s" : ""}` : "—"}
          />
          {/* Raciones */}
          <DataRow
            icon={<PersonIcon />}
            label="Cantidad:"
            value={producto.cantidadPersonas || "—"}
          />
          {/* Precio base */}
          <DataRow
            icon={<EuroIcon />}
            label="Precio base:"
            value={`€ ${producto.precioBase}`}
          />
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
          <span style={{ fontSize: 12, color: "#9CA3AF" }}>
            {usada > 0 ? `Pedida ${usada} vez${usada !== 1 ? "es" : ""}` : "Sin pedidos aún"}
          </span>
          <button style={{
            background: "linear-gradient(135deg, #FF6B9D, #FF3366)",
            color: "#fff", border: "none", borderRadius: 20,
            padding: "7px 18px", fontSize: 13, fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit",
            boxShadow: "0 3px 10px rgba(255,51,102,0.3)", transition: "opacity 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            Ver receta
          </button>
        </div>
      </div>
    </div>
  );
}

function DataRow({ icon, label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ color: "#9CA3AF" }}>{icon}</span>
        <span style={{ fontSize: 13, color: "#6B7280" }}>{label}</span>
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color: "#1A0D2E" }}>{value}</span>
    </div>
  );
}

function ClockIcon() {
  return <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" d="M12 6v6l4 2"/></svg>;
}
function PersonIcon() {
  return <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5.356-3.356M9 20H4v-2a4 4 0 015.356-3.356M15 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>;
}
function EuroIcon() {
  return <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0M8 10.5h4m-4 3h4"/></svg>;
}

// ── Componente principal ──────────────────────────────────────────────────
export default function RecetasView() {
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
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Número de pasos por plantilla (idPlantilla = idProducto en tu modelo)
  function getPasos(idProducto) {
    return procesos.filter(p => p.idPlantilla === idProducto).length;
  }

  // Veces que un producto ha sido pedido con estado "Entregado"
  // Los detalles-pedidos relacionan idPedido ↔ nombreProducto
  // Usamos pedidos entregados — como no tenemos detalles aquí, contamos
  // pedidos entregados totales divididos por productos como estimación,
  // pero lo correcto será cruzar con detalles. Por ahora marcamos los
  // pedidos entregados cuyo nombreProducto incluya el nombre (si viene del detalle).
  // → Para precisión real añade detallesApi aquí (ver comentario abajo)
  const pedidosEntregados = pedidos.filter(p => p.estado === "Entregado").length;

  // Categorías dinámicas desde el campo "tipo"
  const categorias = ["Todas", ...Array.from(new Set(productos.map(p => p.tipo)))];

  // KPIs
  const masUsada = productos.length > 0 ? productos[0] : null; // sin datos de uso real aún
  const tiempoPromedio = productos.length > 0
    ? Math.round(productos.reduce((acc, p) => acc + getPasos(p.idProducto), 0) / productos.length)
    : 0;

  const filtrados = productos.filter(p => {
    const matchSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (p.tipo || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat    = catActiva === "Todas" || p.tipo === catActiva;
    return matchSearch && matchCat;
  });

  return (
    <div style={{ maxWidth: 1150, margin: "0 auto", position: "relative" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Loading */}
      {loading && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, gap: 12, color: palette.textMuted, fontSize: 15 }}>
          <div style={{ width: 20, height: 20, borderRadius: "50%", border: `3px solid ${palette.cardBorder}`, borderTop: `3px solid #FF3366`, animation: "spin 0.8s linear infinite" }} />
          Cargando recetas...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 16, padding: "20px 24px", marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 20 }}>⚠️</span>
          <div>
            <div style={{ fontWeight: 800, color: "#991B1B", fontSize: 14 }}>No se pudo conectar con el servidor</div>
            <div style={{ color: "#B91C1C", fontSize: 13, marginTop: 2 }}>{error}</div>
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, gap: 16, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, #FF6B9D, #FF3366)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>📖</div>
              <div>
                <h1 style={{ fontSize: 26, fontWeight: 900, color: palette.textPrimary, margin: 0, letterSpacing: "-0.5px" }}>Recetas</h1>
                <p style={{ color: palette.textMuted, margin: "2px 0 0", fontSize: 13 }}>Biblioteca de recetas profesionales</p>
              </div>
            </div>
            <button style={{ background: "linear-gradient(135deg, #FF6B9D, #FF3366)", color: "#fff", border: "none", borderRadius: 20, padding: "10px 22px", fontWeight: 800, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 4px 14px rgba(255,51,102,0.35)", fontFamily: "inherit" }}>
              + Nueva Receta
            </button>
          </div>

          {/* KPI cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
            {[
              { label: "Total Productos",     value: productos.length,          valueColor: palette.textPrimary },
              { label: "Tipos distintos",     value: categorias.length - 1,     valueColor: "#FF3366"           },
              { label: "Pedidos entregados",  value: pedidosEntregados,         valueColor: "#10B981"           },
              { label: "Pasos promedio",      value: `${tiempoPromedio} pasos`, valueColor: "#F97316"           },
            ].map(k => (
              <div key={k.label} style={{ background: "#fff", borderRadius: 16, padding: "18px 20px", boxShadow: palette.cardShadow, border: `1px solid ${palette.cardBorder}` }}>
                <div style={{ fontSize: 12, color: palette.textMuted, fontWeight: 600, marginBottom: 8 }}>{k.label}</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: k.valueColor, lineHeight: 1.1 }}>{k.value}</div>
              </div>
            ))}
          </div>

          {/* Filtros + buscador */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22, flexWrap: "wrap" }}>
            {categorias.map(cat => (
              <button key={cat} onClick={() => setCatActiva(cat)} style={{ padding: "7px 18px", borderRadius: 20, fontSize: 13, fontWeight: 700, border: `1px solid ${catActiva === cat ? "#FF3366" : palette.cardBorder}`, background: catActiva === cat ? "linear-gradient(135deg, #FF6B9D, #FF3366)" : "#fff", color: catActiva === cat ? "#fff" : palette.textSecondary, cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit" }}>
                {cat}
              </button>
            ))}
            <div style={{ position: "relative", marginLeft: "auto" }}>
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF" strokeWidth={2}
                style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                <circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="M21 21l-4.35-4.35"/>
              </svg>
              <input type="text" placeholder="Buscar receta..." value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setCatActiva("Todas"); }}
                style={{ paddingLeft: 36, paddingRight: 16, height: 38, borderRadius: 20, border: `1px solid ${palette.cardBorder}`, background: "#fff", fontSize: 13, color: palette.textPrimary, outline: "none", width: 200, fontFamily: "inherit" }}
              />
            </div>
          </div>

          {/* Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {filtrados.map(p => (
              <RecetaCard
                key={p.idProducto}
                producto={p}
                pasos={getPasos(p.idProducto)}
                usada={0} // TODO: cruzar con detalles-pedidos cuando tengas el endpoint listo
              />
            ))}
            {filtrados.length === 0 && (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 0", color: palette.textMuted, fontSize: 14 }}>
                No se encontraron recetas
              </div>
            )}
          </div>

          {/* FAB */}
          <button title="Nueva receta" style={{ position: "fixed", bottom: 36, right: 36, width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg, #FF6B9D, #FF3366)", color: "#fff", border: "none", fontSize: 26, cursor: "pointer", boxShadow: "0 6px 20px rgba(255,51,102,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit", zIndex: 100 }}>
            +
          </button>
        </>
      )}
    </div>
  );
}