import palette from "../theme/palette";

const configSections = [
  { titulo: "Datos de la tienda", desc: "Nombre, dirección, teléfono y horarios", emoji: "🏪" },
  { titulo: "Métodos de pago", desc: "Configura cómo recibes los pagos", emoji: "💳" },
  { titulo: "Notificaciones", desc: "Alertas de pedidos, stock y más", emoji: "🔔" },
  { titulo: "Usuarios y accesos", desc: "Gestiona quién puede acceder al sistema", emoji: "🔐" },
  { titulo: "Copias de seguridad", desc: "Exporta y respalda todos tus datos", emoji: "💾" },
];

export default function AdminView() {
  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: palette.textPrimary, margin: 0 }}>Administración ⚙️</h1>
        <p style={{ color: palette.textMuted, margin: "4px 0 0", fontSize: 14 }}>Configuración general de SweetDash</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {configSections.map((s) => (
          <button
            key={s.titulo}
            style={{ background: palette.cardBg, borderRadius: 16, padding: "18px 22px", boxShadow: palette.cardShadow, border: `1px solid ${palette.cardBorder}`, display: "flex", alignItems: "center", gap: 16, cursor: "pointer", textAlign: "left", width: "100%" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = palette.accent; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = palette.cardBorder; }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 12, background: palette.soft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{s.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: palette.textPrimary, fontSize: 15 }}>{s.titulo}</div>
              <div style={{ fontSize: 12, color: palette.textMuted, marginTop: 2 }}>{s.desc}</div>
            </div>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke={palette.textMuted} strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}