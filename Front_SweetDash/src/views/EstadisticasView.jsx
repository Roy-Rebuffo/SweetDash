import palette from "../theme/palette";

// ── Mock data ─────────────────────────────────────────────────────────────────
const kpis = [
  { label: "Ventas este mes",  value: "3.240€", trend: "+18% vs anterior", trendKey: "accent3" },
  { label: "Pedidos este mes", value: "48",     trend: "+12 vs anterior",  trendKey: "accent3" },
  { label: "Ticket promedio",  value: "67,5€",  trend: null                                     },
  { label: "Nuevos clientes",  value: "14",     trend: "este mes",         trendKey: "accent3" },
];

const ventasMes = [
  { mes: "Ene", val: 1800 }, { mes: "Feb", val: 2100 }, { mes: "Mar", val: 2400 },
  { mes: "Abr", val: 3240 }, { mes: "May", val: 2900 }, { mes: "Jun", val: 3100 },
];

const topProductos = [
  { label: "Tartas fondant", value: 18, max: 18, colorKey: "primary"    },
  { label: "Cupcakes",       value: 14, max: 18, colorKey: "accent1"    },
  { label: "Macarons",       value: 12, max: 18, colorKey: "accent2"    },
  { label: "Cheesecakes",    value:  9, max: 18, colorKey: "accent3"    },
  { label: "Brownies",       value:  7, max: 18, colorKey: "primaryMid" },
];

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, trend, trendKey }) {
  const trendColor = palette[trendKey] || palette.accent3;
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

// ── Mini bar ──────────────────────────────────────────────────────────────────
function MiniBar({ label, value, max, colorKey }) {
  const color = palette[colorKey] || palette.primary;
  const pct   = (value / max) * 100;
  return (
    <div style={{ marginBottom: 13 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 12.5, color: palette.textMid, fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 12.5, fontWeight: 700, color: palette.textDark }}>{value}</span>
      </div>
      <div style={{ height: 6, borderRadius: 99, background: palette.border, overflow: "hidden" }}>
        <div
          style={{
            height: "100%", width: `${pct}%`, borderRadius: 99,
            background: color, transition: "width 0.6s ease",
          }}
        />
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function EstadisticasView() {
  const maxVal = Math.max(...ventasMes.map((v) => v.val));

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", animation: "fadeUp 0.3s ease" }}>

      {/* KPI cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
        {kpis.map((k) => (
          <StatCard key={k.label} label={k.label} value={k.value} trend={k.trend} trendKey={k.trendKey} />
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20 }}>

        {/* Bar chart */}
        <div
          style={{
            background: palette.bgCard, borderRadius: 14,
            border: `1px solid ${palette.border}`,
            boxShadow: "0 1px 4px oklch(0% 0 0 / 0.04)",
            padding: 24,
          }}
        >
          <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 17, color: palette.textDark, marginBottom: 4 }}>
            Ventas mensuales
          </div>
          <div style={{ fontSize: 11.5, color: palette.textLight, marginBottom: 24 }}>Ingresos 2026 (€)</div>

          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 160 }}>
            {ventasMes.map((v, i) => {
              const h      = (v.val / maxVal) * 140;
              const isLast = i === ventasMes.length - 1;
              return (
                <div
                  key={v.mes}
                  style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}
                >
                  <div style={{ fontSize: 10, color: palette.textLight, fontWeight: 500 }}>
                    {v.val >= 1000 ? (v.val / 1000).toFixed(1) + "k" : v.val}
                  </div>
                  <div
                    style={{
                      width: "100%", height: h,
                      borderRadius: "5px 5px 3px 3px",
                      background: isLast ? palette.primary : palette.primaryLt,
                      border: isLast ? "none" : `1px solid ${palette.border}`,
                      transition: "height 0.5s ease",
                    }}
                  />
                  <div style={{ fontSize: 11, color: isLast ? palette.primary : palette.textLight, fontWeight: isLast ? 700 : 400 }}>
                    {v.mes}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top products */}
        <div
          style={{
            background: palette.bgCard, borderRadius: 14,
            border: `1px solid ${palette.border}`,
            boxShadow: "0 1px 4px oklch(0% 0 0 / 0.04)",
            padding: 24,
          }}
        >
          <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 17, color: palette.textDark, marginBottom: 4 }}>
            Productos top
          </div>
          <div style={{ fontSize: 11.5, color: palette.textLight, marginBottom: 20 }}>Por número de pedidos</div>
          {topProductos.map((p) => (
            <MiniBar key={p.label} label={p.label} value={p.value} max={p.max} colorKey={p.colorKey} />
          ))}
        </div>
      </div>
    </div>
  );
}
