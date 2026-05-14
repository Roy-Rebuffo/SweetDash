import palette from "../../../theme/palette";
import { estadoStyle, formatFecha, getNombreCompleto } from "../pedidosUtils";

export default function VistaPedidoModal({ pedido, detalles, onClose, onEditar }) {
  const es = estadoStyle[pedido.estado] || estadoStyle["Pendiente"];
  const total = detalles.reduce((acc, d) => acc + Number(d.cantidad) * Number(d.precioCongelado || 0), 0);
  const nombreCompleto = getNombreCompleto(pedido);

  return (
    <div style={{ position: "fixed", inset: 0, background: "oklch(0% 0 0 / 0.4)", zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: 16, overflowY: "auto" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: palette.bgCard, borderRadius: 18, border: `1px solid ${palette.border}`, boxShadow: "0 8px 32px oklch(0% 0 0 / 0.14)", width: "100%", maxWidth: 520, margin: "auto" }}>

        <div style={{ background: palette.primaryLt, borderRadius: "18px 18px 0 0", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: palette.textLight, letterSpacing: "0.7px", textTransform: "uppercase", marginBottom: 3 }}>Pedido</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 22, color: palette.textDark }}>#{String(pedido.idPedido).padStart(4, "0")}</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ display: "inline-flex", padding: "4px 12px", borderRadius: 20, background: es.bg, color: es.color, fontSize: 11.5, fontWeight: 600 }}>{pedido.estado}</span>
            <button onClick={() => { onClose(); onEditar(pedido); }}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 20, border: "none", background: palette.primary, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: `0 2px 8px ${palette.primary}55` }}>
              <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              Editar
            </button>
            <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.1)", color: palette.textDark, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        <div style={{ padding: 24 }}>
          <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 160 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: palette.textLight, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>Cliente</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: palette.textDark }}>{nombreCompleto}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: palette.textLight, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>Fecha de entrega</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: palette.textDark }}>{formatFecha(pedido.fechaEntrega)}</div>
            </div>
          </div>

          <div style={{ fontSize: 11, fontWeight: 700, color: palette.primary, letterSpacing: "0.8px", textTransform: "uppercase", paddingBottom: 4, borderBottom: `1px solid ${palette.border}`, marginBottom: 12 }}>
            Productos
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
            {detalles.length === 0 ? (
              <div style={{ fontSize: 12, color: palette.textLight, textAlign: "center", padding: "16px 0", fontStyle: "italic" }}>Sin productos registrados</div>
            ) : (
              detalles.map((d, i) => (
                <div key={i} style={{ background: palette.bg, borderRadius: 10, border: `1px solid ${palette.border}`, padding: "10px 14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: palette.textDark, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {d.nombreProducto || "—"}
                      </div>
                      {d.notas && <div style={{ fontSize: 11, color: palette.textMid, marginTop: 2 }}>{d.notas}</div>}
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 11.5, color: palette.textMid }}>{d.cantidad} × € {Number(d.precioCongelado).toFixed(2)}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: palette.primary }}>€ {(Number(d.cantidad) * Number(d.precioCongelado)).toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {detalles.length > 0 && (
            <div style={{ display: "flex", justifyContent: "flex-end", borderTop: `1px solid ${palette.border}`, paddingTop: 12 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: palette.textDark }}>Total: € {total.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
