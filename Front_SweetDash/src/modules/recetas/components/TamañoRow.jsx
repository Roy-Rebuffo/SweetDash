import { useState } from "react";
import palette from "../../../theme/palette";
import useIsMobile from "../../../hooks/useIsMobile";

export default function TamañoRow({ tamaño, idx, materiasPrimas, onChange, onRemove, onDuplicate }) {
  const [collapsed, setCollapsed] = useState(true);
  const isMobile = useIsMobile();
  const inputStyle = { height: 34, borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.bgCard, padding: "0 10px", fontSize: 12, color: palette.textDark, fontFamily: "'DM Sans', sans-serif", width: "100%" };
  const labelStyle = { fontSize: 10, fontWeight: 600, color: palette.textLight, textTransform: "uppercase", letterSpacing: "0.5px" };

  const addIng = () => {
    if (materiasPrimas.length === 0) return;
    onChange(idx, "ingredientes", [...tamaño.ingredientes, { idMateriaPrima: materiasPrimas[0].idMateriaPrima, cantidadUsada: "" }]);
  };
  const removeIng = (i) => onChange(idx, "ingredientes", tamaño.ingredientes.filter((_, j) => j !== i));
  const updateIng = (i, key, value) => onChange(idx, "ingredientes", tamaño.ingredientes.map((ing, j) => j !== i ? ing : { ...ing, [key]: value }));

  const addPaso = () => onChange(idx, "pasos", [...(tamaño.pasos || []), { nombre: "", diasAntesEntrega: 1 }]);
  const removePaso = (i) => onChange(idx, "pasos", tamaño.pasos.filter((_, j) => j !== i));
  const updatePaso = (i, key, value) => onChange(idx, "pasos", tamaño.pasos.map((p, j) => j !== i ? p : { ...p, [key]: value }));

  return (
    <div style={{ background: palette.bg, borderRadius: 12, border: `1px solid ${palette.border}`, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "flex-end" }}>
        <div style={{ flex: "1 1 140px", display: "flex", flexDirection: "column", gap: 4 }}>
          <label style={labelStyle}>Tamaño</label>
          <input type="text" value={tamaño.descripcionTamaño} onChange={e => onChange(idx, "descripcionTamaño", e.target.value)}
            placeholder="20cm · 8-10p / 450gr / 12 unidades..."
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = palette.primaryMid}
            onBlur={e => e.target.style.borderColor = palette.border} />
        </div>
        <div style={{ flex: "1 1 110px", display: "flex", flexDirection: "column", gap: 4 }}>
          <label style={labelStyle}>Precio venta (€)</label>
          <input type="number" min="0" step="0.01" value={tamaño.precioVenta} onChange={e => onChange(idx, "precioVenta", e.target.value)}
            placeholder="35.00" style={inputStyle}
            onFocus={e => e.target.style.borderColor = palette.primaryMid}
            onBlur={e => e.target.style.borderColor = palette.border} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setCollapsed(v => !v)}
            style={{ width: 30, height: 30, borderRadius: 7, border: `1px solid ${palette.border}`, background: palette.bgCard, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: palette.textMid, flexShrink: 0 }}>
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button onClick={() => onDuplicate(idx)} title="Duplicar tamaño"
            style={{ width: 30, height: 30, borderRadius: 7, border: `1px solid ${palette.border}`, background: palette.bgCard, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: palette.accent3, flexShrink: 0 }}>
            <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          </button>
          <button onClick={() => onRemove(idx)}
            style={{ width: 30, height: 30, borderRadius: 7, border: `1px solid ${palette.border}`, background: palette.bgCard, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#EF4444", flexShrink: 0 }}>
            <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>

      {!collapsed && (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={labelStyle}>Ingredientes y cantidades</span>
              <button onClick={addIng} style={{ fontSize: 11, fontWeight: 600, color: palette.primary, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 3, fontFamily: "'DM Sans', sans-serif" }}>
                <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Añadir
              </button>
            </div>
            {tamaño.ingredientes.length === 0 && (
              <div style={{ fontSize: 11, color: palette.textLight, padding: "8px 0", textAlign: "center" }}>Sin ingredientes — pulsa Añadir</div>
            )}
            {tamaño.ingredientes.map((ing, i) => {
              const mp = materiasPrimas.find(m => m.idMateriaPrima === Number(ing.idMateriaPrima));
              return (
                <div key={i} style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 88px 42px" : "2fr 1fr auto", gap: 8, alignItems: "center" }}>
                  <select value={ing.idMateriaPrima} onChange={e => updateIng(i, "idMateriaPrima", Number(e.target.value))}
                    style={{ ...inputStyle, appearance: "none", fontSize: 12 }}
                    onFocus={e => e.target.style.borderColor = palette.primaryMid}
                    onBlur={e => e.target.style.borderColor = palette.border}>
                    {materiasPrimas.map(m => <option key={m.idMateriaPrima} value={m.idMateriaPrima}>{m.nombre} ({m.unidad})</option>)}
                  </select>
                  <div style={{ position: "relative" }}>
                    <input type="number" min="0" step="0.01" value={ing.cantidadUsada}
                      onChange={e => updateIng(i, "cantidadUsada", e.target.value)}
                      placeholder="180" style={{ ...inputStyle, paddingRight: mp ? 32 : 10, fontSize: 12 }}
                      onFocus={e => e.target.style.borderColor = palette.primaryMid}
                      onBlur={e => e.target.style.borderColor = palette.border} />
                    {mp && <span style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", fontSize: 10, color: palette.textLight, pointerEvents: "none" }}>{mp.unidad}</span>}
                  </div>
                  <button onClick={() => removeIng(i)} style={{ width: isMobile ? 42 : 28, height: isMobile ? 40 : 28, borderRadius: 10, border: `1px solid ${palette.border}`, background: palette.bgCard, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#EF4444", flexShrink: 0 }}>
                    <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              );
            })}
          </div>

          <div style={{ fontSize: 10, fontWeight: 700, color: palette.primary, letterSpacing: "0.8px", textTransform: "uppercase", paddingBottom: 4, borderBottom: `1px solid ${palette.border}`, marginTop: 4, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>Plantilla de elaboración</span>
            <button onClick={addPaso} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: palette.primary, background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "'DM Sans', sans-serif", textTransform: "none", letterSpacing: 0 }}>
              <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              Añadir paso
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={labelStyle}>Nombre plantilla</label>
              <input type="text" value={tamaño.nombrePlantilla} onChange={e => onChange(idx, "nombrePlantilla", e.target.value)}
                placeholder={tamaño.descripcionTamaño || "Nombre de la plantilla..."}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = palette.primaryMid}
                onBlur={e => e.target.style.borderColor = palette.border} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={labelStyle}>Descripción plantilla</label>
              <input type="text" value={tamaño.descripcionPlantilla} onChange={e => onChange(idx, "descripcionPlantilla", e.target.value)}
                placeholder="Proceso de 3 días..."
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = palette.primaryMid}
                onBlur={e => e.target.style.borderColor = palette.border} />
            </div>
          </div>

          {(tamaño.pasos || []).length === 0 && (
            <div style={{ fontSize: 11, color: palette.textLight, padding: "8px 0", textAlign: "center" }}>Pulsa "Añadir paso" para definir los pasos de elaboración</div>
          )}

          {(tamaño.pasos || []).map((paso, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: isMobile ? "28px 1fr 86px 38px" : "1fr auto auto", gap: 8, alignItems: "center", background: palette.bgCard, borderRadius: 9, border: `1px solid ${palette.border}`, padding: "8px 10px" }}>
              <div style={{ display: isMobile ? "contents" : "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: isMobile ? 28 : 18, height: isMobile ? 28 : 18, borderRadius: "50%", background: palette.primaryLt, border: `1px solid ${palette.primary}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: isMobile ? 12 : 8, fontWeight: 700, color: palette.primary, flexShrink: 0 }}>{i + 1}</span>
                <input value={paso.nombre} onChange={e => updatePaso(i, "nombre", e.target.value)}
                  placeholder="Ej: Hacer el bizcocho..."
                  style={{ ...inputStyle, fontSize: 12 }}
                  onFocus={e => e.target.style.borderColor = palette.primaryMid}
                  onBlur={e => e.target.style.borderColor = palette.border} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <span style={{ fontSize: 9, color: palette.textLight, whiteSpace: "nowrap" }}>Días antes</span>
                <input type="number" min="0" value={paso.diasAntesEntrega} onChange={e => updatePaso(i, "diasAntesEntrega", e.target.value)}
                  style={{ ...inputStyle, width: 60, fontSize: 12, textAlign: "center" }}
                  onFocus={e => e.target.style.borderColor = palette.primaryMid}
                  onBlur={e => e.target.style.borderColor = palette.border} />
              </div>
              <button onClick={() => removePaso(i)} style={{ width: isMobile ? 38 : 30, height: isMobile ? 38 : 34, borderRadius: 10, border: `1px solid ${palette.border}`, background: palette.bgCard, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#EF4444", flexShrink: 0 }}>
                <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          ))}

          {(tamaño.pasos || []).length > 0 && (
            <div style={{ background: palette.accent3Lt, borderRadius: 8, padding: "8px 12px", fontSize: 11, color: palette.accent3, display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              "Días antes" indica cuántos días antes de la entrega se realiza ese paso.
            </div>
          )}
        </>
      )}
    </div>
  );
}
