import { useState, useEffect } from "react";
import palette from "../../../theme/palette";
import { pedidosApi } from "../../../services/api";
import { estadoStyle, formatFecha, AVATAR_COLORS } from "../clientesUtils";

export default function VistaClienteModal({ cliente, idx, onClose, onEditar }) {
  const [pedidos, setPedidos] = useState([]);
  const [loadingPedidos, setLoadingPedidos] = useState(true);
  const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];

  useEffect(() => {
    pedidosApi.getAll()
      .then((data) => setPedidos(data.filter((p) => p.idCliente === cliente.id)))
      .catch(() => {})
      .finally(() => setLoadingPedidos(false));
  }, []);

  const pedidosEntregados = pedidos.filter((p) => p.estado === "Entregado").length;

  return (
    <div style={{ position: "fixed", inset: 0, background: "oklch(0% 0 0 / 0.4)", zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: 16, overflowY: "auto" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: palette.bgCard, borderRadius: 18, border: `1px solid ${palette.border}`, boxShadow: "0 8px 32px oklch(0% 0 0 / 0.14)", width: "100%", maxWidth: 500, margin: "auto" }}>

        <div style={{ background: `${color}12`, borderRadius: "18px 18px 0 0", padding: "24px", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 54, height: 54, borderRadius: "50%", background: `${color}22`, border: `2px solid ${color}55`, display: "flex", alignItems: "center", justifyContent: "center", color, fontWeight: 700, fontSize: 18, flexShrink: 0 }}>
            {cliente.nombre.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 20, color: palette.textDark, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cliente.nombre}</div>
            <div style={{ fontSize: 11.5, color: palette.textMid, marginTop: 2 }}>{pedidos.length} pedido{pedidos.length !== 1 ? "s" : ""} · {pedidosEntregados} entregado{pedidosEntregados !== 1 ? "s" : ""}</div>
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <button onClick={() => { onClose(); onEditar(cliente); }}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 20, border: "none", background: palette.primary, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: `0 2px 8px ${palette.primary}55` }}>
              <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              Editar
            </button>
            <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.08)", color: palette.textDark, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        <div style={{ padding: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            {[
              { icon: <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke={palette.textLight} strokeWidth={1.7}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>, label: "Correo", value: cliente.email },
              { icon: <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke={palette.textLight} strokeWidth={1.7}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>, label: "Teléfono", value: cliente.telefono },
              { icon: <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke={palette.textLight} strokeWidth={1.7}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, label: "Dirección", value: cliente.direccion },
            ].map(({ icon, label, value }) => value && value !== "—" ? (
              <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: palette.bg, border: `1px solid ${palette.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {icon}
                </div>
                <div>
                  <div style={{ fontSize: 9.5, fontWeight: 700, color: palette.textLight, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
                  <div style={{ fontSize: 13, color: palette.textDark, marginTop: 1 }}>{value}</div>
                </div>
              </div>
            ) : null)}
            {cliente.notas && (
              <div style={{ background: palette.bg, borderRadius: 8, border: `1px solid ${palette.border}`, padding: "8px 12px" }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, color: palette.textLight, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 3 }}>Notas</div>
                <div style={{ fontSize: 12.5, color: palette.textMid, lineHeight: 1.5 }}>{cliente.notas}</div>
              </div>
            )}
          </div>

          <div style={{ fontSize: 11, fontWeight: 700, color: palette.primary, letterSpacing: "0.8px", textTransform: "uppercase", paddingBottom: 4, borderBottom: `1px solid ${palette.border}`, marginBottom: 12 }}>
            Historial de pedidos ({pedidos.length})
          </div>

          {loadingPedidos ? (
            <div style={{ textAlign: "center", padding: "16px 0", color: palette.textLight, fontSize: 13 }}>Cargando...</div>
          ) : pedidos.length === 0 ? (
            <div style={{ fontSize: 12, color: palette.textLight, textAlign: "center", padding: "16px 0", fontStyle: "italic" }}>Sin pedidos aún</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {pedidos.slice().sort((a, b) => b.idPedido - a.idPedido).map((p) => {
                const es = estadoStyle[p.estado] || estadoStyle["Pendiente"];
                return (
                  <div key={p.idPedido} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: palette.bg, borderRadius: 8, border: `1px solid ${palette.border}`, padding: "9px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: palette.textDark, fontVariantNumeric: "tabular-nums" }}>#{String(p.idPedido).padStart(4, "0")}</span>
                      <span style={{ fontSize: 11, color: palette.textMid }}>{formatFecha(p.fechaEntrega)}</span>
                    </div>
                    <span style={{ display: "inline-flex", padding: "2px 8px", borderRadius: 20, background: es.bg, color: es.color, fontSize: 10.5, fontWeight: 600 }}>{p.estado}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
