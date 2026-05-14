import palette from "../../theme/palette";

export const estadoStyle = {
  "Pendiente": { bg: palette.accent2Lt, color: palette.accent2 },
  "En proceso": { bg: palette.accent1Lt, color: palette.accent1 },
  "Preparado": { bg: palette.primaryLt, color: palette.primary },
  "Entregado": { bg: "oklch(93% 0.01 40)", color: "oklch(48% 0.02 40)" },
};

export const AVATAR_COLORS = [palette.primary, palette.accent1, palette.accent2, palette.accent3, palette.primaryMid];

export function formatFecha(iso) {
  if (!iso) return "—";
  return iso.slice(0, 10);
}

export function parseFechaLocal(str) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function getNombreCompleto(p) {
  const nombre = (p.nombreCliente || "").trim();
  const apellidos = (p.apellidosCliente || p.apellidos || "").trim();
  return apellidos ? `${nombre} ${apellidos}` : nombre;
}

export function calcularTotal(detalles) {
  if (!detalles || detalles.length === 0) return "—";
  const total = detalles.reduce((acc, d) => acc + d.cantidad * (d.precioCongelado || 0), 0);
  return `€ ${total.toFixed(2)}`;
}

export function getProductoLabel(detalles) {
  if (!detalles || detalles.length === 0) return "—";
  const extra = detalles.length - 1;
  return extra > 0 ? `${detalles[0].nombreProducto} +${extra}` : detalles[0].nombreProducto;
}
