import { useState } from "react";
import palette from "../theme/palette";

// Módulos satélite alrededor del centro
const satelliteBubbles = [
  {
    id: "clientes",
    label: "Clientes",
    emoji: "👥",
    stat: "128",
    desc: "clientes activos",
    color: palette.secondary,
    angle: 0,
  },
  {
    id: "inventario",
    label: "Inventario",
    emoji: "🎂",
    stat: "54",
    desc: "en catálogo",
    color: palette.accent,
    angle: 60,
  },
  {
    id: "recetas",
    label: "Recetas",
    emoji: "📖",
    stat: "32",
    desc: "recetas guardadas",
    color: "#C78FDB",
    angle: 120,
  },
  {
    id: "calendario",
    label: "Calendario",
    emoji: "📅",
    stat: "7",
    desc: "eventos esta semana",
    color: palette.secondary,
    angle: 180,
  },
  {
    id: "estadisticas",
    label: "Estadísticas",
    emoji: "📊",
    stat: "+18%",
    desc: "ventas este mes",
    color: palette.accent,
    angle: 240,
  },
  {
    id: "admin",
    label: "Admin",
    emoji: "⚙️",
    stat: "",
    desc: "configuración",
    color: "#9B5AB3",
    angle: 300,
  },
];

// Estadísticas rápidas en cards
const quickStats = [
  { label: "Pedidos hoy", value: "12", icon: "🛍️", trend: "+3 vs ayer" },
  { label: "Ingresos mes", value: "3.240€", icon: "💶", trend: "+18% vs anterior" },
  { label: "Pendientes", value: "5", icon: "⏳", trend: "urgentes: 2" },
  { label: "Nuevos clientes", value: "8", icon: "🌟", trend: "esta semana" },
];

// Pedidos recientes (mock data – reemplazar con fetch a backend)
const recentOrders = [
  { id: "#001", cliente: "María García", producto: "Tarta Fondant", estado: "Pendiente", fecha: "Hoy 14:00" },
  { id: "#002", cliente: "Carlos López", producto: "Cupcakes x12", estado: "En proceso", fecha: "Hoy 12:30" },
  { id: "#003", cliente: "Ana Martínez", producto: "Macarons x24", estado: "Listo", fecha: "Ayer 18:00" },
  { id: "#004", cliente: "Luis Fernández", producto: "Tarta Cumpleaños", estado: "Entregado", fecha: "Ayer 11:00" },
];

const estadoBadge = {
  "Pendiente": { bg: "#FFF3CD", color: "#856404" },
  "En proceso": { bg: "#D1ECF1", color: "#0C5460" },
  "Listo": { bg: "#D4EDDA", color: "#155724" },
  "Entregado": { bg: "#E2E3E5", color: "#383D41" },
};

export default function HomeView({ onNavigate }) {
  const [hoveredBubble, setHoveredBubble] = useState(null);

  // Posición de cada satélite en círculo (radio 160px desde el centro)
  const radius = 155;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontSize: 35,
            fontWeight: 800,
            color: palette.textPrimary,
            margin: 0,
            letterSpacing: "-0.5px",
          }}
        >
          ¡Bienvenida! 🍰
        </h1>
        <p style={{ color: palette.textMuted, margin: "4px 0 0", fontSize: 18 }}>
          Aquí tienes el resumen de hoy en tu repostería.
        </p>
      </div>

      {/* Quick Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 40,
        }}
      >
        {quickStats.map((stat) => (
          <div
            key={stat.label}
            style={{
              background: palette.cardBg,
              borderRadius: 16,
              padding: "20px 22px",
              boxShadow: palette.cardShadow,
              border: `1px solid ${palette.cardBorder}`,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 14,
                background: palette.soft,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                flexShrink: 0,
              }}
            >
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: palette.textPrimary, lineHeight: 1 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 16, color: palette.textMuted, marginTop: 2 }}>{stat.label}</div>
              <div style={{ fontSize: 13, color: palette.accent, marginTop: 1 }}>{stat.trend}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main area: Bubbles + Recent Orders */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        {/* Bubble Navigator */}
        <div
          style={{
            background: palette.cardBg,
            borderRadius: 24,
            boxShadow: palette.cardShadow,
            border: `1px solid ${palette.cardBorder}`,
            padding: 32,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h2 style={{ fontSize: 35, fontWeight: 700, color: palette.textPrimary, margin: "0 0 8px", alignSelf: "flex-start" }}>
            Acceso rápido
          </h2>
          <p style={{ fontSize: 16, color: palette.textMuted, margin: "0 0 24px", alignSelf: "flex-start" }}>
            Haz clic en cualquier módulo
          </p>

          {/* Bubble map */}
          <div
            style={{
              position: "relative",
              width: 380,
              height: 380,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Lines from center to satellites */}
            <svg
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}
              viewBox="0 0 380 380"
            >
              {satelliteBubbles.map((b) => {
                const rad = (b.angle * Math.PI) / 180;
                const cx = 190 + radius * Math.cos(rad);
                const cy = 190 + radius * Math.sin(rad);
                return (
                  <line
                    key={b.id}
                    x1={190}
                    y1={190}
                    x2={cx}
                    y2={cy}
                    stroke={palette.soft}
                    strokeWidth={hoveredBubble === b.id ? 2 : 1.5}
                    strokeDasharray="5,4"
                    style={{ transition: "all 0.2s" }}
                  />
                );
              })}
            </svg>

            {/* Central bubble - Pedidos */}
            <button
              onClick={() => onNavigate("pedidos")}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 110,
                height: 110,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`,
                border: "none",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 8px 32px rgba(82,37,102,0.35)`,
                zIndex: 2,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translate(-50%, -50%) scale(1.07)";
                e.currentTarget.style.boxShadow = `0 12px 40px rgba(82,37,102,0.45)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translate(-50%, -50%) scale(1)";
                e.currentTarget.style.boxShadow = `0 8px 32px rgba(82,37,102,0.35)`;
              }}
            >
              <span style={{ fontSize: 36 }}>🛍️</span>
              <span style={{ color: "#fff", fontSize: 15, fontWeight: 700, marginTop: 5 }}>Pedidos</span>
            </button>

            {/* Satellite bubbles */}
            {satelliteBubbles.map((b) => {
              const rad = (b.angle * Math.PI) / 180;
              const cx = 190 + radius * Math.cos(rad);
              const cy = 190 + radius * Math.sin(rad);
              const isHovered = hoveredBubble === b.id;

              return (
                <button
                  key={b.id}
                  onClick={() => onNavigate(b.id)}
                  onMouseEnter={() => setHoveredBubble(b.id)}
                  onMouseLeave={() => setHoveredBubble(null)}
                  style={{
                    position: "absolute",
                    left: cx - 42,
                    top: cy - 42,
                    width: 104,
                    height: 104,
                    borderRadius: "50%",
                    background: isHovered
                      ? `linear-gradient(135deg, ${b.color}, ${palette.accent})`
                      : palette.soft,
                    border: `2px solid ${isHovered ? b.color : palette.cardBorder}`,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: isHovered
                      ? `0 6px 20px rgba(82,37,102,0.25)`
                      : `0 2px 8px rgba(82,37,102,0.08)`,
                    transition: "all 0.2s ease",
                    transform: isHovered ? "scale(1.08)" : "scale(1)",
                    zIndex: 1,
                    padding: 0,
                  }}
                >
                  <span style={{ fontSize: 26 }}>{b.emoji}</span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: isHovered ? "#fff" : palette.textSecondary,
                      marginTop: 3,
                    }}
                  >
                    {b.label}
                  </span>
                  {b.stat && (
                    <span
                      style={{
                        fontSize: 11,
                        color: isHovered ? "rgba(255,255,255,0.8)" : palette.textMuted,
                        marginTop: 1,
                      }}
                    >
                      {b.stat}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Orders */}
        <div
          style={{
            background: palette.cardBg,
            borderRadius: 24,
            boxShadow: palette.cardShadow,
            border: `1px solid ${palette.cardBorder}`,
            padding: 28,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h2 style={{ fontSize: 35, fontWeight: 700, color: palette.textPrimary, margin: 0 }}>
              Pedidos recientes
            </h2>
            <button
              onClick={() => onNavigate("pedidos")}
              style={{
                background: palette.soft,
                border: "none",
                borderRadius: 8,
                padding: "6px 14px",
                fontSize: 12,
                color: palette.primary,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Ver todos →
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {recentOrders.map((order) => (
              <div
                key={order.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 16px",
                  borderRadius: 14,
                  background: palette.background,
                  border: `1px solid ${palette.cardBorder}`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: palette.soft,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                    }}
                  >
                    🎂
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: palette.textPrimary }}>
                      {order.cliente}
                    </div>
                    <div style={{ fontSize: 12, color: palette.textMuted }}>{order.producto}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "3px 10px",
                      borderRadius: 20,
                      fontSize: 11,
                      fontWeight: 600,
                      background: estadoBadge[order.estado]?.bg,
                      color: estadoBadge[order.estado]?.color,
                      marginBottom: 4,
                    }}
                  >
                    {order.estado}
                  </span>
                  <div style={{ fontSize: 11, color: palette.textMuted }}>{order.fecha}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}