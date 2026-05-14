import palette from "../../../theme/palette";

export default function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: palette.bgCard, border: `1px solid ${palette.border}`, borderRadius: 10, padding: "10px 14px", boxShadow: "0 4px 16px oklch(0% 0 0 / 0.1)", fontSize: 12 }}>
      <div style={{ fontWeight: 700, color: palette.textDark, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontWeight: 600 }}>
          {p.name}: {typeof p.value === "number" ? `€ ${p.value.toFixed(2)}` : p.value}
        </div>
      ))}
    </div>
  );
}
