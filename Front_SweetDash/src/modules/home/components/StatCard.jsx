import palette from "../../../theme/palette";

export default function StatCard({ label, value, trend, trendKey, loading, isMobile = false }) {
  const trendColor = palette[trendKey] || palette.accent3;
  return (
    <div style={{ background: palette.bgCard, borderRadius: 14, border: `1px solid ${palette.border}`, boxShadow: "0 1px 4px oklch(0% 0 0 / 0.04)", padding: isMobile ? "14px 16px" : "20px 22px" }}>
      <div style={{ fontSize: 10.5, fontWeight: 600, color: palette.textLight, letterSpacing: "0.7px", textTransform: "uppercase", marginBottom: 10 }}>{label}</div>
      {loading ? (
        <div style={{ height: 32, borderRadius: 6, background: palette.border, animation: "pulse 1.5s ease infinite" }} />
      ) : (
        <div style={{ fontSize: 26, fontWeight: 700, color: palette.textDark, letterSpacing: "-0.5px", lineHeight: 1, marginBottom: 8 }}>{value}</div>
      )}
      {trend && !loading && (
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: trendColor, fontWeight: 500, overflow: "hidden" }}>
          <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke={trendColor} strokeWidth={2} style={{ flexShrink: 0 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{trend}</span>
        </div>
      )}
    </div>
  );
}
