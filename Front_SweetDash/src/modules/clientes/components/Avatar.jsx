import { AVATAR_COLORS } from "../clientesUtils";

export default function Avatar({ nombre, idx }) {
  const words    = nombre.trim().split(/\s+/);
  const initials = words.length >= 2
    ? (words[0][0] + words[1][0]).toUpperCase()
    : (words[0][0] || "?").toUpperCase();
  const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];
  return (
    <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${color}1A`, border: `1.5px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", color, fontWeight: 700, fontSize: 11, flexShrink: 0 }}>
      {initials}
    </div>
  );
}
