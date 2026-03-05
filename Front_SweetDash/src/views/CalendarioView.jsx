import { useState } from "react";
import palette from "../theme/palette";

// ── Mock data – reemplazar con fetch al backend ──────────────────────────────
//
// LÓGICA DE ESTADOS:
// - "pendiente"  → la fase aún no ha llegado su día (trabajo futuro)
// - "en_proceso" → la fase está en curso hoy
// - "Entrega"    → último día = entrega real al cliente
// - "Finalizado" → pedido completamente terminado
//
const pedidosConFases = [
  {
    // Pedido en curso: día 1 finalizado, día 2 en proceso hoy, día 3 = entrega
    id: "ORD-001",
    producto: "Tarta de chocolate",
    cliente: "ELSA",
    emoji: "🎂",
    totalFases: 3,
    fases: [
      { dia: 4,  numFase: 1, tareas: ["Preparar bizcocho", "Preparar almíbar"],       estado: "Finalizado" },
      { dia: 5,  numFase: 2, tareas: ["Montar capas", "Aplicar ganache"],             estado: "en_proceso" },
      { dia: 6,  numFase: 3, tareas: ["Decorar con fondant", "Poner velas"],          estado: "Entrega"    },
    ],
  },
  {
    // Pedido futuro: ninguna fase ha empezado, el último día es la entrega
    id: "ORD-002",
    producto: "Cupcakes vainilla x12",
    cliente: "Juan",
    emoji: "🧁",
    totalFases: 2,
    fases: [
      { dia: 10, numFase: 1, tareas: ["Preparar masa", "Hornear"],                    estado: "pendiente"  },
      { dia: 11, numFase: 2, tareas: ["Decorar frosting", "Empaquetar"],              estado: "Entrega"    },
    ],
  },
  {
    // Pedido totalmente finalizado
    id: "ORD-003",
    producto: "Macarons bautizo x30",
    cliente: "Ruiz",
    emoji: "🍬",
    totalFases: 3,
    fases: [
      { dia: 1,  numFase: 1, tareas: ["Preparar ganache de relleno"],                 estado: "Finalizado" },
      { dia: 2,  numFase: 2, tareas: ["Hornear conchas", "Rellenar"],                 estado: "Finalizado" },
      { dia: 3,  numFase: 3, tareas: ["Control calidad", "Empaquetar en caja"],       estado: "Finalizado" },
    ],
  },
  {
    // Pedido nuevo sin empezar, entrega al final
    id: "ORD-004",
    producto: "Galletas decoradas x50",
    cliente: "TechCorp",
    emoji: "🍪",
    totalFases: 3,
    fases: [
      { dia: 18, numFase: 1, tareas: ["Preparar masa sablé", "Cortar figuras"],       estado: "pendiente"  },
      { dia: 19, numFase: 2, tareas: ["Hornear", "Dejar enfriar"],                    estado: "pendiente"  },
      { dia: 20, numFase: 3, tareas: ["Decorar con glasa", "Empaquetar en cajas"],    estado: "Entrega"    },
    ],
  },
];

// Eventos sueltos (entregas, consultas sin subdivisión de proceso)
const eventosSueltos = [
  { id: "E-01", dia: 7,  hora: "11:00", titulo: "Entrega: Tarta chocolate - ELSA",    tipo: "entrega"  },
  { id: "E-02", dia: 9,  hora: "17:00", titulo: "Entrega: Cupcakes - Juan",            tipo: "entrega"  },
  { id: "E-03", dia: 5,  hora: "16:30", titulo: "Consulta: Diseño personalizado",      tipo: "consulta" },
  { id: "E-04", dia: 20, hora: "10:00", titulo: "Entrega: Macarons bautizo - Ruiz",    tipo: "entrega"  },
];

// ── Estilos por estado ───────────────────────────────────────────────────────
const estadoStyle = {
  pendiente:   { label: "Pendiente",  emoji: "⏳", color: "#F97316", bg: "#FFF7ED", dot: "#F97316" },
  en_proceso:  { label: "En proceso", emoji: "🔥", color: "#6366F1", bg: "#EEF2FF", dot: "#6366F1" },
  Entrega:     { label: "Entrega",    emoji: "🚚", color: "#10B981", bg: "#ECFDF5", dot: "#10B981" },
  Finalizado:  { label: "Finalizado", emoji: "📦", color: "#6B7280", bg: "#F3F4F6", dot: "#9CA3AF" },
};

const tipoStyle = {
  entrega:  { color: "#10B981", bg: "#ECFDF5", label: "Entrega"  },
  consulta: { color: "#A855F7", bg: "#F5F3FF", label: "Consulta" },
};

// ── Helpers ──────────────────────────────────────────────────────────────────
const MESES    = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DIAS     = ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];
const DIASLONG = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];

function getCells(year, month) {
  const firstDay  = new Date(year, month, 1).getDay();
  const totalDias = new Date(year, month + 1, 0).getDate();
  const offset    = (firstDay + 6) % 7;
  const cells     = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= totalDias; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

// Construye mapa dia → { fases: [...], eventos: [...] }
function buildDayMap() {
  const map = {};
  pedidosConFases.forEach(pedido => {
    pedido.fases.forEach(fase => {
      if (!map[fase.dia]) map[fase.dia] = { fases: [], eventos: [] };
      map[fase.dia].fases.push({ ...fase, pedido });
    });
  });
  eventosSueltos.forEach(ev => {
    if (!map[ev.dia]) map[ev.dia] = { fases: [], eventos: [] };
    map[ev.dia].eventos.push(ev);
  });
  return map;
}

// ── Tarjeta de fase de proceso ───────────────────────────────────────────────
function FaseCard({ item }) {
  // item = { ...fase, pedido } — todos los campos de fase están aplanados
  const { pedido, estado, numFase, tareas } = item;
  const es = estadoStyle[estado] || estadoStyle.pendiente;

  return (
    <div style={{
      borderRadius: 14, padding: "14px 16px",
      background: es.bg,
      border: `1px solid ${es.color}30`,
      borderLeft: `4px solid ${es.color}`,
    }}>
      {/* Cabecera: emoji + "Día N de M" */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 18 }}>{pedido.emoji}</span>
        <span style={{ fontSize: 14, fontWeight: 900, color: es.color }}>
          Día {numFase} de {pedido.totalFases}
        </span>
      </div>

      {/* Lista de tareas del día */}
      <div style={{ marginBottom: 10 }}>
        {tareas.map((t, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 4 }}>
            <span style={{ color: es.color, fontSize: 12, marginTop: 1 }}>•</span>
            <span style={{ fontSize: 13, color: "#374151" }}>{t}</span>
          </div>
        ))}
      </div>

      {/* Para + Cliente */}
      <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 10 }}>
        Para: <b style={{ color: "#1A0D2E" }}>{pedido.producto}</b>
        <br />
        Cliente: <b style={{ color: "#1A0D2E" }}>{pedido.cliente}</b>
      </div>

      {/* Estado badge */}
      <div style={{ display: "inline-flex", alignItems: "center", gap: 5,
        background: "rgba(255,255,255,0.7)", borderRadius: 20, padding: "4px 12px",
        border: `1px solid ${es.color}40`,
      }}>
        <span style={{ fontSize: 13 }}>{es.emoji}</span>
        <span style={{ fontSize: 11, fontWeight: 800, color: es.color, letterSpacing: "0.3px" }}>
          {es.label}
        </span>
      </div>
    </div>
  );
}

// ── Componente principal ─────────────────────────────────────────────────────
export default function CalendarioView() {
  const now  = new Date();
  const [year,  setYear]  = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDia, setSelectedDia] = useState(now.getDate());

  const cells  = getCells(year, month);
  const dayMap = buildDayMap();

  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();
  const todayNum       = isCurrentMonth ? now.getDate() : -1;

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y-1); } else setMonth(m => m-1); setSelectedDia(null); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y+1); } else setMonth(m => m+1); setSelectedDia(null); };

  const diaData    = selectedDia ? (dayMap[selectedDia] || { fases: [], eventos: [] }) : { fases: [], eventos: [] };
  const totalItems = diaData.fases.length + diaData.eventos.length;

  const totalSemana   = Object.values(dayMap).reduce((acc, d) => acc + d.fases.length + d.eventos.length, 0);
  const totalEntregas = eventosSueltos.filter(e => e.tipo === "entrega").length;
  const totalConsultas= eventosSueltos.filter(e => e.tipo === "consulta").length;

  const todayLabel = `${DIASLONG[now.getDay()]}, ${now.getDate()} de ${MESES[now.getMonth()]} ${now.getFullYear()}`;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: "linear-gradient(135deg, #10B981, #059669)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📅</div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: palette.textPrimary, margin: 0, letterSpacing: "-0.5px" }}>Calendario</h1>
            <p style={{ color: palette.textMuted, margin: "2px 0 0", fontSize: 13 }}>Organiza tus entregas y eventos</p>
          </div>
        </div>
        <button style={{ background: "linear-gradient(135deg, #10B981, #059669)", color: "#fff", border: "none", borderRadius: 20, padding: "10px 22px", fontWeight: 800, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 4px 14px rgba(16,185,129,0.35)", fontFamily: "inherit" }}>
          + Nuevo Evento
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}>

        {/* Cuadrícula */}
        <div style={{ background: "#fff", borderRadius: 20, boxShadow: palette.cardShadow, border: `1px solid ${palette.cardBorder}`, overflow: "hidden" }}>

          {/* Nav mes */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px 12px" }}>
            <span style={{ fontSize: 17, fontWeight: 900, color: palette.textPrimary }}>{MESES[month]} {year}</span>
            <div style={{ display: "flex", gap: 6 }}>
              {[{ fn: prevMonth, icon: "‹" }, { fn: nextMonth, icon: "›" }].map(({ fn, icon }) => (
                <button key={icon} onClick={fn} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${palette.cardBorder}`, background: "#fff", cursor: "pointer", fontSize: 18, fontWeight: 700, color: palette.textSecondary, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>{icon}</button>
              ))}
            </div>
          </div>

          {/* Cabecera días */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", padding: "0 16px" }}>
            {DIAS.map(d => (
              <div key={d} style={{ padding: "8px 0", textAlign: "center", fontSize: 12, fontWeight: 700, color: "#9CA3AF" }}>{d}</div>
            ))}
          </div>

          {/* Celdas */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", padding: "0 16px 16px", gap: 4 }}>
            {cells.map((dia, idx) => {
              const dd       = dia ? (dayMap[dia] || { fases: [], eventos: [] }) : null;
              const hasItems = dd && (dd.fases.length + dd.eventos.length) > 0;
              const isToday  = dia === todayNum;
              const isSel    = dia === selectedDia;

              // Dot colors for this day
              const dots = [
                ...( dd?.fases.map(f => estadoStyle[f.estado]?.dot) || [] ),
                ...( dd?.eventos.map(e => tipoStyle[e.tipo]?.color) || [] ),
              ].slice(0, 3);

              return (
                <div
                  key={idx}
                  onClick={() => dia && setSelectedDia(dia === selectedDia ? null : dia)}
                  style={{
                    minHeight: 72, borderRadius: 12, padding: "8px 10px",
                    background: isToday ? "#10B981" : isSel ? "#FFF0F3" : hasItems ? "#FFF0F3" : "transparent",
                    cursor: dia ? "pointer" : "default",
                    transition: "background 0.12s", position: "relative",
                  }}
                  onMouseEnter={e => { if (dia && !isToday && !isSel) e.currentTarget.style.background = "#F9FAFB"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = isToday ? "#10B981" : isSel ? "#FFF0F3" : hasItems ? "#FFF0F3" : "transparent"; }}
                >
                  {dia && (
                    <>
                      <div style={{ fontSize: 14, fontWeight: isToday ? 900 : 600, color: isToday ? "#fff" : palette.textPrimary }}>{dia}</div>
                      {hasItems && (
                        <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 3 }}>
                          {dots.map((c, i) => (
                            <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: isToday ? "rgba(255,255,255,0.8)" : c }} />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Leyenda */}
          <div style={{ padding: "14px 24px 18px", borderTop: `1px solid ${palette.cardBorder}` }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: palette.textMuted, letterSpacing: "0.5px", marginBottom: 10 }}>LEYENDA</div>
            <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
              {Object.entries(estadoStyle).map(([key, val]) => (
                <div key={key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 9, height: 9, borderRadius: "50%", background: val.dot }} />
                  <span style={{ fontSize: 12, color: palette.textSecondary, fontWeight: 600 }}>{val.label}</span>
                </div>
              ))}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#10B981" }} />
                <span style={{ fontSize: 12, color: palette.textSecondary, fontWeight: 600 }}>Entrega</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#A855F7" }} />
                <span style={{ fontSize: 12, color: palette.textSecondary, fontWeight: 600 }}>Consulta</span>
              </div>
            </div>
          </div>
        </div>

        {/* Panel lateral */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Eventos del día */}
          <div style={{ background: "#fff", borderRadius: 20, boxShadow: palette.cardShadow, border: `1px solid ${palette.cardBorder}`, padding: "22px 20px" }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: palette.textPrimary }}>
                {selectedDia ? `Eventos del día ${selectedDia}` : "Eventos de hoy"}
              </div>
              <div style={{ fontSize: 12, color: palette.textMuted, marginTop: 3 }}>{todayLabel}</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {totalItems === 0 ? (
                <div style={{ textAlign: "center", padding: "20px 0", color: palette.textMuted, fontSize: 13 }}>
                  Sin eventos este día
                </div>
              ) : (
                <>
                  {/* Fases de proceso */}
                  {diaData.fases.map((item, i) => (
                    <FaseCard key={i} item={item} />
                  ))}

                  {/* Eventos sueltos (entregas / consultas) */}
                  {diaData.eventos.map(ev => {
                    const ts = tipoStyle[ev.tipo] || { color: "#6B7280", bg: "#F3F4F6", label: ev.tipo };
                    return (
                      <div key={ev.id} style={{
                        borderRadius: 12, padding: "12px 14px",
                        background: ts.bg, borderLeft: `4px solid ${ts.color}`,
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                      }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: palette.textPrimary, marginBottom: 2 }}>{ev.titulo}</div>
                          <div style={{ fontSize: 12, color: "#6B7280" }}>{ev.hora}</div>
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 800, color: ts.color, background: "rgba(255,255,255,0.7)", borderRadius: 20, padding: "3px 10px" }}>
                          {ts.label}
                        </span>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>

          {/* Resumen del mes */}
          <div style={{ background: "#fff", borderRadius: 20, boxShadow: palette.cardShadow, border: `1px solid ${palette.cardBorder}`, padding: "20px" }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: palette.textPrimary, marginBottom: 14 }}>Resumen del mes</div>
            {[
              { label: "Eventos esta semana", value: totalSemana,    color: palette.primary },
              { label: "Entregas pendientes", value: totalEntregas,  color: "#10B981"       },
              { label: "Consultas agendadas", value: totalConsultas, color: "#A855F7"       },
            ].map(row => (
              <div key={row.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${palette.cardBorder}` }}>
                <span style={{ fontSize: 13, color: "#6B7280", fontWeight: 600 }}>{row.label}</span>
                <span style={{ fontSize: 15, fontWeight: 900, color: row.color }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}