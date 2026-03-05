import { useEffect, useRef } from "react";
import palette from "../theme/palette";

// ── Mock data – reemplazar con fetch al backend ────────────────────────────
const kpis = [
  {
    label: "Ingresos totales",
    value: "28.450€",
    trend: "+12%",
    icon: "€",
    gradient: "linear-gradient(135deg, #FF6B9D 0%, #FF3366 100%)",
  },
  {
    label: "Pedidos totales",
    value: "1.234",
    trend: "+8%",
    icon: "🛒",
    gradient: "linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)",
  },
  {
    label: "Clientes activos",
    value: "456",
    trend: "+15%",
    icon: "👥",
    gradient: "linear-gradient(135deg, #38BDF8 0%, #0EA5E9 100%)",
  },
  {
    label: "Pedidos completados",
    value: "87%",
    trend: "+5%",
    icon: "✅",
    gradient: "linear-gradient(135deg, #34D399 0%, #10B981 100%)",
  },
];

const meses  = ["Ene", "Feb", "Mar", "Abr", "May", "Jun"];
const ventas = [4100, 3750, 5050, 4600, 5200, 6100];
const maxVenta = Math.max(...ventas);

const donutData = [
  { label: "Cupcakes", pct: 35, color: "#FF6B9D" },
  { label: "Tartas",   pct: 30, color: "#A855F7" },
  { label: "Galletas", pct: 20, color: "#38BDF8" },
  { label: "Macarons", pct: 15, color: "#10B981" },
];

// ── Donut SVG puro ─────────────────────────────────────────────────────────
function DonutChart({ data, size = 180, stroke = 36 }) {
  const r   = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
      {data.map((seg, i) => {
        const dash = (seg.pct / 100) * circ;
        const gap  = circ - dash;
        const el   = (
          <circle
            key={i}
            cx={size / 2} cy={size / 2} r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={stroke}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset}
            strokeLinecap="butt"
          />
        );
        offset += dash;
        return el;
      })}
    </svg>
  );
}

// ── Componente principal ───────────────────────────────────────────────────
export default function EstadisticasView() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: "linear-gradient(135deg, #A855F7, #7C3AED)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
        }}>
          📊
        </div>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: palette.textPrimary, margin: 0, letterSpacing: "-0.5px" }}>
            Estadísticas
          </h1>
          <p style={{ color: palette.textMuted, margin: "2px 0 0", fontSize: 14 }}>
            Análisis y métricas del negocio
          </p>
        </div>
      </div>

      {/* KPI cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18, marginBottom: 24 }}>
        {kpis.map((k) => (
          <div key={k.label} style={{
            borderRadius: 18, padding: "20px 22px 22px",
            background: k.gradient,
            boxShadow: "0 6px 24px rgba(0,0,0,0.12)",
            position: "relative", overflow: "hidden",
          }}>
            {/* Círculo decorativo fondo */}
            <div style={{
              position: "absolute", top: -20, right: -20,
              width: 90, height: 90, borderRadius: "50%",
              background: "rgba(255,255,255,0.12)",
            }} />
            {/* Trend badge */}
            <div style={{
              position: "absolute", top: 16, right: 16,
              background: "rgba(255,255,255,0.25)",
              borderRadius: 20, padding: "3px 10px",
              fontSize: 11, fontWeight: 800, color: "#fff",
            }}>
              {k.trend}
            </div>
            {/* Icono */}
            <div style={{ fontSize: 22, marginBottom: 10, opacity: 0.95 }}>{k.icon}</div>
            {/* Label */}
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: 600, marginBottom: 6 }}>
              {k.label}
            </div>
            {/* Valor */}
            <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", letterSpacing: "-0.5px", lineHeight: 1 }}>
              {k.value}
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20 }}>

        {/* Bar chart – Ventas mensuales */}
        <div style={{
          background: "#fff", borderRadius: 20, padding: "24px 28px 20px",
          boxShadow: palette.cardShadow, border: `1px solid ${palette.cardBorder}`,
        }}>
          <h3 style={{ margin: "0 0 24px", fontSize: 15, fontWeight: 800, color: palette.textPrimary }}>
            Ventas Mensuales (€)
          </h3>

          {/* Eje Y */}
          <div style={{ display: "flex", alignItems: "flex-end", height: 200, gap: 12 }}>

            {/* Etiquetas Y */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", paddingBottom: 24, alignItems: "flex-end" }}>
              {[8000, 6000, 4000, 2000, 0].map(v => (
                <span key={v} style={{ fontSize: 11, color: "#9CA3AF", lineHeight: 1 }}>{v}</span>
              ))}
            </div>

            {/* Barras */}
            <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 12, height: "100%" }}>
              {ventas.map((v, i) => (
                <div key={meses[i]} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end", gap: 6 }}>
                  <div style={{
                    width: "100%",
                    height: `${(v / 8000) * 160}px`,
                    borderRadius: "8px 8px 0 0",
                    background: "linear-gradient(180deg, #FF6B9D 0%, #A855F7 100%)",
                    transition: "opacity 0.2s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                  />
                  <span style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 600 }}>{meses[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Donut chart – Productos más vendidos */}
        <div style={{
          background: "#fff", borderRadius: 20, padding: "24px 24px 20px",
          boxShadow: palette.cardShadow, border: `1px solid ${palette.cardBorder}`,
          display: "flex", flexDirection: "column",
        }}>
          <h3 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 800, color: palette.textPrimary }}>
            Productos más vendidos
          </h3>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
            {/* Donut */}
            <div style={{ position: "relative" }}>
              <DonutChart data={donutData} size={160} stroke={32} />
              {/* Centro */}
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%,-50%)",
                textAlign: "center",
              }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: palette.textPrimary }}>100%</div>
                <div style={{ fontSize: 10, color: palette.textMuted, fontWeight: 600 }}>total</div>
              </div>
            </div>

            {/* Leyenda */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px", width: "100%" }}>
              {donutData.map(seg => (
                <div key={seg.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: seg.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: palette.textSecondary, fontWeight: 600 }}>
                    {seg.label}: <b style={{ color: seg.color }}>{seg.pct}%</b>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}