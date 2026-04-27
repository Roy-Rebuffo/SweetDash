import { useState } from "react";
import palette from "../theme/palette";

// ── Module cards for quick access grid ───────────────────────────────────────
const MODULE_CARDS = [
  { id: "pedidos",      label: "Pedidos",      stat: "12",   desc: "hoy",           accentKey: "primary",    accentLtKey: "primaryLt",   iconPath: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { id: "clientes",     label: "Clientes",     stat: "128",  desc: "activos",        accentKey: "accent1",    accentLtKey: "accent1Lt",   iconPath: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  { id: "productos",    label: "Inventario",   stat: "54",   desc: "en catálogo",    accentKey: "accent2",    accentLtKey: "accent2Lt",   iconPath: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" },
  { id: "recetas",      label: "Recetas",      stat: "32",   desc: "guardadas",      accentKey: "accent3",    accentLtKey: "accent3Lt",   iconPath: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
  { id: "calendario",   label: "Calendario",   stat: "7",    desc: "esta semana",    accentKey: "primaryMid", accentLtKey: "primaryLt",   iconPath: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { id: "estadisticas", label: "Estadísticas", stat: "+18%", desc: "este mes",       accentKey: "accent1",    accentLtKey: "accent1Lt",   iconPath: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
];

// ── Quick stats ───────────────────────────────────────────────────────────────
const quickStats = [
  { label: "Pedidos hoy",     value: "12",    trend: "+3 vs ayer",       trendKey: "accent3" },
  { label: "Ingresos del mes", value: "3.240€",trend: "+18% vs anterior", trendKey: "accent3" },
  { label: "Pendientes",      value: "5",     trend: "2 urgentes",       trendKey: "accent2" },
  { label: "Nuevos clientes", value: "8",     trend: "esta semana",      trendKey: "accent3" },
];

// ── Recent orders (mock) ──────────────────────────────────────────────────────
const recentOrders = [
  { id: "#001", cliente: "María García",   producto: "Tarta Fondant",    estado: "Pendiente",  fecha: "Hoy 14:00"  },
  { id: "#002", cliente: "Carlos López",   producto: "Cupcakes x12",     estado: "En proceso", fecha: "Hoy 12:30"  },
  { id: "#003", cliente: "Ana Martínez",   producto: "Macarons x24",     estado: "Listo",      fecha: "Ayer 18:00" },
  { id: "#004", cliente: "Luis Fernández", producto: "Tarta Cumpleaños", estado: "Entregado",  fecha: "Ayer 11:00" },
];

// ── Status badge ──────────────────────────────────────────────────────────────
function getEstadoStyle(estado) {
  const map = {
    "Pendiente":  { bg: palette.accent2Lt, color: palette.accent2  },
    "En proceso": { bg: palette.accent1Lt, color: palette.accent1  },
    "Listo":      { bg: palette.accent3Lt, color: palette.accent3  },
    "Entregado":  { bg: "oklch(93% 0.01 40)", color: "oklch(48% 0.02 40)" },
  };
  return map[estado] || map["Pendiente"];
}

// ── Avatar ────────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [palette.primary, palette.accent1, palette.accent2, palette.accent3, palette.primaryMid];

function Avatar({ name, idx, size = 28 }) {
  const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%",
        background: `${color}1A`, border: `1.5px solid ${color}44`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color, fontWeight: 700, fontSize: size * 0.37, flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, trend, trendKey }) {
  const trendColor = palette[trendKey] || palette.accent3;
  return (
    <div
      style={{
        background: palette.bgCard,
        borderRadius: 14,
        border: `1px solid ${palette.border}`,
        boxShadow: "0 1px 4px oklch(0% 0 0 / 0.04)",
        padding: "20px 22px",
      }}
    >
      <div
        style={{
          fontSize: 10.5, fontWeight: 600, color: palette.textLight,
          letterSpacing: "0.7px", textTransform: "uppercase", marginBottom: 10,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 26, fontWeight: 700, color: palette.textDark,
          letterSpacing: "-0.5px", lineHeight: 1, marginBottom: 8,
        }}
      >
        {value}
      </div>
      {trend && (
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
export default function HomeView({ onNavigate }) {
  const [hov, setHov] = useState(null);

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", animation: "fadeUp 0.3s ease" }}>

      {/* Quick stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 28 }}>
        {quickStats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} trend={s.trend} trendKey={s.trendKey} />
        ))}
      </div>

      {/* Main split */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.08fr", gap: 20 }}>

        {/* Quick access grid */}
        <div
          style={{
            background: palette.bgCard,
            borderRadius: 14,
            border: `1px solid ${palette.border}`,
            boxShadow: "0 1px 4px oklch(0% 0 0 / 0.04)",
            padding: 24,
          }}
        >
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700, fontSize: 17, color: palette.textDark, marginBottom: 4,
            }}
          >
            Acceso rápido
          </div>
          <div style={{ fontSize: 11.5, color: palette.textLight, marginBottom: 20 }}>
            Navega entre módulos
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
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
                  style={{
                    border: `1px solid ${isHov ? col + "88" : palette.border}`,
                    borderRadius: 11,
                    padding: "14px 8px 12px",
                    background: isHov ? colLt : palette.bg,
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "border-color 0.18s ease, background 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease",
                    transform: isHov ? "translateY(-2px)" : "translateY(0)",
                    boxShadow: isHov ? `0 6px 18px ${col}18` : "none",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                    <div
                      style={{
                        width: 30, height: 30, borderRadius: 8,
                        background: isHov ? col : col.replace(")", " / 0)"),
                        color: isHov ? "#fff" : col,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "background 0.18s ease, color 0.18s ease",
                      }}
                    >
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={m.iconPath} />
                      </svg>
                    </div>
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: palette.textDark, lineHeight: 1 }}>
                    {m.stat}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: palette.textMid, marginTop: 2 }}>
                    {m.label}
                  </div>
                  <div style={{ fontSize: 10, color: palette.textLight, marginTop: 1 }}>
                    {m.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent orders */}
        <div
          style={{
            background: palette.bgCard,
            borderRadius: 14,
            border: `1px solid ${palette.border}`,
            boxShadow: "0 1px 4px oklch(0% 0 0 / 0.04)",
            padding: 24,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 17, color: palette.textDark }}>
                Pedidos recientes
              </div>
              <div style={{ fontSize: 11.5, color: palette.textLight, marginTop: 3 }}>
                Últimas solicitudes recibidas
              </div>
            </div>
            <button
              onClick={() => onNavigate("pedidos")}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 11.5, color: palette.primary, fontWeight: 600,
                display: "flex", alignItems: "center", gap: 2,
                fontFamily: "'DM Sans', sans-serif", flexShrink: 0,
              }}
            >
              Ver todos
              <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke={palette.primary} strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {recentOrders.map((order, i) => {
              const es = getEstadoStyle(order.estado);
              return (
                <div
                  key={order.id}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "11px 14px", borderRadius: 10,
                    background: palette.bg, border: `1px solid ${palette.border}`,
                    transition: "border-color 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${palette.primaryMid}66`)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = palette.border)}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar name={order.cliente} idx={i} size={28} />
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: palette.textDark, lineHeight: 1.2 }}>
                        {order.cliente}
                      </div>
                      <div style={{ fontSize: 11, color: palette.textLight, marginTop: 1 }}>
                        {order.producto}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span
                      style={{
                        display: "inline-flex", alignItems: "center",
                        padding: "3.5px 10px", borderRadius: 20,
                        background: es.bg, color: es.color,
                        fontSize: 11, fontWeight: 600,
                      }}
                    >
                      {order.estado}
                    </span>
                    <div style={{ fontSize: 10, color: palette.textLight, marginTop: 3 }}>
                      {order.fecha}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
