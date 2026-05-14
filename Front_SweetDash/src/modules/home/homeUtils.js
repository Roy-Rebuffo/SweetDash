import palette from "../../theme/palette";

export const MODULE_CARDS = [
  { id: "pedidos",      label: "Pedidos",      accentKey: "primary",    accentLtKey: "primaryLt",   iconPath: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { id: "clientes",     label: "Clientes",     accentKey: "accent1",    accentLtKey: "accent1Lt",   iconPath: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  { id: "productos",    label: "Inventario",   accentKey: "accent2",    accentLtKey: "accent2Lt",   iconPath: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" },
  { id: "recetas",      label: "Recetas",      accentKey: "accent3",    accentLtKey: "accent3Lt",   iconPath: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
  { id: "calendario",   label: "Calendario",   accentKey: "primaryMid", accentLtKey: "primaryLt",   iconPath: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { id: "estadisticas", label: "Estadísticas", accentKey: "accent1",    accentLtKey: "accent1Lt",   iconPath: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { id: "costes",       label: "Costes",       accentKey: "accent3",    accentLtKey: "accent3Lt",   iconPath: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" },
];

export const AVATAR_COLORS = [palette.primary, palette.accent1, palette.accent2, palette.accent3, palette.primaryMid];

export function formatFecha(iso) {
  if (!iso) return "—";
  return String(iso).slice(0, 10);
}

export function getNombreCompleto(p) {
  const nombre = (p.nombreCliente || p.nombre || "").trim();
  const apellidos = (p.apellidosCliente || p.apellidos || "").trim();
  return apellidos ? `${nombre} ${apellidos}` : nombre;
}

export function calcularTotal(detalles) {
  if (!detalles || detalles.length === 0) return null;
  return detalles.reduce((acc, d) => acc + d.cantidad * (d.precioCongelado || 0), 0);
}

export function getEstadoStyle(estado) {
  const map = {
    "Pendiente":  { bg: palette.accent2Lt, color: palette.accent2 },
    "En proceso": { bg: palette.accent1Lt, color: palette.accent1 },
    "Preparado":  { bg: palette.primaryLt, color: palette.primary },
    "Entregado":  { bg: "oklch(93% 0.01 40)", color: "oklch(48% 0.02 40)" },
  };
  return map[estado] || map["Pendiente"];
}
