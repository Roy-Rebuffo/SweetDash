import { useState } from "react";
import palette from "../theme/palette";

const navItems = [
  {
    id: "home",
    label: "Inicio",
    path: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  {
    id: "pedidos",
    label: "Pedidos",
    path: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  },
  {
    id: "clientes",
    label: "Clientes",
    path: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  },
  {
    id: "productos",
    label: "Inventario",
    path: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10",
  },
  {
    id: "recetas",
    label: "Recetas",
    path: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  },
  {
    id: "calendario",
    label: "Calendario",
    path: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
  {
    id: "estadisticas",
    label: "Estadísticas",
    path: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  },
  {
    id: "admin",
    label: "Administración",
    path: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  },
];

function NavIcon({ path, size = 15, color = "currentColor", sw = 1.7 }) {
  return (
    <svg
      width={size} height={size}
      fill="none" viewBox="0 0 24 24"
      stroke={color} strokeWidth={sw}
      style={{ flexShrink: 0 }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}

export default function Sidebar({ active, onNavigate }) {
  const [hov, setHov] = useState(null);

  return (
    <aside
      style={{
        width: 232,
        minWidth: 232,
        height: "100vh",
        background: palette.bgSidebar,
        borderRight: `1px solid ${palette.border}`,
        display: "flex",
        flexDirection: "column",
        zIndex: 10,
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "26px 22px 18px",
          borderBottom: `1px solid ${palette.border}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: palette.primaryLt,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `1.5px solid ${palette.primaryMid}33`,
            }}
          >
            <svg
              width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke={palette.primary} strokeWidth="1.8"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 15.5A3.5 3.5 0 0117.5 19H6.5A3.5 3.5 0 013 15.5V14a2 2 0 012-2h14a2 2 0 012 2v1.5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12V9a4 4 0 018 0v3" />
              <circle cx="12" cy="6.5" r="1.2" fill={palette.primary} stroke="none" />
            </svg>
          </div>
          <div>
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: 16,
                color: palette.textDark,
                letterSpacing: "0.1px",
              }}
            >
              SweetDash
            </div>
            <div
              style={{
                fontSize: 9.5,
                color: palette.textLight,
                fontWeight: 500,
                letterSpacing: "1px",
                textTransform: "uppercase",
                marginTop: 1,
              }}
            >
              Repostería
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
        {navItems.map((item) => {
          const isActive = active === item.id;
          const isHov    = hov === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              onMouseEnter={() => setHov(item.id)}
              onMouseLeave={() => setHov(null)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                width: "100%",
                padding: "8.5px 11px",
                borderRadius: 9,
                border: "none",
                cursor: "pointer",
                marginBottom: 2,
                background: isActive
                  ? palette.primaryLt
                  : isHov
                  ? `${palette.primaryLt}88`
                  : "transparent",
                color: isActive
                  ? palette.primary
                  : isHov
                  ? palette.textDark
                  : palette.textMid,
                fontWeight: isActive ? 600 : 400,
                fontSize: 13.5,
                textAlign: "left",
                transition: "all 0.15s ease",
                fontFamily: "'DM Sans', sans-serif",
                letterSpacing: "0.1px",
              }}
            >
              <span style={{ opacity: isActive ? 1 : 0.65 }}>
                <NavIcon
                  path={item.path}
                  size={15}
                  color={isActive ? palette.primary : "currentColor"}
                  sw={isActive ? 2 : 1.6}
                />
              </span>
              {item.label}
              {isActive && (
                <span
                  style={{
                    marginLeft: "auto",
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: palette.primary,
                    flexShrink: 0,
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Divider */}
      <div style={{ padding: "0 16px 8px" }}>
        <div style={{ height: 1, background: palette.border }} />
      </div>

      {/* User */}
      <div style={{ padding: "12px 18px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: palette.primaryLt,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: palette.primary,
              fontWeight: 700,
              fontSize: 11,
              border: `1.5px solid ${palette.primaryMid}44`,
              flexShrink: 0,
            }}
          >
            FB
          </div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: palette.textDark }}>
              Flor Baker
            </div>
            <div style={{ fontSize: 10, color: palette.textLight, letterSpacing: "0.3px" }}>
              Head Pastry Chef
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
