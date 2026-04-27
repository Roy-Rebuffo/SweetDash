import { useState, useEffect } from "react";
import palette from "../theme/palette";
import { pedidosApi, detallesApi } from "../services/api";

// ── Mapeo de estados → estilos visuales ──────────────────────────────────────
const estadoStyle = {
  "Pendiente":  { bg: palette.accent2Lt, color: palette.accent2  },
  "En proceso": { bg: palette.accent1Lt, color: palette.accent1  },
  "Preparado":  { bg: palette.primaryLt, color: palette.primary  },
  "Entregado":  { bg: "oklch(93% 0.01 40)", color: "oklch(48% 0.02 40)" },
};

const AVATAR_COLORS = [palette.primary, palette.accent1, palette.accent2, palette.accent3, palette.primaryMid];

function Avatar({ nombre, idx }) {
  const initials = nombre.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];
  return (
    <div
      style={{
        width: 28, height: 28, borderRadius: "50%",
        background: `${color}1A`, border: `1.5px solid ${color}44`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color, fontWeight: 700, fontSize: 10, flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

function getNombreCompleto(p) {
  const nombre    = (p.nombreCliente    || "").trim();
  const apellidos = (p.apellidosCliente || p.apellidos || "").trim();
  return apellidos ? `${nombre} ${apellidos}` : nombre;
}

function formatFecha(iso) {
  if (!iso) return "—";
  return iso.slice(0, 10);
}

function calcularTotal(idPedido, detalles) {
  const items = detalles.filter((d) => d.idPedido === idPedido);
  if (items.length === 0) return "—";
  const total = items.reduce((acc, d) => acc + d.cantidad * d.precioCongelado, 0);
  return `€ ${total.toFixed(2)}`;
}

function getProducto(idPedido, detalles) {
  const item = detalles.find((d) => d.idPedido === idPedido);
  if (!item) return "—";
  const extra = detalles.filter((d) => d.idPedido === idPedido).length - 1;
  return extra > 0 ? `${item.nombreProducto} +${extra}` : item.nombreProducto;
}

const ITEMS_PER_PAGE = 7;
const FILTROS = ["Todos", "Pendiente", "En proceso", "Preparado", "Entregado"];

// ── Shared small components ───────────────────────────────────────────────────
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

// ── Main component ────────────────────────────────────────────────────────────
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
    Promise.all([pedidosApi.getAll(), detallesApi.getAll()])
      .then(([pedidosData, detallesData]) => {
        setPedidos(pedidosData);
        setDetalles(detallesData);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtrados = pedidos.filter((p) => {
    const matchFiltro = filtro === "Todos" || p.estado === filtro;
    const nombreCompleto = getNombreCompleto(p);
    const matchSearch =
      nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(p.idPedido).includes(searchTerm) ||
      getProducto(p.idPedido, detalles).toLowerCase().includes(searchTerm.toLowerCase());
    return matchFiltro && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtrados.length / ITEMS_PER_PAGE));
  const paginados  = filtrados.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const handleFiltro = (f) => { setFiltro(f); setPage(1); };
  const handleSearch = (v) => { setSearchTerm(v); setPage(1); };

  const TODAY       = new Date().toISOString().slice(0, 10);
  const pedidosHoy  = pedidos.filter((p) => formatFecha(p.fechaEntrega) === TODAY).length;
  const pendientes  = pedidos.filter((p) => p.estado === "Pendiente").length;
  const enProceso   = pedidos.filter((p) => p.estado === "En proceso").length;
  const ingresosHoy = detalles
    .filter((d) => {
      const p = pedidos.find((p) => p.idPedido === d.idPedido);
      return p && formatFecha(p.fechaEntrega) === TODAY;
    })
    .reduce((acc, d) => acc + d.cantidad * d.precioCongelado, 0);

  return (
    <div style={{ maxWidth: 1150, margin: "0 auto", position: "relative" }}>

      {/* Loading */}
      {loading && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, gap: 12, color: palette.textLight, fontSize: 14 }}>
          <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${palette.border}`, borderTop: `2px solid ${palette.primary}`, animation: "spin 0.8s linear infinite" }} />
          Cargando pedidos...
        </div>
      )}

      {/* Error */}
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
          {/* KPI cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
            <StatCard label="Pedidos hoy"  value={String(pedidosHoy)} />
            <StatCard label="Pendientes"   value={String(pendientes)}  trend="esta semana" trendColor={palette.accent2} />
            <StatCard label="En proceso"   value={String(enProceso)} />
            <StatCard label="Ingresos hoy" value={ingresosHoy > 0 ? `€ ${ingresosHoy.toFixed(2)}` : "€ 0"} trend="+12% vs ayer" trendColor={palette.accent3} />
          </div>

          {/* Filters + search */}
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 16, flexWrap: "wrap" }}>
            {FILTROS.map((f) => (
              <PillBtn key={f} label={f} active={filtro === f} onClick={() => handleFiltro(f)} />
            ))}
            <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
              {/* Search */}
              <div style={{ position: "relative" }}>
                <svg
                  width="13" height="13" fill="none" viewBox="0 0 24 24" stroke={palette.textLight} strokeWidth={2}
                  style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                >
                  <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Buscar pedido..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  style={{
                    paddingLeft: 32, paddingRight: 14, height: 34, borderRadius: 20,
                    border: `1px solid ${palette.border}`, background: palette.bgCard,
                    fontSize: 12.5, color: palette.textDark, width: 196,
                  }}
                  onFocus={(e) => (e.target.style.borderColor = palette.primaryMid)}
                  onBlur={(e)  => (e.target.style.borderColor = palette.border)}
                />
              </div>
              {/* New button */}
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
                Nuevo pedido
              </button>
            </div>
          </div>

          {/* Table */}
          <div
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
                gridTemplateColumns: "0.7fr 2fr 2.2fr 1.3fr 1.6fr 0.8fr 1fr",
                padding: "11px 22px",
                background: palette.bg,
                borderBottom: `1px solid ${palette.border}`,
              }}
            >
              {["ID", "Cliente", "Producto", "Fecha entrega", "Estado", "Total", ""].map((h) => (
                <span
                  key={h}
                  style={{ fontSize: 10, fontWeight: 700, color: palette.textLight, letterSpacing: "0.8px", textTransform: "uppercase" }}
                >
                  {h}
                </span>
              ))}
            </div>

            {paginados.length === 0 ? (
              <div style={{ padding: "48px 24px", textAlign: "center", color: palette.textLight, fontSize: 13 }}>
                No se encontraron pedidos
              </div>
            ) : (
              paginados.map((p, i) => {
                const es             = estadoStyle[p.estado] || estadoStyle["Pendiente"];
                const producto        = getProducto(p.idPedido, detalles);
                const total           = calcularTotal(p.idPedido, detalles);
                const nombreCompleto  = getNombreCompleto(p);
                return (
                  <div
                    key={p.idPedido}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "0.7fr 2fr 2.2fr 1.3fr 1.6fr 0.8fr 1fr",
                      padding: "13px 22px", alignItems: "center",
                      borderTop: i > 0 ? `1px solid ${palette.border}` : "none",
                      transition: "background 0.12s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = palette.bg)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <span style={{ fontSize: 11, color: palette.textLight, fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>
                      #{String(p.idPedido).padStart(4, "0")}
                    </span>

                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <Avatar nombre={nombreCompleto} idx={i} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: palette.textDark }}>{nombreCompleto}</span>
                    </div>

                    <span style={{ fontSize: 12.5, color: palette.textMid, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 12 }}>
                      {producto}
                    </span>

                    <span style={{ fontSize: 12, color: palette.textMid }}>{formatFecha(p.fechaEntrega)}</span>

                    <div>
                      <span
                        style={{
                          display: "inline-flex", alignItems: "center",
                          padding: "3.5px 10px", borderRadius: 20,
                          background: es.bg, color: es.color,
                          fontSize: 11, fontWeight: 600,
                        }}
                      >
                        {p.estado}
                      </span>
                    </div>

                    <span style={{ fontSize: 13, fontWeight: 700, color: palette.textDark }}>{total}</span>

                    <button
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        color: palette.primary, fontSize: 11.5, fontWeight: 600,
                        padding: 0, fontFamily: "'DM Sans', sans-serif",
                        display: "flex", alignItems: "center", gap: 3, opacity: 0.8,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.8")}
                    >
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke={palette.primary} strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Ver
                    </button>
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
                {paginados.length} de {filtrados.length} pedidos
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
          </div>
        </>
      )}
    </div>
  );
}
