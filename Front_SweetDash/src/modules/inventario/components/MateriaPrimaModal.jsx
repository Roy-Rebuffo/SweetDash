import { useState } from "react";
import palette from "../../../theme/palette";
import { materiasPrimasApi } from "../../../services/api";

const EMPTY_MP = { nombre: "", cantidadStock: "", stockMaximo: "", unidad: "", fechaCaducidad: "", precioPaquete: "", unidadesPaquete: "" };

export default function MateriaPrimaModal({ item, onClose, onSaved }) {
  const isEdit = !!item;
  const [form, setForm] = useState(isEdit ? {
    nombre: item.nombre,
    cantidadStock: item.stock,
    stockMaximo: item.stockMax,
    unidad: item.unidad,
    fechaCaducidad: item.caducidad ? item.caducidad.slice(0, 10) : "",
    precioPaquete: item.precioPaquete ?? "",
    unidadesPaquete: item.unidadesPaquete ?? "",
  } : EMPTY_MP);

  const [tieneCaducidad, setTieneCaducidad] = useState(isEdit ? !!item.caducidad : false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const inputStyle = { height: 36, borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.bg, padding: "0 12px", fontSize: 13, color: palette.textDark, fontFamily: "'DM Sans', sans-serif", width: "100%" };
  const labelStyle = { fontSize: 11, fontWeight: 600, color: palette.textLight, letterSpacing: "0.5px", textTransform: "uppercase" };

  const handleSubmit = async () => {
    if (!form.nombre.trim()) { setError("El nombre es obligatorio"); return; }
    if (!form.unidad.trim()) { setError("La unidad es obligatoria"); return; }
    if (form.cantidadStock === "") { setError("La cantidad es obligatoria"); return; }
    setSaving(true); setError(null);
    try {
      const payload = {
        nombre: form.nombre,
        cantidadStock: Number(form.cantidadStock),
        stockMaximo: Number(form.stockMaximo) || 0,
        unidad: form.unidad,
        fechaCaducidad: tieneCaducidad ? (form.fechaCaducidad || null) : null,
        precioPaquete: Number(form.precioPaquete) || 0,
        unidadesPaquete: Number(form.unidadesPaquete) || 1,
      };
      if (isEdit) await materiasPrimasApi.update(item.rawId, payload);
      else await materiasPrimasApi.create(payload);
      onSaved();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "oklch(0% 0 0 / 0.35)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: palette.bgCard, borderRadius: 18, border: `1px solid ${palette.border}`, boxShadow: "0 8px 32px oklch(0% 0 0 / 0.12)", width: "100%", maxWidth: 460, padding: 28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: palette.textDark }}>{isEdit ? "Editar materia prima" : "Nueva materia prima"}</div>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${palette.border}`, background: palette.bg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: palette.textLight }}>
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={labelStyle}>Nombre</label>
            <input value={form.nombre} onChange={(e) => setForm(f => ({ ...f, nombre: e.target.value }))} placeholder="Harina de trigo..." style={inputStyle} onFocus={(e) => (e.target.style.borderColor = palette.primaryMid)} onBlur={(e) => (e.target.style.borderColor = palette.border)} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={labelStyle}>Stock actual</label>
              <input type="number" min="0" step="0.01" value={form.cantidadStock} onChange={(e) => setForm(f => ({ ...f, cantidadStock: e.target.value }))} placeholder="0" style={inputStyle} onFocus={(e) => (e.target.style.borderColor = palette.primaryMid)} onBlur={(e) => (e.target.style.borderColor = palette.border)} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={labelStyle}>Stock máximo</label>
              <input type="number" min="0" step="0.01" value={form.stockMaximo} onChange={(e) => setForm(f => ({ ...f, stockMaximo: e.target.value }))} placeholder="0" style={inputStyle} onFocus={(e) => (e.target.style.borderColor = palette.primaryMid)} onBlur={(e) => (e.target.style.borderColor = palette.border)} />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={labelStyle}>Unidad</label>
            <input value={form.unidad} onChange={(e) => setForm(f => ({ ...f, unidad: e.target.value }))} placeholder="kg, g, L, ud..." style={inputStyle} onFocus={(e) => (e.target.style.borderColor = palette.primaryMid)} onBlur={(e) => (e.target.style.borderColor = palette.border)} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={labelStyle}>Precio paquete (€)</label>
              <input type="number" min="0" step="0.01" value={form.precioPaquete}
                onChange={(e) => setForm(f => ({ ...f, precioPaquete: e.target.value }))}
                placeholder="2.56" style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = palette.primaryMid)}
                onBlur={(e) => (e.target.style.borderColor = palette.border)} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={labelStyle}>Unidades por paquete</label>
              <input type="number" min="0" step="0.01" value={form.unidadesPaquete}
                onChange={(e) => setForm(f => ({ ...f, unidadesPaquete: e.target.value }))}
                placeholder="250" style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = palette.primaryMid)}
                onBlur={(e) => (e.target.style.borderColor = palette.border)} />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none" }}>
              <div onClick={() => setTieneCaducidad(v => !v)}
                style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${tieneCaducidad ? palette.primary : palette.border}`, background: tieneCaducidad ? palette.primary : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s", cursor: "pointer" }}>
                {tieneCaducidad && <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
              </div>
              <span style={{ fontSize: 13, color: palette.textMid, fontWeight: 500 }}>Tiene fecha de caducidad</span>
            </label>
            {tieneCaducidad && (
              <input type="date" value={form.fechaCaducidad} onChange={(e) => setForm(f => ({ ...f, fechaCaducidad: e.target.value }))}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = palette.primaryMid)}
                onBlur={(e) => (e.target.style.borderColor = palette.border)} />
            )}
          </div>
        </div>
        {error && <div style={{ marginTop: 12, fontSize: 12, color: "#EF4444", background: "#FEF2F2", borderRadius: 8, padding: "8px 12px" }}>{error}</div>}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 22 }}>
          <button onClick={onClose} style={{ padding: "8px 18px", borderRadius: 10, border: `1px solid ${palette.border}`, background: palette.bg, fontSize: 13, fontWeight: 600, color: palette.textMid, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Cancelar</button>
          <button onClick={handleSubmit} disabled={saving} style={{ padding: "8px 18px", borderRadius: 10, border: "none", background: palette.primary, fontSize: 13, fontWeight: 600, color: "#fff", cursor: saving ? "default" : "pointer", opacity: saving ? 0.7 : 1, fontFamily: "'DM Sans', sans-serif", boxShadow: `0 2px 10px ${palette.primary}33` }}>
            {saving ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear"}
          </button>
        </div>
      </div>
    </div>
  );
}
