import { useState } from "react";
import palette from "../../../theme/palette";
import { clientesApi } from "../../../services/api";
import useIsMobile from "../../../hooks/useIsMobile";

const EMPTY_FORM = { nombre: "", apellidos: "", email: "", telefono: "", direccion: "", notas: "" };

export default function ClienteModal({ cliente, onClose, onSaved }) {
  const isMobile = useIsMobile();
  const isEdit = !!cliente;
  const [form,    setForm]    = useState(
    isEdit
      ? { nombre: cliente._nombre, apellidos: cliente._apellidos, email: cliente.email === "—" ? "" : cliente.email, telefono: cliente.telefono === "—" ? "" : cliente.telefono, direccion: cliente.direccion === "—" ? "" : cliente.direccion, notas: cliente.notas }
      : EMPTY_FORM
  );
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState(null);

  const field = (key, label, placeholder, type = "text") => (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: palette.textLight, letterSpacing: "0.5px", textTransform: "uppercase" }}>{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        style={{ height: 36, borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.bg, padding: "0 12px", fontSize: 13, color: palette.textDark, fontFamily: "'DM Sans', sans-serif", width: "100%", boxSizing: "border-box" }}
        onFocus={(e) => (e.target.style.borderColor = palette.primaryMid)}
        onBlur={(e)  => (e.target.style.borderColor = palette.border)}
      />
    </div>
  );

  const handleSubmit = async () => {
    if (!form.nombre.trim()) { setError("El nombre es obligatorio"); return; }
    setSaving(true);
    setError(null);
    try {
      const payload = { ...form };
      if (isEdit) await clientesApi.update(cliente.id, payload);
      else        await clientesApi.create(payload);
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
      <div style={{ background: palette.bgCard, borderRadius: 18, border: `1px solid ${palette.border}`, boxShadow: "0 8px 32px oklch(0% 0 0 / 0.12)", width: "100%", maxWidth: 480, padding: 28 }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: palette.textDark }}>{isEdit ? "Editar cliente" : "Nuevo cliente"}</div>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${palette.border}`, background: palette.bg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: palette.textLight }}>
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
            {field("nombre",    "Nombre",    "Ana")}
            {field("apellidos", "Apellidos", "García López")}
          </div>
          {field("email",     "Email",     "ana@ejemplo.com", "email")}
          {field("telefono",  "Teléfono",  "+34 600 000 000", "tel")}
          {field("direccion", "Dirección", "Calle Mayor, 1")}
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: palette.textLight, letterSpacing: "0.5px", textTransform: "uppercase" }}>Notas</label>
            <textarea
              value={form.notas}
              onChange={(e) => setForm((f) => ({ ...f, notas: e.target.value }))}
              placeholder="Observaciones del cliente..."
              rows={3}
              style={{ borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.bg, padding: "8px 12px", fontSize: 13, color: palette.textDark, fontFamily: "'DM Sans', sans-serif", resize: "vertical", width: "100%", boxSizing: "border-box" }}
              onFocus={(e) => (e.target.style.borderColor = palette.primaryMid)}
              onBlur={(e)  => (e.target.style.borderColor = palette.border)}
            />
          </div>
        </div>

        {error && <div style={{ marginTop: 12, fontSize: 12, color: "#EF4444", background: "#FEF2F2", borderRadius: 8, padding: "8px 12px" }}>{error}</div>}

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 22 }}>
          <button onClick={onClose} style={{ padding: "8px 18px", borderRadius: 10, border: `1px solid ${palette.border}`, background: palette.bg, fontSize: 13, fontWeight: 600, color: palette.textMid, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
            Cancelar
          </button>
          <button onClick={handleSubmit} disabled={saving} style={{ padding: "8px 18px", borderRadius: 10, border: "none", background: palette.primary, fontSize: 13, fontWeight: 600, color: "#fff", cursor: saving ? "default" : "pointer", opacity: saving ? 0.7 : 1, fontFamily: "'DM Sans', sans-serif", boxShadow: `0 2px 10px ${palette.primary}33` }}>
            {saving ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear cliente"}
          </button>
        </div>
      </div>
    </div>
  );
}
