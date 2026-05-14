import palette from "../../theme/palette";

export function fmt(n) {
  if (n == null) return "—";
  return `€ ${Number(n).toFixed(2)}`;
}

export function pct(n) {
  if (n == null) return "—";
  return `${Number(n).toFixed(1)}%`;
}

export function margenColor(margen) {
  if (margen == null) return palette.textLight;
  if (margen >= 50) return "#16A34A";
  if (margen >= 30) return palette.accent3;
  return "#EF4444";
}

export function margenBg(margen) {
  if (margen == null) return palette.border;
  if (margen >= 50) return "#DCFCE7";
  if (margen >= 30) return palette.accent3Lt;
  return "#FEE2E2";
}
