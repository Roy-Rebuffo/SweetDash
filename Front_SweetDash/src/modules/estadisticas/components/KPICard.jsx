import palette from "../../../theme/palette";

export default function KPICard({ label, value, sub, color, icon }) {
  return (
    <div style={{
      background: palette.bgCard, borderRadius: 16,
      border: `1px solid ${palette.border}`,
      boxShadow: "0 2px 8px oklch(0% 0 0 / 0.05)",
      padding: "22px 24px",
      display: "flex", flexDirection: "column", gap: 8,
      borderTop: `3px solid ${color || palette.primary}`,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: palette.textLight, letterSpacing: "0.8px", textTransform: "uppercase" }}>{label}</div>
        {icon && <span style={{ fontSize: 18, opacity: 0.7 }}>{icon}</span>}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: palette.textDark, letterSpacing: "-1px", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11.5, color: palette.textLight, fontWeight: 500 }}>{sub}</div>}
    </div>
  );
}
