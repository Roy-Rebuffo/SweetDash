import { useState } from "react";
import palette from "../theme/palette";

// Datos del usuario – reemplazar con fetch al backend / contexto de auth
const user = {
  nombre: "Flor Baker",
  rol: "Head Pastry Chef",
  avatar: null, // URL de imagen, ej: "/avatar.jpg" — si null, muestra iniciales
  notificaciones: 3,
  mensajes: 1,
};

function IconButton({ children, badge, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        width: 40,
        height: 40,
        borderRadius: 12,
        border: `1px solid ${hovered ? palette.accent : palette.cardBorder}`,
        background: hovered ? palette.soft : palette.cardBg,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: hovered ? palette.primary : palette.textMuted,
        transition: "all 0.15s ease",
        flexShrink: 0,
      }}
    >
      {children}
      {badge > 0 && (
        <span
          style={{
            position: "absolute",
            top: 6,
            right: 6,
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: palette.primary,
            border: `2px solid ${palette.background}`,
          }}
        />
      )}
    </button>
  );
}

export default function TopBar() {
  const initials = user.nombre
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div
      style={{
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 10,
        paddingRight: 40,
        paddingLeft: 40,
        background: palette.background,
        borderBottom: `1px solid ${palette.cardBorder}`,
        flexShrink: 0,
      }}
    >
      {/* Notificaciones */}
      <IconButton badge={user.notificaciones}>
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </IconButton>

      {/* Mensajes */}
      <IconButton badge={user.mensajes}>
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </IconButton>

      {/* Separador */}
      <div
        style={{
          width: 1,
          height: 28,
          background: palette.cardBorder,
          margin: "0 6px",
        }}
      />

      {/* Perfil */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          cursor: "pointer",
          padding: "6px 10px",
          borderRadius: 14,
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = palette.soft)}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        {/* Texto */}
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: palette.textPrimary, lineHeight: 1.2 }}>
            {user.nombre}
          </div>
          <div style={{ fontSize: 10, fontWeight: 700, color: palette.textMuted, textTransform: "uppercase", letterSpacing: "0.6px" }}>
            {user.rol}
          </div>
        </div>

        {/* Avatar */}
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            overflow: "hidden",
            background: user.avatar
              ? "transparent"
              : `linear-gradient(135deg, ${palette.secondary}, ${palette.accent})`,
            border: `2px solid ${palette.soft}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {user.avatar ? (
            <img src={user.avatar} alt={user.nombre} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 13 }}>{initials}</span>
          )}
        </div>
      </div>
    </div>
  );
}