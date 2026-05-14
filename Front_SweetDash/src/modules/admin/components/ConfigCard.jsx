import palette from "../../../theme/palette";

export default function ConfigCard({ section, isMobile }) {
  const pad = isMobile ? "16px" : "24px";
  return (
    <div
      style={{
        background: palette.bgCard, borderRadius: 14,
        border: `1px solid ${palette.border}`,
        boxShadow: "0 1px 4px oklch(0% 0 0 / 0.04)",
        padding: pad, minWidth: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div
          style={{
            width: 34, height: 34, borderRadius: 9,
            background: palette.primaryLt,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke={palette.primary} strokeWidth={1.7}>
            <path strokeLinecap="round" strokeLinejoin="round" d={section.icon} />
          </svg>
        </div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 15, color: palette.textDark }}>
          {section.title}
        </div>
      </div>

      {section.fields.map(([label, value]) => (
        <div key={label} style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, color: palette.textLight, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 4 }}>
            {label}
          </div>
          <div style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.bg, fontSize: 13, color: palette.textDark }}>
            {value}
          </div>
        </div>
      ))}

      <button
        style={{
          width: "100%", padding: "8px", borderRadius: 8,
          border: `1px solid ${palette.primary}`, background: "transparent",
          color: palette.primary, fontSize: 12.5, fontWeight: 600,
          cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginTop: 4,
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = palette.primaryLt)}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        Editar
      </button>
    </div>
  );
}
