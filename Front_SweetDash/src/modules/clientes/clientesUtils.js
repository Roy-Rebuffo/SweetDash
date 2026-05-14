import palette from "../../theme/palette";

export const estadoStyle = {
  "Pendiente":  { bg: palette.accent2Lt, color: palette.accent2 },
  "En proceso": { bg: palette.accent1Lt, color: palette.accent1 },
  "Preparado":  { bg: palette.primaryLt, color: palette.primary },
  "Entregado":  { bg: "oklch(93% 0.01 40)", color: "oklch(48% 0.02 40)" },
};

export const AVATAR_COLORS = [palette.primary, palette.accent1, palette.accent2, palette.accent3, palette.primaryMid];

export function formatFecha(iso) {
  if (!iso) return "—";
  return String(iso).slice(0, 10);
}

export function mapCliente(c) {
  const nombre    = (c.nombre    || "").trim();
  const apellidos = (c.apellidos || "").trim();
  return {
    id:        c.idCliente,
    nombre:    apellidos ? `${nombre} ${apellidos}` : nombre,
    email:     c.email     || "—",
    telefono:  c.telefono  || "—",
    direccion: c.direccion || "—",
    notas:     c.notas     || "",
    tipo:      "Cliente",
    _nombre:    c.nombre    || "",
    _apellidos: c.apellidos || "",
  };
}
