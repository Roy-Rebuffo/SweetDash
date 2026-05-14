import { useState } from "react";
import palette from "../../../theme/palette";

const STRIPE_COLORS = [
  [palette.primaryLt, palette.primary + "22"],
  [palette.accent1Lt, palette.accent1 + "22"],
  [palette.accent2Lt, palette.accent2 + "22"],
  [palette.accent3Lt, palette.accent3 + "22"],
];

function PhotoPlaceholder({ idx, imagenUrl, tipo }) {
  const [sc1, sc2] = STRIPE_COLORS[idx % STRIPE_COLORS.length];
  const accentColors = [palette.primary, palette.accent1, palette.accent2, palette.accent3];
  const accentColor = accentColors[idx % accentColors.length];

  if (imagenUrl) {
    return (
      <div style={{ height: 130, background: `url(${imagenUrl}) center/cover no-repeat`, position: "relative" }}>
        <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(255,255,255,0.9)", borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700, color: palette.textMid }}>{tipo}</div>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", height: 130, background: sc1, overflow: "hidden" }}>
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id={`stripe-${idx}`} patternUnits="userSpaceOnUse" width="16" height="16" patternTransform="rotate(45)">
            <rect width="16" height="16" fill={sc1} />
            <rect width="8" height="16" fill={sc2} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#stripe-${idx})`} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke={accentColor} strokeWidth={1.6}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <span style={{ fontSize: 9.5, color: palette.textMid, background: "rgba(255,255,255,0.6)", padding: "2px 7px", borderRadius: 4 }}>foto de receta</span>
      </div>
      <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(255,255,255,0.85)", borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700, color: palette.textMid }}>{tipo}</div>
    </div>
  );
}

export default function RecetaCard({ producto, numTamaños, usada, idx, onEditar, onEliminar, onVer }) {
  const [hovered, setHovered] = useState(false);

  const tamBg = numTamaños > 0 ? palette.accent1Lt : palette.border;
  const tamColor = numTamaños > 0 ? palette.accent1 : palette.textLight;
  const tamLabel = numTamaños > 0
    ? `${numTamaños} tamaño${numTamaños !== 1 ? "s" : ""}`
    : "Sin tamaños";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onVer(producto)}
      style={{ background: palette.bgCard, borderRadius: 14, border: `1px solid ${hovered ? palette.primaryMid + "55" : palette.border}`, boxShadow: hovered ? `0 4px 20px ${palette.primary}0F` : "0 1px 4px oklch(0% 0 0 / 0.04)", overflow: "hidden", display: "flex", flexDirection: "column", transition: "all 0.18s ease", cursor: "pointer" }}
    >
      <PhotoPlaceholder idx={idx} imagenUrl={producto.imagenUrl} tipo={producto.tipo} />
      <div style={{ padding: "16px 18px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: 14.5, color: palette.textDark, marginBottom: 3, lineHeight: 1.3 }}>{producto.nombre}</div>
        <div style={{ fontSize: 11.5, color: palette.textLight, marginBottom: 12 }}>{producto.descripcion}</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 14 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: palette.textMid }}>
            <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke={palette.textLight} strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            {producto.cantidadPersonas || "—"}
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: palette.textMid }}>
            <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke={palette.textLight} strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0M8 10.5h4m-4 3h4" /></svg>
            € {producto.precioBase}
          </span>
          <span style={{ marginLeft: "auto", display: "inline-flex", padding: "2.5px 9px", borderRadius: 20, background: tamBg, color: tamColor, fontSize: 10.5, fontWeight: 600 }}>{tamLabel}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
          <span style={{ fontSize: 11, color: palette.textLight }}>
            {usada > 0 ? `Pedida ${usada} vez${usada !== 1 ? "es" : ""}` : "Sin pedidos aún"}
          </span>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={(e) => { e.stopPropagation(); onEditar(producto); }} title="Editar"
              style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${palette.border}`, background: palette.bgCard, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: palette.primary, transition: "all 0.15s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = palette.primaryLt; e.currentTarget.style.borderColor = palette.primary; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = palette.bgCard; e.currentTarget.style.borderColor = palette.border; }}>
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            </button>
            <button onClick={(e) => { e.stopPropagation(); onEliminar(producto); }} title="Eliminar"
              style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${palette.border}`, background: palette.bgCard, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#EF4444", transition: "all 0.15s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#FEF2F2"; e.currentTarget.style.borderColor = "#EF4444"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = palette.bgCard; e.currentTarget.style.borderColor = palette.border; }}>
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
