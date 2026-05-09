import { useState, useEffect } from "react";
import palette from "../theme/palette";
import { pedidosApi, clientesApi, productosApi } from "../services/api";

// ── Module cards for quick access grid ───────────────────────────────────────
const MODULE_CARDS = [
  { id: "pedidos",      label: "Pedidos",      accentKey: "primary",    accentLtKey: "primaryLt",   iconPath: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { id: "clientes",     label: "Clientes",     accentKey: "accent1",    accentLtKey: "accent1Lt",   iconPath: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  { id: "productos",    label: "Inventario",   accentKey: "accent2",    accentLtKey: "accent2Lt",   iconPath: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" },
  { id: "recetas",      label: "Recetas",      accentKey: "accent3",    accentLtKey: "accent3Lt",   iconPath: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
  { id: "calendario",   label: "Calendario",   accentKey: "primaryMid", accentLtKey: "primaryLt",   iconPath: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { id: "estadisticas", label: "Estadísticas", accentKey: "accent1",    accentLtKey: "accent1Lt",   iconPath: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { id: "costes",       label: "Costes",       accentKey: "accent3",    accentLtKey: "accent3Lt",   iconPath: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatFecha(iso) {
  if (!iso) return "—";
  return String(iso).slice(0, 10);
}

function getNombreCompleto(p) {
  const nombre = (p.nombreCliente || p.nombre || "").trim();
  const apellidos = (p.apellidosCliente || p.apellidos || "").trim();
  return apellidos ? `${nombre} ${apellidos}` : nombre;
}

function calcularTotal(detalles) {
  if (!detalles || detalles.length === 0) return null;
  return detalles.reduce((acc, d) => acc + d.cantidad * (d.precioCongelado || 0), 0);
}

function getEstadoStyle(estado) {
  const map = {
    "Pendiente":  { bg: palette.accent2Lt, color: palette.accent2 },
    "En proceso": { bg: palette.accent1Lt, color: palette.accent1 },
    "Preparado":  { bg: palette.primaryLt, color: palette.primary },
    "Entregado":  { bg: "oklch(93% 0.01 40)", color: "oklch(48% 0.02 40)" },
  };
  return map[estado] || map["Pendiente"];
}

const AVATAR_COLORS = [palette.primary, palette.accent1, palette.accent2, palette.accent3, palette.primaryMid];

function Avatar({ name, idx, size = 28 }) {
  const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: `${color}1A`, border: `1.5px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", color, fontWeight: 700, fontSize: size * 0.37, flexShrink: 0 }}>
      {initials}
    </div>
  );
}

function StatCard({ label, value, trend, trendKey, loading }) {
  const trendColor = palette[trendKey] || palette.accent3;
  return (
    <div style={{ background: palette.bgCard, borderRadius: 14, border: `1px solid ${palette.border}`, boxShadow: "0 1px 4px oklch(0% 0 0 / 0.04)", padding: "20px 22px" }}>
      <div style={{ fontSize: 10.5, fontWeight: 600, color: palette.textLight, letterSpacing: "0.7px", textTransform: "uppercase", marginBottom: 10 }}>{label}</div>
      {loading ? (
        <div style={{ height: 32, borderRadius: 6, background: palette.border, animation: "pulse 1.5s ease infinite" }} />
      ) : (
        <div style={{ fontSize: 26, fontWeight: 700, color: palette.textDark, letterSpacing: "-0.5px", lineHeight: 1, marginBottom: 8 }}>{value}</div>
      )}
      {trend && !loading && (
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: trendColor, fontWeight: 500 }}>
          <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke={trendColor} strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          {trend}
        </div>
      )}
    </div>
  );
}

// ── Main view ─────────────────────────────────────────────────────────────────
export default function HomeView({ onNavigate, isMobile = false }) {
  const [hov, setHov] = useState(null);
  const [loading, setLoading] = useState(true);

  // Stats
  const [pedidos, setPedidos] = useState([]);
  const [detallesMap, setDetallesMap] = useState({});
  const [totalClientes, setTotalClientes] = useState(0);
  const [totalProductos, setTotalProductos] = useState(0);

  useEffect(() => {
    const hoy = new Date().toISOString().slice(0, 10);
    Promise.all([
      pedidosApi.getAll(),
      clientesApi.getAll(),
      productosApi.getAll(),
    ]).then(async ([peds, clientes, productos]) => {
      setPedidos(peds);
      setTotalClientes(clientes.length);
      setTotalProductos(productos.length);

      // Cargar detalles de los últimos 5 pedidos no entregados + hoy
      const recientes = [...peds].sort((a, b) => b.idPedido - a.idPedido).slice(0, 8);
      const map = {};
      await Promise.all(recientes.map(async (p) => {
        try { map[p.idPedido] = await pedidosApi.getDetalles(p.idPedido); }
        catch { map[p.idPedido] = []; }
      }));
      setDetallesMap(map);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  // Calcular stats
  const hoy = new Date().toISOString().slice(0, 10);
  const pedidosHoy = pedidos.filter(p => formatFecha(p.fechaEntrega) === hoy).length;
  const pendientes = pedidos.filter(p => p.estado === "Pendiente" || p.estado === "En proceso").length;
  const ingresosEsteMes = (() => {
    const mesActual = new Date().toISOString().slice(0, 7);
    return pedidos
      .filter(p => formatFecha(p.fechaEntrega).startsWith(mesActual))
      .reduce((acc, p) => {
        const detalles = detallesMap[p.idPedido] || [];
        return acc + detalles.reduce((a, d) => a + d.cantidad * (d.precioCongelado || 0), 0);
      }, 0);
  })();

  const quickStats = [
    { label: "Pedidos hoy",      value: loading ? "—" : String(pedidosHoy),                      trend: "entregas programadas", trendKey: "accent3" },
    { label: "Ingresos del mes", value: loading ? "—" : `€ ${ingresosEsteMes.toFixed(0)}`,        trend: "este mes",             trendKey: "accent3" },
    { label: "Activos",          value: loading ? "—" : String(pendientes),                       trend: "pendientes o en curso", trendKey: "accent2" },
    { label: "Clientes",         value: loading ? "—" : String(totalClientes),                    trend: "en base de datos",     trendKey: "accent1" },
  ];

  // Pedidos recientes — los últimos 4 no entregados o los últimos 4 en general
  const pedidosRecientes = [...pedidos]
    .sort((a, b) => b.idPedido - a.idPedido)
    .slice(0, 4);

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", animation: "fadeUp 0.3s ease" }}>

      {/* Quick stats */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${isMobile ? 2 : 4},1fr)`, gap: isMobile ? 10 : 14, marginBottom: isMobile ? 16 : 28 }}>
        {quickStats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} trend={s.trend} trendKey={s.trendKey} loading={loading} />
        ))}
      </div>

      {/* Main split */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.08fr", gap: isMobile ? 14 : 20 }}>

        {/* Quick access grid */}
        <div style={{ background: palette.bgCard, borderRadius: 14, border: `1px solid ${palette.border}`, boxShadow: "0 1px 4px oklch(0% 0 0 / 0.04)", padding: 24 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 17, color: palette.textDark, marginBottom: 4 }}>Acceso rápido</div>
          <div style={{ fontSize: 11.5, color: palette.textLight, marginBottom: 20 }}>Navega entre módulos</div>

          <div style={{ display: "grid", gridTemplateColumns: `repeat(${isMobile ? 2 : 3},1fr)`, gap: 10 }}>
            {MODULE_CARDS.map((m) => {
              const isHov = hov === m.id;
              const col   = palette[m.accentKey]   || palette.primary;
              const colLt = palette[m.accentLtKey] || palette.primaryLt;
              return (
                <button
                  key={m.id}
                  onClick={() => { setHov(null); onNavigate(m.id); }}
                  onMouseEnter={() => setHov(m.id)}
                  onMouseLeave={() => setHov(null)}
                  style={{ border: `1px solid ${isHov ? col + "88" : palette.border}`, borderRadius: 11, padding: "14px 8px 12px", background: isHov ? colLt : palette.bg, cursor: "pointer", textAlign: "center", transition: "border-color 0.18s ease, background 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease", transform: isHov ? "translateY(-2px)" : "translateY(0)", boxShadow: isHov ? `0 6px 18px ${col}18` : "none", fontFamily: "'DM Sans', sans-serif" }}>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: isHov ? col : "transparent", color: isHov ? "#fff" : col, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.18s ease, color 0.18s ease" }}>
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={m.iconPath} />
                      </svg>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: palette.textDark, lineHeight: 1 }}>{m.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent orders */}
        <div style={{ background: palette.bgCard, borderRadius: 14, border: `1px solid ${palette.border}`, boxShadow: "0 1px 4px oklch(0% 0 0 / 0.04)", padding: 24, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 17, color: palette.textDark }}>Pedidos recientes</div>
              <div style={{ fontSize: 11.5, color: palette.textLight, marginTop: 3 }}>Últimas solicitudes recibidas</div>
            </div>
            <button onClick={() => onNavigate("pedidos")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11.5, color: palette.primary, fontWeight: 600, display: "flex", alignItems: "center", gap: 2, fontFamily: "'DM Sans', sans-serif", flexShrink: 0 }}>
              Ver todos
              <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke={palette.primary} strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{ height: 56, borderRadius: 10, background: palette.border, animation: "pulse 1.5s ease infinite" }} />
              ))}
            </div>
          ) : pedidosRecientes.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 0", color: palette.textLight, fontSize: 13 }}>Sin pedidos aún</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {pedidosRecientes.map((p, i) => {
                const es = getEstadoStyle(p.estado);
                const nombre = getNombreCompleto(p);
                const detalles = detallesMap[p.idPedido] || [];
                const total = calcularTotal(detalles);
                const prodLabel = detalles.length > 0 ? detalles[0].nombreProducto + (detalles.length > 1 ? ` +${detalles.length - 1}` : "") : "—";
                return (
                  <div key={p.idPedido}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", borderRadius: 10, background: palette.bg, border: `1px solid ${palette.border}`, transition: "border-color 0.15s", cursor: "pointer" }}
                    onClick={() => onNavigate("pedidos")}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${palette.primaryMid}66`)}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = palette.border)}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                      <Avatar name={nombre || "?"} idx={i} size={28} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 600, color: palette.textDark, lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{nombre}</div>
                        <div style={{ fontSize: 11, color: palette.textLight, marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{prodLabel}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 10 }}>
                      <span style={{ display: "inline-flex", alignItems: "center", padding: "3.5px 10px", borderRadius: 20, background: es.bg, color: es.color, fontSize: 11, fontWeight: 600 }}>{p.estado}</span>
                      <div style={{ fontSize: 10, color: palette.textLight, marginTop: 3 }}>
                        {total != null ? `€ ${total.toFixed(2)}` : formatFecha(p.fechaEntrega)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}