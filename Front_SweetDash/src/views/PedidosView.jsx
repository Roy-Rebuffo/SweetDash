import { useState, useEffect } from "react";
import palette from "../theme/palette";
import { pedidosApi, detallesApi } from "../services/api";

// ── Mapeo de estados del backend → estilos visuales ───────────────────────────
// Estados reales del back: 'Pendiente' | 'En proceso' | 'Preparado' | 'Entregado'
const estadoStyle = {
  "Pendiente":  { color: "#D97706", bg: "#FFFBEB", icon: "⏱" },
  "En proceso": { color: "#3B82F6", bg: "#EFF6FF", icon: "⚙️" },
  "Preparado":  { color: "#A855F7", bg: "#F5F3FF", icon: "✅" },
  "Entregado":  { color: "#10B981", bg: "#ECFDF5", icon: "📦" },
};

const avatarBgs = ["#FF6B9D", "#A855F7", "#3B82F6", "#10B981", "#F97316", "#6366F1", "#EC4899", "#14B8A6"];

function Avatar({ nombre, idx }) {
  const initials = nombre.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{ width: 34, height: 34, borderRadius: "50%", background: avatarBgs[idx % avatarBgs.length], display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 12, flexShrink: 0 }}>
      {initials}
    </div>
  );
}

// Formatea fecha ISO → "2026-03-14"
function formatFecha(iso) {
  if (!iso) return "—";
  return iso.slice(0, 10);
}

// Calcula total de un pedido sumando cantidad × precioCongelado de sus detalles
function calcularTotal(idPedido, detalles) {
  const items = detalles.filter(d => d.idPedido === idPedido);
  if (items.length === 0) return "—";
  const total = items.reduce((acc, d) => acc + d.cantidad * d.precioCongelado, 0);
  return `€ ${total.toFixed(2)}`;
}

// Obtiene el nombre del producto principal del pedido
function getProducto(idPedido, detalles) {
  const item = detalles.find(d => d.idPedido === idPedido);
  if (!item) return "—";
  const extra = detalles.filter(d => d.idPedido === idPedido).length - 1;
  return extra > 0 ? `${item.nombreProducto} +${extra}` : item.nombreProducto;
}

const ITEMS_PER_PAGE = 7;
const FILTROS = ["Todos", "Pendiente", "En proceso", "Preparado", "Entregado"];

export default function PedidosView() {
  const [pedidos,    setPedidos]    = useState([]);
  const [detalles,   setDetalles]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [filtro,     setFiltro]     = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [page,       setPage]       = useState(1);

  useEffect(() => {
    setLoading(true);
    // Llamadas en paralelo a los dos endpoints
    Promise.all([pedidosApi.getAll(), detallesApi.getAll()])
      .then(([pedidosData, detallesData]) => {
        setPedidos(pedidosData);
        setDetalles(detallesData);
        setError(null);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtrados = pedidos.filter(p => {
    const matchFiltro = filtro === "Todos" || p.estado === filtro;
    const matchSearch =
      p.nombreCliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(p.idPedido).includes(searchTerm) ||
      getProducto(p.idPedido, detalles).toLowerCase().includes(searchTerm.toLowerCase());
    return matchFiltro && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtrados.length / ITEMS_PER_PAGE));
  const paginados  = filtrados.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const handleFiltro = (f) => { setFiltro(f); setPage(1); };
  const handleSearch = (v) => { setSearchTerm(v); setPage(1); };

  // KPIs calculados de datos reales
  const TODAY       = new Date().toISOString().slice(0, 10);
  const pedidosHoy  = pedidos.filter(p => formatFecha(p.fechaEntrega) === TODAY).length;
  const pendientes  = pedidos.filter(p => p.estado === "Pendiente").length;
  const enProceso   = pedidos.filter(p => p.estado === "En proceso").length;
  const ingresosHoy = detalles
    .filter(d => {
      const p = pedidos.find(p => p.idPedido === d.idPedido);
      return p && formatFecha(p.fechaEntrega) === TODAY;
    })
    .reduce((acc, d) => acc + d.cantidad * d.precioCongelado, 0);

  return (
    <div style={{ maxWidth: 1150, margin: "0 auto", position: "relative" }}>

      {/* Loading */}
      {loading && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, gap: 12, color: palette.textMuted, fontSize: 15 }}>
          <div style={{ width: 20, height: 20, borderRadius: "50%", border: `3px solid ${palette.cardBorder}`, borderTop: `3px solid #FF3366`, animation: "spin 0.8s linear infinite" }} />
          Cargando pedidos...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 16, padding: "20px 24px", marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 20 }}>⚠️</span>
          <div>
            <div style={{ fontWeight: 800, color: "#991B1B", fontSize: 14 }}>No se pudo conectar con el servidor</div>
            <div style={{ color: "#B91C1C", fontSize: 13, marginTop: 2 }}>{error} — Comprueba que Spring Boot está corriendo en <b>localhost:8080</b>.</div>
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, #FF6B9D, #FF3366)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🛒</div>
              <div>
                <h1 style={{ fontSize: 26, fontWeight: 900, color: palette.textPrimary, margin: 0, letterSpacing: "-0.5px" }}>Pedidos</h1>
                <p style={{ color: palette.textMuted, margin: "2px 0 0", fontSize: 13 }}>Gestiona todos tus pedidos</p>
              </div>
            </div>
            <button style={{ background: "linear-gradient(135deg, #FF6B9D, #FF3366)", color: "#fff", border: "none", borderRadius: 20, padding: "10px 22px", fontWeight: 800, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 4px 14px rgba(255,51,102,0.35)", fontFamily: "inherit" }}>
              + Nuevo Pedido
            </button>
          </div>

          {/* KPI cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
            {[
              { label: "Pedidos hoy",  value: pedidosHoy,                              color: palette.textPrimary },
              { label: "Pendientes",   value: pendientes,                              color: "#D97706"           },
              { label: "En proceso",   value: enProceso,                               color: "#3B82F6"           },
              { label: "Ingresos hoy", value: ingresosHoy > 0 ? `€ ${ingresosHoy.toFixed(2)}` : "€ 0", color: "#10B981" },
            ].map(k => (
              <div key={k.label} style={{ background: "#fff", borderRadius: 16, padding: "18px 22px", boxShadow: palette.cardShadow, border: `1px solid ${palette.cardBorder}` }}>
                <div style={{ fontSize: 12, color: palette.textMuted, fontWeight: 600, marginBottom: 8 }}>{k.label}</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: k.color, lineHeight: 1.1 }}>{k.value}</div>
              </div>
            ))}
          </div>

          {/* Filtros + buscador */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            {FILTROS.map(f => (
              <button key={f} onClick={() => handleFiltro(f)} style={{ padding: "7px 20px", borderRadius: 20, fontSize: 13, fontWeight: 700, border: `1px solid ${filtro === f ? "#FF3366" : palette.cardBorder}`, background: filtro === f ? "linear-gradient(135deg, #FF6B9D, #FF3366)" : "#fff", color: filtro === f ? "#fff" : palette.textSecondary, cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit" }}>
                {f}
              </button>
            ))}
            <div style={{ position: "relative", marginLeft: "auto" }}>
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF" strokeWidth={2} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
              </svg>
              <input type="text" placeholder="Buscar pedido, cliente..." value={searchTerm} onChange={e => handleSearch(e.target.value)} style={{ paddingLeft: 36, paddingRight: 16, height: 38, borderRadius: 20, border: `1px solid ${palette.cardBorder}`, background: "#fff", fontSize: 13, color: palette.textPrimary, outline: "none", width: 210, fontFamily: "inherit" }} />
            </div>
          </div>

          {/* Tabla */}
          <div style={{ background: "#fff", borderRadius: 20, boxShadow: palette.cardShadow, border: `1px solid ${palette.cardBorder}`, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "0.7fr 2fr 2.2fr 1.3fr 1.6fr 0.8fr 1fr", padding: "13px 24px", borderBottom: `1px solid ${palette.cardBorder}`, background: "#FAFAFA" }}>
              {["ID", "Cliente", "Producto", "Fecha entrega", "Estado", "Total", "Acciones"].map(h => (
                <span key={h} style={{ fontSize: 11, fontWeight: 800, color: palette.textMuted, letterSpacing: "0.5px" }}>{h}</span>
              ))}
            </div>

            {paginados.length === 0 ? (
              <div style={{ padding: "48px 24px", textAlign: "center", color: palette.textMuted, fontSize: 14 }}>No se encontraron pedidos</div>
            ) : (
              paginados.map((p, i) => {
                const es      = estadoStyle[p.estado] || estadoStyle["Pendiente"];
                const producto = getProducto(p.idPedido, detalles);
                const total    = calcularTotal(p.idPedido, detalles);
                return (
                  <div key={p.idPedido}
                    style={{ display: "grid", gridTemplateColumns: "0.7fr 2fr 2.2fr 1.3fr 1.6fr 0.8fr 1fr", padding: "15px 24px", alignItems: "center", borderTop: i > 0 ? `1px solid ${palette.cardBorder}` : "none", transition: "background 0.12s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <span style={{ fontSize: 12, color: palette.textMuted, fontWeight: 600 }}>#{String(p.idPedido).padStart(4, "0")}</span>

                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Avatar nombre={p.nombreCliente} idx={i} />
                      <span style={{ fontSize: 14, fontWeight: 700, color: palette.textPrimary }}>{p.nombreCliente}</span>
                    </div>

                    <span style={{ fontSize: 13, color: "#6B7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 8 }}>{producto}</span>
                    <span style={{ fontSize: 13, color: "#6B7280" }}>{formatFecha(p.fechaEntrega)}</span>

                    <div>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 20, background: es.bg, color: es.color, fontSize: 12, fontWeight: 700, minWidth: 110, justifyContent: "center" }}>
                        <span>{es.icon}</span>{p.estado}
                      </span>
                    </div>

                    <span style={{ fontSize: 14, fontWeight: 800, color: palette.textPrimary }}>{total}</span>

                    <button style={{ background: "none", border: "none", cursor: "pointer", color: "#FF3366", fontSize: 13, fontWeight: 700, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 3, padding: 0 }}
                      onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
                      onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                    >
                      Ver detalles →
                    </button>
                  </div>
                );
              })
            )}

            {/* Paginación */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", borderTop: `1px solid ${palette.cardBorder}` }}>
              <span style={{ fontSize: 13, color: palette.textMuted }}>Mostrando {paginados.length} de {filtrados.length} pedidos</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${palette.cardBorder}`, background: page === 1 ? palette.background : "#fff", color: page === 1 ? palette.textMuted : palette.textPrimary, cursor: page === 1 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg, #FF6B9D, #FF3366)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>{page}</div>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${palette.cardBorder}`, background: page === totalPages ? palette.background : "#fff", color: page === totalPages ? palette.textMuted : palette.textPrimary, cursor: page === totalPages ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}