import palette from "../../theme/palette";

export const DIAS_HDR = ["L", "M", "X", "J", "V", "S", "D"];
export const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
export const LEGEND_TIPOS = ["Pendiente", "En proceso", "Entrega", "Completada", "Entregada"];

export function tipoStyle(tipo) {
  return ({
    "Pendiente":  { bg: palette.accent2Lt, color: palette.accent2 },
    "En proceso": { bg: palette.accent1Lt, color: palette.accent1 },
    "Entrega":    { bg: palette.accent3Lt, color: palette.accent3 },
    "Finalizado": { bg: "oklch(93% 0.01 40)", color: "oklch(46% 0.02 40)" },
    "Completada": { bg: palette.primaryLt, color: palette.primary },
    "Entregada":  { bg: "oklch(93% 0.01 40)", color: "oklch(46% 0.02 40)" },
  })[tipo] || { bg: palette.primaryLt, color: palette.primary };
}

export function formatFechaKey(date) {
  if (!date) return null;
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
