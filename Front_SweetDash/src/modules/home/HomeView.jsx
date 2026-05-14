import { useState } from "react";
import palette from "../../theme/palette";
import useHome from "./hooks/useHome";
import StatCard from "./components/StatCard";
import Avatar from "./components/Avatar";
import { MODULE_CARDS, formatFecha, getNombreCompleto, calcularTotal, getEstadoStyle } from "./homeUtils";

export default function HomeView({ onNavigate, isMobile = false }) {
  const [hov, setHov] = useState(null);
  const { loading, detallesMap, quickStats, pedidosRecientes } = useHome();

  const cardPad = isMobile ? "14px 12px" : "24px";

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", width: "100%", overflowX: "hidden", animation: "fadeUp 0.3s ease" }}>

      {/* Quick stats */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${isMobile ? 2 : 4},minmax(0,1fr))`, gap: isMobile ? 10 : 14, marginBottom: isMobile ? 16 : 28 }}>
        {quickStats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} trend={s.trend} trendKey={s.trendKey} loading={loading} isMobile={isMobile} />
        ))}
      </div>

      {/* Main split */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.08fr", gap: isMobile ? 14 : 20 }}>

        {/* Quick access grid */}
        <div style={{ background: palette.bgCard, borderRadius: 14, border: `1px solid ${palette.border}`, boxShadow: "0 1px 4px oklch(0% 0 0 / 0.04)", padding: cardPad, minWidth: 0 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: isMobile ? 15 : 17, color: palette.textDark, marginBottom: 4 }}>Acceso rápido</div>
          <div style={{ fontSize: 11.5, color: palette.textLight, marginBottom: isMobile ? 14 : 20 }}>Navega entre módulos</div>

          <div style={{ display: "grid", gridTemplateColumns: `repeat(${isMobile ? 2 : 3},minmax(0,1fr))`, gap: isMobile ? 8 : 10 }}>
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
                  style={{ border: `1px solid ${isHov ? col + "88" : palette.border}`, borderRadius: 11, padding: isMobile ? "10px 4px 9px" : "14px 8px 12px", background: isHov ? colLt : palette.bg, cursor: "pointer", textAlign: "center", transition: "border-color 0.18s ease, background 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease", transform: isHov ? "translateY(-2px)" : "translateY(0)", boxShadow: isHov ? `0 6px 18px ${col}18` : "none", fontFamily: "'DM Sans', sans-serif", minWidth: 0, width: "100%" }}>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: isMobile ? 6 : 8 }}>
                    <div style={{ width: isMobile ? 26 : 30, height: isMobile ? 26 : 30, borderRadius: 8, background: isHov ? col : "transparent", color: isHov ? "#fff" : col, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.18s ease, color 0.18s ease" }}>
                      <svg width={isMobile ? 12 : 14} height={isMobile ? 12 : 14} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={m.iconPath} />
                      </svg>
                    </div>
                  </div>
                  <div style={{ fontSize: isMobile ? 10 : 11, fontWeight: 700, color: palette.textDark, lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent orders */}
        <div style={{ background: palette.bgCard, borderRadius: 14, border: `1px solid ${palette.border}`, boxShadow: "0 1px 4px oklch(0% 0 0 / 0.04)", padding: cardPad, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: isMobile ? 14 : 20 }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: isMobile ? 15 : 17, color: palette.textDark }}>Pedidos recientes</div>
              <div style={{ fontSize: 11.5, color: palette.textLight, marginTop: 3 }}>Últimas solicitudes recibidas</div>
            </div>
            <button onClick={() => onNavigate("pedidos")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11.5, color: palette.primary, fontWeight: 600, display: "flex", alignItems: "center", gap: 2, fontFamily: "'DM Sans', sans-serif", flexShrink: 0, marginLeft: 8 }}>
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
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: isMobile ? "9px 10px" : "11px 14px", borderRadius: 10, background: palette.bg, border: `1px solid ${palette.border}`, transition: "border-color 0.15s", cursor: "pointer", minWidth: 0, gap: 8 }}
                    onClick={() => onNavigate("pedidos")}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${palette.primaryMid}66`)}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = palette.border)}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, flex: 1 }}>
                      <Avatar name={nombre || "?"} idx={i} size={isMobile ? 26 : 28} />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: isMobile ? 12 : 12.5, fontWeight: 600, color: palette.textDark, lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{nombre}</div>
                        <div style={{ fontSize: 11, color: palette.textLight, marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{prodLabel}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <span style={{ display: "inline-block", padding: isMobile ? "3px 7px" : "3.5px 10px", borderRadius: 20, background: es.bg, color: es.color, fontSize: isMobile ? 10 : 11, fontWeight: 600, whiteSpace: "nowrap" }}>{p.estado}</span>
                      <div style={{ fontSize: 10, color: palette.textLight, marginTop: 3, whiteSpace: "nowrap" }}>
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
