import { useState } from "react";
import palette from "../../../theme/palette";
import { pedidosApi, tareasApi } from "../../../services/api";
import { formatFecha, parseFechaLocal, getNombreCompleto } from "../pedidosUtils";

export default function CambiarFechaModal({ pedido, onClose, onSaved }) {
  const [fecha, setFecha] = useState(formatFecha(pedido.fechaEntrega));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleGuardar = async () => {
    if (!fecha) { setError("Selecciona una fecha"); return; }
    setSaving(true); setError(null);
    try {
      await pedidosApi.update(pedido.idPedido, {
        idCliente: pedido.idCliente,
        fechaEntrega: fecha,
        estado: pedido.estado,
      });

      const tareas = await tareasApi.getByPedido(pedido.idPedido);
      const nuevaEntrega = parseFechaLocal(fecha);

      for (const t of tareas) {
        const nuevaFecha = new Date(nuevaEntrega);
        nuevaFecha.setDate(nuevaFecha.getDate() - (t.diasAntesEntrega || 0));
        const yyyy = nuevaFecha.getFullYear();
        const mm   = String(nuevaFecha.getMonth() + 1).padStart(2, "0");
        const dd   = String(nuevaFecha.getDate()).padStart(2, "0");
        await tareasApi.actualizarFecha(t.idTarea, {
          ...t,
          fechaEjecucion: `${yyyy}-${mm}-${dd}`,
        });
      }

      onSaved();
    } catch (e) {
      console.error("ERROR en handleSubmit:", e);
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "oklch(0% 0 0 / 0.45)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: palette.bgCard, borderRadius: 18, border: `1px solid ${palette.border}`, boxShadow: "0 8px 32px oklch(0% 0 0 / 0.16)", width: "100%", maxWidth: 360, padding: 28 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: palette.textDark, marginBottom: 6 }}>Cambiar fecha de entrega</div>
        <div style={{ fontSize: 12.5, color: palette.textLight, marginBottom: 20 }}>
          Pedido #{String(pedido.idPedido).padStart(4, "0")} — {getNombreCompleto(pedido)}<br />
          <span style={{ fontSize: 11.5, color: palette.textMid, marginTop: 4, display: "block" }}>Las tareas de elaboración se recalcularán automáticamente.</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: palette.textLight, letterSpacing: "0.5px", textTransform: "uppercase" }}>Nueva fecha de entrega</label>
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)}
            style={{ height: 36, borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.bg, padding: "0 12px", fontSize: 13, color: palette.textDark, fontFamily: "'DM Sans', sans-serif", width: "100%" }}
            onFocus={(e) => (e.target.style.borderColor = palette.primaryMid)}
            onBlur={(e) => (e.target.style.borderColor = palette.border)} />
        </div>

        {error && <div style={{ fontSize: 12, color: "#EF4444", background: "#FEF2F2", borderRadius: 8, padding: "8px 12px", marginBottom: 16 }}>{error}</div>}

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "8px 18px", borderRadius: 10, border: `1px solid ${palette.border}`, background: palette.bg, fontSize: 13, fontWeight: 600, color: palette.textMid, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
            Cancelar
          </button>
          <button onClick={handleGuardar} disabled={saving} style={{ padding: "8px 18px", borderRadius: 10, border: "none", background: palette.primary, fontSize: 13, fontWeight: 600, color: "#fff", cursor: saving ? "default" : "pointer", opacity: saving ? 0.7 : 1, fontFamily: "'DM Sans', sans-serif", boxShadow: `0 2px 10px ${palette.primary}33` }}>
            {saving ? "Actualizando..." : "Guardar fecha"}
          </button>
        </div>
      </div>
    </div>
  );
}
