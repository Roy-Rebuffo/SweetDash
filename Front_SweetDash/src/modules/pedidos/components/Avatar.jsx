import { AVATAR_COLORS } from "../pedidosUtils";

export default function Avatar({ nombre, idx }) {
  const initials = nombre.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];
  return (
    <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${color}1A`, border: `1.5px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", color, fontWeight: 700, fontSize: 10, flexShrink: 0 }}>
      {initials}
    </div>
  );
}
