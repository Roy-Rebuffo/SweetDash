export function formatFecha(iso) {
  if (!iso) return "—";
  return String(iso).slice(0, 10);
}

export function parseFechaLocal(str) {
  if (!str) return null;
  const s = String(str).slice(0, 10);
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

export const ESTADOS = ["Pendiente", "En proceso", "Preparado", "Entregado"];
