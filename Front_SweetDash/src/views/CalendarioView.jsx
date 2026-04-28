import { useState } from "react";
import palette from "../theme/palette";

// ── Mock data ─────────────────────────────────────────────────────────────────
const mockEventos = [
  { id: 1,  titulo: "Tarta Fondant — María G.",     hora: "09:00", tipo: "Entrega",    dia: 27 },
  { id: 2,  titulo: "Cupcakes x12 — Carlos L.",     hora: "11:30", tipo: "Entrega",    dia: 27 },
  { id: 3,  titulo: "Consulta diseño nupcial",       hora: "14:00", tipo: "Consulta",   dia: 27 },
  { id: 4,  titulo: "Macarons x24 — Ana M.",         hora: "10:00", tipo: "Entrega",    dia: 28 },
  { id: 5,  titulo: "Pedido Brownies x20",           hora: "16:00", tipo: "En proceso", dia: 28 },
  { id: 6,  titulo: "Tarta Nupcial — Sofía T.",      hora: "09:30", tipo: "Entrega",    dia: 29 },
  { id: 7,  titulo: "Revisión inventario",           hora: "12:00", tipo: "Finalizado", dia: 26 },
  { id: 8,  titulo: "Cheesecake — Pablo R.",         hora: "11:00", tipo: "Pendiente",  dia: 30 },
  { id: 9,  titulo: "Consulta tarta cumpleaños",     hora: "15:30", tipo: "Consulta",   dia: 30 },
  { id: 10, titulo: "Galletas decoradas — Carmen",   hora: "10:00", tipo: "Finalizado", dia: 24 },
];

// ── Estilos por tipo ──────────────────────────────────────────────────────────
function tipoStyle(tipo) {
  return ({
    "Pendiente":  { bg: palette.accent2Lt,          color: palette.accent2  },
    "En proceso": { bg: palette.accent1Lt,          color: palette.accent1  },
    "Entrega":    { bg: palette.accent3Lt,          color: palette.accent3  },
    "Finalizado": { bg: "oklch(93% 0.01 40)",       color: "oklch(46% 0.02 40)" },
    "Consulta":   { bg: palette.primaryLt,          color: palette.primary  },
  })[tipo] || { bg: palette.primaryLt, color: palette.primary };
}

const LEGEND_TIPOS = ["Pendiente", "En proceso", "Entrega", "Finalizado", "Consulta"];
const DIAS_HDR     = ["L", "M", "X", "J", "V", "S", "D"];
const MESES        = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

// ── Stat card ─────────────────────────────────────────────────────────────────
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
export default function CalendarioView({ isMobile = false }) {
  const [viewYear,  setViewYear]  = useState(2026);
  const [viewMonth, setViewMonth] = useState(3); // 0-indexed: April
  const [diaActivo, setDiaActivo] = useState(27);

  const daysInMonth  = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstWeekday = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7; // Mon=0

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11); }
    else setViewMonth((m) => m - 1);
    setDiaActivo(null);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0); }
    else setViewMonth((m) => m + 1);
    setDiaActivo(null);
  };

  const isCurrentMock = viewYear === 2026 && viewMonth === 3;
  const eventosDia    = diaActivo && isCurrentMock
    ? mockEventos.filter((e) => e.dia === diaActivo)
    : [];

  const hasEvent = (day) => isCurrentMock && mockEventos.some((e) => e.dia === day);

  const cells = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", animation: "fadeUp 0.3s ease" }}>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${isMobile ? 2 : 4},1fr)`, gap: isMobile ? 10 : 14, marginBottom: isMobile ? 12 : 16 }}>
        <StatCard label="Entregas hoy"   value="2" />
        <StatCard label="Esta semana"    value="7" trend="3 entregas" trendColor={palette.accent3} />
        <StatCard label="Pendientes"     value="1" />
        <StatCard label="Próximo evento" value="9:00" />
      </div>

      {/* Controls row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, marginBottom: 24, ...(isMobile ? { flexWrap: "wrap" } : {}) }}>
        <div style={{ position: "relative", flex: isMobile ? 1 : undefined }}>
          <svg
            width="13" height="13" fill="none" viewBox="0 0 24 24" stroke={palette.textLight} strokeWidth={2}
            style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
          >
            <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Buscar evento..."
            style={{
              paddingLeft: 32, paddingRight: 14, height: 34, borderRadius: 20,
              border: `1px solid ${palette.border}`, background: palette.bgCard,
              fontSize: 12.5, color: palette.textDark, width: isMobile ? "100%" : 196,
              outline: "none",
            }}
            onFocus={(e) => (e.target.style.borderColor = palette.primaryMid)}
            onBlur={(e)  => (e.target.style.borderColor = palette.border)}
          />
        </div>
        <button
          style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "8px 18px", borderRadius: 20, fontSize: 12.5, fontWeight: 600,
            border: "none", background: palette.primary, color: "#fff", cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: `0 2px 10px ${palette.primary}33`,
          }}
        >
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nuevo evento
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.55fr", gap: 20 }}>

        {/* Calendar */}
        <div
          style={{
            background: palette.bgCard, borderRadius: 14,
            border: `1px solid ${palette.border}`,
            boxShadow: "0 1px 4px oklch(0% 0 0 / 0.04)",
            padding: 22,
          }}
        >
          {/* Month nav */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <button
              onClick={prevMonth}
              style={{
                width: 28, height: 28, borderRadius: 7,
                border: `1px solid ${palette.border}`, background: palette.bg,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                color: palette.textMid, transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = palette.primaryLt; e.currentTarget.style.borderColor = palette.primary; e.currentTarget.style.color = palette.primary; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = palette.bg;        e.currentTarget.style.borderColor = palette.border;  e.currentTarget.style.color = palette.textMid; }}
            >
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16, color: palette.textDark }}>
                {MESES[viewMonth]}
              </div>
              <div style={{ fontSize: 10.5, color: palette.textLight, marginTop: 1 }}>{viewYear}</div>
            </div>
            <button
              onClick={nextMonth}
              style={{
                width: 28, height: 28, borderRadius: 7,
                border: `1px solid ${palette.border}`, background: palette.bg,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                color: palette.textMid, transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = palette.primaryLt; e.currentTarget.style.borderColor = palette.primary; e.currentTarget.style.color = palette.primary; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = palette.bg;        e.currentTarget.style.borderColor = palette.border;  e.currentTarget.style.color = palette.textMid; }}
            >
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Day headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 4 }}>
            {DIAS_HDR.map((d) => (
              <div
                key={d}
                style={{
                  textAlign: "center", fontSize: 10, fontWeight: 700,
                  color: palette.textLight, letterSpacing: "0.3px", padding: "0 0 6px",
                }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
            {cells.map((day, idx) => {
              if (!day) return <div key={`e-${idx}`} />;
              const isActive = day === diaActivo;
              const isToday  = viewYear === 2026 && viewMonth === 3 && day === 27;
              const hasEv    = hasEvent(day);
              return (
                <button
                  key={day}
                  onClick={() => setDiaActivo(day === diaActivo ? null : day)}
                  style={{
                    position: "relative",
                    width: "100%", aspectRatio: "1", borderRadius: 7, fontSize: 12,
                    border: isActive
                      ? `1.5px solid ${palette.primary}`
                      : isToday
                      ? `1px dashed ${palette.primaryMid}`
                      : "1px solid transparent",
                    background: isActive ? palette.primary : isToday ? palette.primaryLt : "transparent",
                    color: isActive ? "#fff" : isToday ? palette.primary : palette.textDark,
                    fontWeight: isActive || isToday ? 700 : 400,
                    cursor: "pointer", transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = palette.primaryLt; e.currentTarget.style.color = palette.primary; } }}
                  onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = isToday ? palette.primaryLt : "transparent"; e.currentTarget.style.color = isToday ? palette.primary : palette.textDark; } }}
                >
                  {day}
                  {hasEv && (
                    <span
                      style={{
                        position: "absolute", bottom: 3, left: "50%", transform: "translateX(-50%)",
                        width: 4, height: 4, borderRadius: "50%",
                        background: isActive ? "rgba(255,255,255,0.8)" : palette.primary,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ height: 1, background: palette.border, margin: "16px 0 14px" }} />
          <div style={{ fontSize: 10, color: palette.textLight, marginBottom: 10, fontWeight: 700, letterSpacing: "0.7px", textTransform: "uppercase" }}>
            Tipos de evento
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px 8px" }}>
            {LEGEND_TIPOS.map((tipo) => {
              const s = tipoStyle(tipo);
              return (
                <div key={tipo} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: palette.textMid }}>{tipo}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Events panel */}
        <div
          style={{
            background: palette.bgCard, borderRadius: 14,
            border: `1px solid ${palette.border}`,
            boxShadow: "0 1px 4px oklch(0% 0 0 / 0.04)",
            padding: 24,
          }}
        >
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 17, color: palette.textDark }}>
              {diaActivo
                ? `${diaActivo} de ${MESES[viewMonth].toLowerCase()}`
                : `${MESES[viewMonth]} ${viewYear}`}
            </div>
            <div style={{ fontSize: 11.5, color: palette.textLight, marginTop: 3 }}>
              {diaActivo
                ? `${eventosDia.length} evento${eventosDia.length !== 1 ? "s" : ""} programado${eventosDia.length !== 1 ? "s" : ""}`
                : "Selecciona un día para ver sus eventos"}
            </div>
          </div>

          {!diaActivo ? (
            <div style={{ textAlign: "center", padding: "48px 0", color: palette.textLight, fontSize: 13 }}>
              <div
                style={{
                  width: 44, height: 44, borderRadius: 12, background: palette.primaryLt,
                  display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px",
                }}
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke={palette.primary} strokeWidth={1.7}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              Haz clic en un día del calendario
            </div>
          ) : eventosDia.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0", color: palette.textLight, fontSize: 13 }}>
              Sin eventos este día
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {eventosDia.map((ev) => {
                const s = tipoStyle(ev.tipo);
                return (
                  <div
                    key={ev.id}
                    style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "14px 16px", borderRadius: 11,
                      background: palette.bg, border: `1px solid ${palette.border}`,
                      borderLeft: `3px solid ${s.color}`,
                    }}
                  >
                    <div style={{ flexShrink: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: palette.textDark }}>{ev.hora}</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: palette.textDark }}>{ev.titulo}</div>
                    </div>
                    <span
                      style={{
                        display: "inline-flex", padding: "3px 9px", borderRadius: 20,
                        background: s.bg, color: s.color,
                        fontSize: 10.5, fontWeight: 600,
                      }}
                    >
                      {ev.tipo}
                    </span>
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
