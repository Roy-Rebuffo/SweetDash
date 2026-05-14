import palette from "../../../theme/palette";

export function ConfirmModal({ nombre, onClose, onConfirm, loading }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "oklch(0% 0 0 / 0.35)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: palette.bgCard, borderRadius: 18, border: `1px solid ${palette.border}`, boxShadow: "0 8px 32px oklch(0% 0 0 / 0.12)", width: "100%", maxWidth: 360, padding: 28 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: palette.textDark, marginBottom: 10 }}>Eliminar receta</div>
        <div style={{ fontSize: 13, color: palette.textMid, marginBottom: 22 }}>¿Seguro que quieres eliminar <b>{nombre}</b>? Se eliminará el producto, su plantilla y sus escandallos de coste. Esta acción no se puede deshacer.</div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "8px 18px", borderRadius: 10, border: `1px solid ${palette.border}`, background: palette.bg, fontSize: 13, fontWeight: 600, color: palette.textMid, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Cancelar</button>
          <button onClick={onConfirm} disabled={loading} style={{ padding: "8px 18px", borderRadius: 10, border: "none", background: "#EF4444", fontSize: 13, fontWeight: 600, color: "#fff", cursor: loading ? "default" : "pointer", opacity: loading ? 0.7 : 1, fontFamily: "'DM Sans', sans-serif" }}>
            {loading ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ConflictoRecetaModal({ producto, conflictos, onCancelarBorrado, onCancelarPedidos, onEditarPedido, loading }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "oklch(0% 0 0 / 0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, overflowY: "auto" }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancelarBorrado(); }}>
      <div style={{ background: palette.bgCard, borderRadius: 18, border: `1px solid ${palette.border}`, boxShadow: "0 8px 32px oklch(0% 0 0 / 0.16)", width: "100%", maxWidth: 460, padding: 28, margin: "auto" }}>

        {/* Icono + título */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: palette.accent2Lt, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke={palette.accent2} strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: palette.textDark }}>¡Esta receta está en pedidos activos!</div>
            <div style={{ fontSize: 11.5, color: palette.textLight, marginTop: 2 }}>Hay tareas pendientes vinculadas a este producto</div>
          </div>
        </div>

        <div style={{ fontSize: 13, color: palette.textMid, marginBottom: 14, lineHeight: 1.6 }}>
          <b>{producto.nombre}</b> se usa en {conflictos.length} pedido{conflictos.length !== 1 ? "s" : ""} con tareas aún sin completar:
        </div>

        {/* Lista de pedidos afectados */}
        <div style={{ background: palette.bg, borderRadius: 10, border: `1px solid ${palette.border}`, padding: "10px 14px", marginBottom: 20, display: "flex", flexDirection: "column", gap: 5 }}>
          {conflictos.map((p) => (
            <div key={p.idPedido} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12 }}>
              <span style={{ fontWeight: 600, color: palette.textDark }}>Pedido #{String(p.idPedido).padStart(4, "0")}</span>
              <span style={{ color: palette.textMid }}>{p.nombreCliente || ""} · <span style={{ color: palette.accent2, fontWeight: 600 }}>{p.estado}</span></span>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 11.5, fontWeight: 700, color: palette.textLight, letterSpacing: "0.4px", textTransform: "uppercase", marginBottom: 10 }}>¿Qué quieres hacer?</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {/* Opción 1: Ir a editar el pedido */}
          <button onClick={onEditarPedido}
            style={{ padding: "11px 16px", borderRadius: 10, border: `1px solid ${palette.border}`, background: palette.bg, fontSize: 13, fontWeight: 600, color: palette.textDark, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textAlign: "left", display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke={palette.primary} strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <div>
              <div style={{ color: palette.primary }}>Ir a editar el pedido</div>
              <div style={{ fontSize: 11, fontWeight: 400, color: palette.textLight, marginTop: 1 }}>Cambia el producto del pedido y luego borra esta receta</div>
            </div>
          </button>

          {/* Opción 2: Cancelar los pedidos afectados y borrar */}
          <button onClick={onCancelarPedidos} disabled={loading}
            style={{ padding: "11px 16px", borderRadius: 10, border: `1px solid #FECACA`, background: "#FEF2F2", fontSize: 13, fontWeight: 600, color: "#B91C1C", cursor: loading ? "default" : "pointer", opacity: loading ? 0.7 : 1, fontFamily: "'DM Sans', sans-serif", textAlign: "left", display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#B91C1C" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <div>
              <div>{loading ? "Eliminando..." : `Cancelar ${conflictos.length > 1 ? "los pedidos afectados" : "el pedido"} y borrar la receta`}</div>
              <div style={{ fontSize: 11, fontWeight: 400, color: "#DC2626", marginTop: 1 }}>La receta ya no existirá y los pedidos quedarán eliminados</div>
            </div>
          </button>

          {/* Opción 3: No borrar nada */}
          <button onClick={onCancelarBorrado}
            style={{ padding: "11px 16px", borderRadius: 10, border: `1px solid ${palette.border}`, background: palette.bg, fontSize: 13, fontWeight: 600, color: palette.textMid, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textAlign: "left", display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke={palette.textMid} strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <div>
              <div>Cancelar el proceso de borrado</div>
              <div style={{ fontSize: 11, fontWeight: 400, color: palette.textLight, marginTop: 1 }}>La receta y los pedidos seguirán como están</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
