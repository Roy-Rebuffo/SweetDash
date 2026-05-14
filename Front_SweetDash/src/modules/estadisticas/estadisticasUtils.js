import palette from "../../theme/palette";
import { parseFechaLocal } from "../../utils/helpers";

export const CATEGORIA_COLORES = [
  palette.primary, palette.accent1, palette.accent2, palette.accent3, palette.primaryMid,
  "#8B5CF6", "#EC4899", "#14B8A6",
];

export const FILTROS_PERIODO = ["Todo", "Este mes", "Últimos 3 meses", "Este año"];

export const NAV_TABS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "historico", label: "Histórico" },
  { key: "productos", label: "Por producto" },
];

export function mesLabel(dateStr) {
  const d = parseFechaLocal(dateStr);
  if (!d) return "—";
  return d.toLocaleDateString("es-ES", { month: "short", year: "2-digit" });
}

export function getNombreCliente(p) {
  return (p.nombreCliente || p.nombre || "Cliente").trim();
}

export function categoriaProducto(nombre) {
  const n = (nombre || "").toUpperCase();
  if (n.includes("TARTA") || n.includes("CARROT") || n.includes("CHAJA") || n.includes("FULL CHOCO") || n.includes("OREO") || n.includes("SAN MARC") || n.includes("KINDER") || n.includes("CHOCO")) return "Tartas";
  if (n.includes("GALLETA") || n.includes("COOKIE") || n.includes("RAMO")) return "Galletas";
  if (n.includes("PASTA") || n.includes("SABLE")) return "Pastas de té";
  if (n.includes("CHEESECAKE") || n.includes("LEMON PIE") || n.includes("KEYLIME")) return "Cheesecakes";
  if (n.includes("CUPCAKE")) return "Cupcakes";
  if (n.includes("ALFAJOR")) return "Alfajores";
  if (n.includes("BROWNIE")) return "Brownies";
  return "Otros";
}
