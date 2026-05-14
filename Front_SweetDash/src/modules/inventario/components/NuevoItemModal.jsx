import { useState } from "react";
import palette from "../../../theme/palette";
import MateriaPrimaModal from "./MateriaPrimaModal";
import MaterialModal from "./MaterialModal";

export default function NuevoItemModal({ onClose, onSaved }) {
  const [tipo, setTipo] = useState(null);

  if (tipo === "mp") return <MateriaPrimaModal item={null} onClose={onClose} onSaved={onSaved} />;
  if (tipo === "mat") return <MaterialModal item={null} onClose={onClose} onSaved={onSaved} />;

  return (
    <div style={{ position: "fixed", inset: 0, background: "oklch(0% 0 0 / 0.35)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: palette.bgCard, borderRadius: 18, border: `1px solid ${palette.border}`, boxShadow: "0 8px 32px oklch(0% 0 0 / 0.12)", width: "100%", maxWidth: 400, padding: 28 }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: palette.textDark }}>¿Qué quieres añadir?</div>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${palette.border}`, background: palette.bg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: palette.textLight }}>
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button onClick={() => setTipo("mp")}
            style={{ padding: "16px 20px", borderRadius: 12, border: `1px solid ${palette.border}`, background: palette.bg, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textAlign: "left", display: "flex", alignItems: "center", gap: 14, transition: "all 0.15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = palette.primary; e.currentTarget.style.background = palette.primaryLt; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = palette.border; e.currentTarget.style.background = palette.bg; }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: palette.accent3Lt, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🧈</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: palette.textDark }}>Materia Prima</div>
              <div style={{ fontSize: 12, color: palette.textLight, marginTop: 2 }}>Ingredientes usados en recetas — harina, mantequilla, chocolate...</div>
            </div>
          </button>

          <button onClick={() => setTipo("mat")}
            style={{ padding: "16px 20px", borderRadius: 12, border: `1px solid ${palette.border}`, background: palette.bg, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textAlign: "left", display: "flex", alignItems: "center", gap: 14, transition: "all 0.15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = palette.primary; e.currentTarget.style.background = palette.primaryLt; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = palette.border; e.currentTarget.style.background = palette.bg; }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: palette.accent1Lt, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>📦</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: palette.textDark }}>Material</div>
              <div style={{ fontSize: 12, color: palette.textLight, marginTop: 2 }}>Packaging y materiales de apoyo — cajas, moldes, mangas...</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
