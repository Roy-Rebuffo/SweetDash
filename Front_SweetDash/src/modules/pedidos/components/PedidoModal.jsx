import { useState, useEffect } from "react";
import palette from "../../../theme/palette";
import { pedidosApi, clientesApi, productosApi, tareasApi, recetasTamañoApi } from "../../../services/api";
import { formatFecha, parseFechaLocal, ESTADOS } from "../../../utils/helpers";

export default function PedidoModal({ pedido, onClose, onSaved, onNecesitaAviso }) {
  const isEdit = !!pedido;

  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [tamanosMap, setTamanosMap] = useState({});
  const [loadingData, setLoadingData] = useState(true);

  const [idCliente, setIdCliente] = useState(pedido?.idCliente || "");
  const [fechaEntrega, setFechaEntrega] = useState(pedido ? formatFecha(pedido.fechaEntrega) : "");
  const [estado, setEstado] = useState(pedido?.estado || "Pendiente");
  const [lineas, setLineas] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([clientesApi.getAll(), productosApi.getAll()])
      .then(([c, p]) => { setClientes(c); setProductos(p); })
      .finally(() => setLoadingData(false));

    if (isEdit) {
      pedidosApi.getDetalles(pedido.idPedido).then((detalles) => {
        setLineas(detalles.map((d) => ({
          idProducto: d.idProducto,
          nombreProducto: d.nombreProducto,
          cantidad: d.cantidad,
          precioCongelado: d.precioCongelado,
          notas: d.notas || "",
          idRecetaTamaño: null,
        })));
      }).catch(() => {});
    }
  }, []);

  const cargarTamanos = async (idProducto) => {
    if (tamanosMap[idProducto]) return;
    try {
      const tams = await recetasTamañoApi.getByProducto(idProducto);
      setTamanosMap(m => ({ ...m, [idProducto]: tams || [] }));
    } catch {
      setTamanosMap(m => ({ ...m, [idProducto]: [] }));
    }
  };

  const addLinea = () => {
    if (productos.length === 0) return;
    const p = productos[0];
    cargarTamanos(p.idProducto);
    setLineas((l) => [...l, { idProducto: p.idProducto, nombreProducto: p.nombre, cantidad: 1, precioCongelado: p.precioBase, notas: "", idRecetaTamaño: null }]);
  };

  const removeLinea = (idx) => setLineas((l) => l.filter((_, i) => i !== idx));

  const updateLinea = (idx, key, value) => {
    setLineas((l) => l.map((item, i) => {
      if (i !== idx) return item;
      if (key === "idProducto") {
        const prod = productos.find((p) => p.idProducto === Number(value));
        cargarTamanos(Number(value));
        return { ...item, idProducto: Number(value), nombreProducto: prod?.nombre || "", precioCongelado: prod?.precioBase || 0, idRecetaTamaño: null };
      }
      if (key === "idRecetaTamaño") {
        const tams = tamanosMap[item.idProducto] || [];
        const tam = tams.find(t => t.id === Number(value));
        return { ...item, idRecetaTamaño: Number(value), precioCongelado: tam?.precioVenta ?? item.precioCongelado };
      }
      return { ...item, [key]: value };
    }));
  };

  const handleSubmit = async () => {
    if (!idCliente) { setError("Selecciona un cliente"); return; }
    if (!fechaEntrega) { setError("La fecha de entrega es obligatoria"); return; }
    if (lineas.length === 0) { setError("Añade al menos un producto"); return; }

    setSaving(true); setError(null);
    try {
      let pedidoId;
      const payload = { idCliente: Number(idCliente), fechaEntrega, estado };
      if (isEdit) {
        await pedidosApi.update(pedido.idPedido, payload);
        pedidoId = pedido.idPedido;
      } else {
        const nuevo = await pedidosApi.create(payload);
        pedidoId = nuevo.idPedido;
      }
      for (const l of lineas) {
        await pedidosApi.addDetalle(pedidoId, {
          idProducto: l.idProducto,
          cantidad: Number(l.cantidad),
          precioCongelado: Number(l.precioCongelado),
          notas: l.notas,
          idRecetaTamaño: l.idRecetaTamaño || null,
        });
      }

      const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
      const tareas = await tareasApi.getByPedido(pedidoId);
      const tareasPasado = tareas.filter((t) => {
        if (!t.fechaEjecucion) return false;
        const fecha = parseFechaLocal(String(t.fechaEjecucion).slice(0, 10));
        fecha.setHours(0, 0, 0, 0);
        return !isNaN(fecha) && fecha < hoy;
      });

      if (tareasPasado.length > 0) {
        onNecesitaAviso({ pedidoId, idCliente: Number(idCliente), fechaEntrega, tareas, tareasPasado });
      } else {
        onSaved();
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = { height: 36, borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.bg, padding: "0 12px", fontSize: 13, color: palette.textDark, fontFamily: "'DM Sans', sans-serif", width: "100%" };
  const labelStyle = { fontSize: 11, fontWeight: 600, color: palette.textLight, letterSpacing: "0.5px", textTransform: "uppercase" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "oklch(0% 0 0 / 0.35)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, overflowY: "auto" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: palette.bgCard, borderRadius: 18, border: `1px solid ${palette.border}`, boxShadow: "0 8px 32px oklch(0% 0 0 / 0.12)", width: "100%", maxWidth: 560, padding: 28, margin: "auto" }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: palette.textDark }}>{isEdit ? "Editar pedido" : "Nuevo pedido"}</div>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${palette.border}`, background: palette.bg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: palette.textLight }}>
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {loadingData ? (
          <div style={{ textAlign: "center", padding: "32px 0", color: palette.textLight, fontSize: 13 }}>Cargando datos...</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={labelStyle}>Cliente</label>
              <select value={idCliente} onChange={(e) => setIdCliente(e.target.value)}
                style={{ ...inputStyle, appearance: "none" }}
                onFocus={(e) => (e.target.style.borderColor = palette.primaryMid)}
                onBlur={(e) => (e.target.style.borderColor = palette.border)}>
                <option value="">Selecciona un cliente...</option>
                {clientes.map((c) => <option key={c.idCliente} value={c.idCliente}>{c.nombre} {c.apellidos}</option>)}
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={labelStyle}>Fecha de entrega</label>
                <input type="date" value={fechaEntrega} onChange={(e) => setFechaEntrega(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = palette.primaryMid)}
                  onBlur={(e) => (e.target.style.borderColor = palette.border)} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={labelStyle}>Estado</label>
                <select value={estado} onChange={(e) => setEstado(e.target.value)}
                  style={{ ...inputStyle, appearance: "none" }}
                  onFocus={(e) => (e.target.style.borderColor = palette.primaryMid)}
                  onBlur={(e) => (e.target.style.borderColor = palette.border)}>
                  {ESTADOS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <label style={labelStyle}>Productos</label>
                <button onClick={addLinea} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, fontWeight: 600, color: palette.primary, background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "'DM Sans', sans-serif" }}>
                  <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  Añadir producto
                </button>
              </div>

              {lineas.length === 0 && (
                <div style={{ padding: "16px", textAlign: "center", color: palette.textLight, fontSize: 12, background: palette.bg, borderRadius: 8, border: `1px dashed ${palette.border}` }}>
                  Pulsa "Añadir producto" para incluir artículos en el pedido
                </div>
              )}

              {lineas.map((l, idx) => {
                const tamsLinea = tamanosMap[l.idProducto] || [];
                return (
                  <div key={idx} style={{ background: palette.bg, borderRadius: 10, border: `1px solid ${palette.border}`, padding: "12px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8, alignItems: "start", marginBottom: 8 }}>
                      <select value={l.idProducto || ""} onChange={(e) => updateLinea(idx, "idProducto", e.target.value)}
                        style={{ ...inputStyle, fontSize: 12 }}
                        onFocus={(e) => (e.target.style.borderColor = palette.primaryMid)}
                        onBlur={(e) => (e.target.style.borderColor = palette.border)}>
                        {productos.map((p) => <option key={p.idProducto} value={p.idProducto}>{p.nombre}</option>)}
                      </select>
                      <button onClick={() => removeLinea(idx)} style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.bgCard, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#EF4444", flexShrink: 0 }}>
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>

                    {tamsLinea.length > 0 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 8 }}>
                        <label style={{ ...labelStyle, fontSize: 10 }}>Tamaño</label>
                        <select value={l.idRecetaTamaño || ""} onChange={(e) => updateLinea(idx, "idRecetaTamaño", e.target.value)}
                          style={{ ...inputStyle, fontSize: 12, appearance: "none" }}
                          onFocus={(e) => (e.target.style.borderColor = palette.primaryMid)}
                          onBlur={(e) => (e.target.style.borderColor = palette.border)}>
                          <option value="">Sin tamaño específico</option>
                          {tamsLinea.map(t => (
                            <option key={t.id} value={t.id}>
                              {t.descripcionTamaño || `Tamaño ${t.id}`}{t.precioVenta ? ` — € ${Number(t.precioVenta).toFixed(2)}` : ""}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <label style={{ ...labelStyle, fontSize: 10 }}>Cantidad</label>
                        <input type="number" min="1" value={l.cantidad} onChange={(e) => updateLinea(idx, "cantidad", e.target.value)}
                          style={{ ...inputStyle, fontSize: 12 }}
                          onFocus={(e) => (e.target.style.borderColor = palette.primaryMid)}
                          onBlur={(e) => (e.target.style.borderColor = palette.border)} />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <label style={{ ...labelStyle, fontSize: 10 }}>Precio (€)</label>
                        <input type="number" min="0" step="0.01" value={l.precioCongelado} onChange={(e) => updateLinea(idx, "precioCongelado", e.target.value)}
                          style={{ ...inputStyle, fontSize: 12 }}
                          onFocus={(e) => (e.target.style.borderColor = palette.primaryMid)}
                          onBlur={(e) => (e.target.style.borderColor = palette.border)} />
                      </div>
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <input type="text" placeholder="Notas (opcional)..." value={l.notas} onChange={(e) => updateLinea(idx, "notas", e.target.value)}
                        style={{ ...inputStyle, fontSize: 12 }}
                        onFocus={(e) => (e.target.style.borderColor = palette.primaryMid)}
                        onBlur={(e) => (e.target.style.borderColor = palette.border)} />
                    </div>
                    <div style={{ marginTop: 6, textAlign: "right", fontSize: 12, fontWeight: 700, color: palette.primary }}>
                      Subtotal: € {(Number(l.cantidad) * Number(l.precioCongelado)).toFixed(2)}
                    </div>
                  </div>
                );
              })}

              {lineas.length > 0 && (
                <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: palette.textDark }}>
                    Total: € {lineas.reduce((acc, l) => acc + Number(l.cantidad) * Number(l.precioCongelado), 0).toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            {error && <div style={{ fontSize: 12, color: "#EF4444", background: "#FEF2F2", borderRadius: 8, padding: "8px 12px" }}>{error}</div>}

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={onClose} style={{ padding: "8px 18px", borderRadius: 10, border: `1px solid ${palette.border}`, background: palette.bg, fontSize: 13, fontWeight: 600, color: palette.textMid, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                Cancelar
              </button>
              <button onClick={handleSubmit} disabled={saving} style={{ padding: "8px 18px", borderRadius: 10, border: "none", background: palette.primary, fontSize: 13, fontWeight: 600, color: "#fff", cursor: saving ? "default" : "pointer", opacity: saving ? 0.7 : 1, fontFamily: "'DM Sans', sans-serif", boxShadow: `0 2px 10px ${palette.primary}33` }}>
                {saving ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear pedido"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
