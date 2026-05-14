import { AVATAR_COLORS } from "../homeUtils";

export default function Avatar({ name, idx, size = 28 }) {
  const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: `${color}1A`, border: `1.5px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", color, fontWeight: 700, fontSize: size * 0.37, flexShrink: 0 }}>
      {initials}
    </div>
  );
}
