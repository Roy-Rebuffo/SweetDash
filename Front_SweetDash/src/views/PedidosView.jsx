import { useState, useEffect } from "react";
import palette from "../theme/palette";
import { pedidosApi, clientesApi, productosApi, tareasApi } from "../services/api";
import FilterSelect from "../components/FilterSelect";

// ── Helpers ───────────────────────────────────────────────────────────────────
const estadoStyle = {
  "Pendiente": { bg: palette.accent2Lt, color: palette.accent2 },
  "En proceso": { bg: palette.accent1Lt, color: palette.accent1 },
  "Preparado": { bg: palette.primaryLt, color: palette.primary },
  "Entregado": { bg: "oklch(93% 0.01 40)", color: "oklch(48% 0.02 40)" },
};

const ESTADOS = ["Pendiente", "En proceso", "Preparado", "Entregado"];
const AVATAR_COLORS = [palette.primary, palette.accent1, palette.accent2, palette.accent3, palette.primaryMid];

function Avatar({ nombre, idx }) {
  const initials = nombre.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];
  return (
    <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${color}1A`, border: `1.5px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", color, fontWeight: 700, fontSize: 10, flexShrink: 0 }}>
      {initials}
    </div>
  );
}

function getNombreCompleto(p) {
  const nombre = (p.nombreCliente || "").trim();
  const apellidos = (p.apellidosCliente || p.apellidos || "").trim();
  return apellidos ? `${nombre} ${apellidos}` : nombre;
}

function formatFecha(iso) {
  if (!iso) return "—";
  return iso.slice(0, 10);
}

function calcularTotal(detalles) {
  if (!detalles || detalles.length === 0) return "—";
  const total = detalles.reduce((acc, d) => acc + d.cantidad * (d.precioCongelado || 0), 0);
  return `€ ${total.toFixed(2)}`;
}

function getProductoLabel(detalles) {
  if (!detalles || detalles.length === 0) return "—";
  const extra = detalles.length - 1;
  return extra > 0 ? `${detalles[0].nombreProducto} +${extra}` : detalles[0].nombreProducto;
}

function parseFechaLocal(str) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d); // mes 0-indexed, sin timezone
}

function StatCard({ label, value, trend, trendColor }) {
  return (
    <div style={{ background: palette.bgCard, borderRadius: 14, border: `1px solid ${palette.border}`, boxShadow: "0 1px 4px oklch(0% 0 0 / 0.04)", padding: "20px 22px" }}>
      <div style={{ fontSize: 10.5, fontWeight: 600, color: palette.textLight, letterSpacing: "0.7px", textTransform: "uppercase", marginBottom: 10 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: palette.textDark, letterSpacing: "-0.5px", lineHeight: 1, marginBottom: 8 }}>{value}</div>
      {trend && (
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: trendColor || palette.accent3, fontWeight: 500 }}>
          <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke={trendColor || palette.accent3} strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          {trend}
        </div>
      )}
    </div>
  );
}

// ── Modal aviso + redistribución manual ───────────────────────────────────────
function AvisoTareasModal({ pedidoId, fechaEntrega, tareas, tareasPasado, onGuardar, onDejarComoEsta, onCambiarFecha, loading }) {
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  const hoyStr = hoy.toISOString().slice(0, 10);

  // Estado: mostrar aviso o formulario de redistribución
  const [paso, setPaso] = useState("aviso"); // "aviso" | "redistribuir"

  // Fechas editables para cada tarea (solo las que están en pasado)
  const [fechasEditadas, setFechasEditadas] = useState(() => {
    const obj = {};
    tareas.forEach((t) => { obj[t.idTarea] = formatFecha(t.fechaEjecucion); });
    return obj;
  });

  const inputStyle = { height: 34, borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.bgCard, padding: "0 10px", fontSize: 12, color: palette.textDark, fontFamily: "'DM Sans', sans-serif", width: "100%" };

  const handleGuardar = () => {
    const tareasActualizadas = tareas.map((t) => ({ ...t, fechaEjecucion: fechasEditadas[t.idTarea] }));
    onGuardar(tareasActualizadas);
  };

  if (paso === "redistribuir") {
    return (
      <div style={{ position: "fixed", inset: 0, background: "oklch(0% 0 0 / 0.45)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, overflowY: "auto" }}>
        <div style={{ background: palette.bgCard, borderRadius: 18, border: `1px solid ${palette.border}`, boxShadow: "0 8px 32px oklch(0% 0 0 / 0.16)", width: "100%", maxWidth: 480, padding: 28, margin: "auto" }}>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: palette.textDark }}>Ajustar fechas de tareas</div>
            <span style={{ fontSize: 11, color: palette.textLight, background: palette.bg, borderRadius: 6, padding: "3px 8px" }}>Entrega: {fechaEntrega}</span>
          </div>

          <div style={{ fontSize: 12.5, color: palette.textMid, marginBottom: 16 }}>
            Asigna la fecha que quieras a cada tarea. Puedes mantener las que ya estén bien.
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            {tareas.map((t) => {
              const esPasado = parseFechaLocal(fechasEditadas[t.idTarea]) < hoy;
              return (
                <div key={t.idTarea} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "center", background: esPasado ? `${palette.accent2Lt}` : palette.bg, borderRadius: 10, border: `1px solid ${esPasado ? palette.accent2 + "44" : palette.border}`, padding: "10px 14px" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: palette.textDark }}>{t.nombreProceso}</div>
                    {esPasado && <div style={{ fontSize: 11, color: palette.accent2, marginTop: 2 }}>⚠️ Esta fecha ya pasó</div>}
                  </div>
                  <input type="date" value={fechasEditadas[t.idTarea]} min={hoyStr}
                    onChange={(e) => setFechasEditadas((f) => ({ ...f, [t.idTarea]: e.target.value }))}
                    style={{ ...inputStyle, width: 140 }}
                    onFocus={(e) => (e.target.style.borderColor = palette.primaryMid)}
                    onBlur={(e) => (e.target.style.borderColor = palette.border)} />
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button onClick={() => setPaso("aviso")} style={{ padding: "8px 18px", borderRadius: 10, border: `1px solid ${palette.border}`, background: palette.bg, fontSize: 13, fontWeight: 600, color: palette.textMid, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Volver
            </button>
            <button onClick={handleGuardar} disabled={loading} style={{ padding: "8px 18px", borderRadius: 10, border: "none", background: palette.primary, fontSize: 13, fontWeight: 600, color: "#fff", cursor: loading ? "default" : "pointer", opacity: loading ? 0.7 : 1, fontFamily: "'DM Sans', sans-serif", boxShadow: `0 2px 10px ${palette.primary}33` }}>
              {loading ? "Guardando..." : "Guardar fechas"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "oklch(0% 0 0 / 0.45)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: palette.bgCard, borderRadius: 18, border: `1px solid ${palette.border}`, boxShadow: "0 8px 32px oklch(0% 0 0 / 0.16)", width: "100%", maxWidth: 440, padding: 28 }}>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: palette.accent2Lt, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke={palette.accent2} strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: palette.textDark }}>Atención — Fechas en el pasado</div>
            <div style={{ fontSize: 11.5, color: palette.textLight, marginTop: 2 }}>Algunas tareas caen en fechas que ya pasaron</div>
          </div>
        </div>

        <div style={{ fontSize: 13, color: palette.textMid, marginBottom: 16, lineHeight: 1.6 }}>
          Este pedido tiene <b>{tareasPasado.length} tarea{tareasPasado.length !== 1 ? "s" : ""}</b> en fechas pasadas. La entrega es el <b>{fechaEntrega}</b>.
        </div>

        <div style={{ background: palette.bg, borderRadius: 10, border: `1px solid ${palette.border}`, padding: "10px 14px", marginBottom: 20, display: "flex", flexDirection: "column", gap: 6 }}>
          {tareasPasado.map((t) => (
            <div key={t.idTarea} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
              <span style={{ color: palette.textDark, fontWeight: 600 }}>{t.nombreProceso}</span>
              <span style={{ color: palette.primary }}>{formatFecha(t.fechaEjecucion)}</span>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 12, fontWeight: 700, color: palette.textLight, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 10 }}>¿Qué quieres hacer?</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button onClick={() => setPaso("redistribuir")}
            style={{ padding: "11px 16px", borderRadius: 10, border: `1px solid ${palette.primary}`, background: palette.primary, fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textAlign: "left", display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <div>
              <div>Redistribuir fechas manualmente</div>
              <div style={{ fontSize: 11, fontWeight: 400, opacity: 0.85, marginTop: 1 }}>Elige tú misma la fecha de cada tarea</div>
            </div>
          </button>

          <button onClick={onDejarComoEsta}
            style={{ padding: "11px 16px", borderRadius: 10, border: `1px solid ${palette.border}`, background: palette.bg, fontSize: 13, fontWeight: 600, color: palette.textDark, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textAlign: "left", display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke={palette.textMid} strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            <div>
              <div>Dejar como está</div>
              <div style={{ fontSize: 11, fontWeight: 400, color: palette.textLight, marginTop: 1 }}>Mantener las fechas aunque algunas sean pasadas</div>
            </div>
          </button>

          <button onClick={onCambiarFecha}
            style={{ padding: "11px 16px", borderRadius: 10, border: `1px solid ${palette.border}`, background: palette.bg, fontSize: 13, fontWeight: 600, color: palette.textDark, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textAlign: "left", display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke={palette.textMid} strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            <div>
              <div>Cambiar fecha de entrega</div>
              <div style={{ fontSize: 11, fontWeight: 400, color: palette.textLight, marginTop: 1 }}>Modificar solo la fecha de entrega del pedido</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal cambiar solo la fecha de entrega ────────────────────────────────────
function CambiarFechaModal({ pedido, onClose, onSaved }) {
  const [fecha, setFecha] = useState(formatFecha(pedido.fechaEntrega));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleGuardar = async () => {
    if (!fecha) { setError("Selecciona una fecha"); return; }
    setSaving(true); setError(null);
    try {
      // 1. Actualizar fecha de entrega del pedido
      await pedidosApi.update(pedido.idPedido, {
        idCliente: pedido.idCliente,
        fechaEntrega: fecha,
        estado: pedido.estado,
      });

      // 2. Recalcular fechas de las tareas con la nueva fecha de entrega
      const tareas = await tareasApi.getByPedido(pedido.idPedido);
      const nuevaEntrega = parseFechaLocal(fecha);

      for (const t of tareas) {
        const nuevaFecha = new Date(nuevaEntrega);
        nuevaFecha.setDate(nuevaFecha.getDate() - (t.diasAntesEntrega || 0));
        await tareasApi.actualizarFecha(t.idTarea, {
          ...t,
          fechaEjecucion: nuevaFecha.toISOString().slice(0, 10),
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

// ── Modal Pedido ──────────────────────────────────────────────────────────────
function PedidoModal({ pedido, onClose, onSaved, onNecesitaAviso }) {
  const isEdit = !!pedido;

  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
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
        })));
      }).catch(() => { });
    }
  }, []);

  const addLinea = () => {
    if (productos.length === 0) return;
    const p = productos[0];
    setLineas((l) => [...l, { idProducto: p.idProducto, nombreProducto: p.nombre, cantidad: 1, precioCongelado: p.precioBase, notas: "" }]);
  };

  const removeLinea = (idx) => setLineas((l) => l.filter((_, i) => i !== idx));

  const updateLinea = (idx, key, value) => {
    setLineas((l) => l.map((item, i) => {
      if (i !== idx) return item;
      if (key === "idProducto") {
        const prod = productos.find((p) => p.idProducto === Number(value));
        return { ...item, idProducto: Number(value), nombreProducto: prod?.nombre || "", precioCongelado: prod?.precioBase || 0 };
      }
      return { ...item, [key]: value };
    }));
  };

  const handleSubmit = async () => {
    console.log("handleSubmit ejecutado");
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
        });
      }
      console.log("Detalles añadidos, pedidoId:", pedidoId);

      // Comprobar tareas en pasado
      console.log("Detalles añadidos, pedidoId:", pedidoId);
      const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
      const tareas = await tareasApi.getByPedido(pedidoId);
      const tareasPasado = tareas.filter((t) => {
        if (!t.fechaEjecucion) return false;
        const fecha = parseFechaLocal(String(t.fechaEjecucion).slice(0, 10));
        fecha.setHours(0, 0, 0, 0);
        return !isNaN(fecha) && fecha < hoy;
      });

      if (tareasPasado.length > 0) {
        onNecesitaAviso({
          pedidoId: pedidoId,
          idCliente: Number(idCliente),  // ← añadir esto
          fechaEntrega,
          tareas,
          tareasPasado
        });
      } else {
        onSaved();
      }
    } catch (e) {
      console.error("ERROR en handleSubmit:", e);
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

              {lineas.map((l, idx) => (
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
              ))}

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

// ── Modal confirmar borrado ────────────────────────────────────────────────────
function ConfirmModal({ texto, onClose, onConfirm, loading }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "oklch(0% 0 0 / 0.35)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: palette.bgCard, borderRadius: 18, border: `1px solid ${palette.border}`, boxShadow: "0 8px 32px oklch(0% 0 0 / 0.12)", width: "100%", maxWidth: 360, padding: 28 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: palette.textDark, marginBottom: 10 }}>Eliminar pedido</div>
        <div style={{ fontSize: 13, color: palette.textMid, marginBottom: 22 }}>{texto}</div>
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

// ── Vista principal ───────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 7;
const FILTROS = ["Todos", "Pendiente", "En proceso", "Preparado", "Entregado"];

export default function PedidosView({ isMobile = false }) {
  const [pedidos, setPedidos] = useState([]);
  const [detallesMap, setDetallesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editPedido, setEditPedido] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Aviso tareas pasado
  const [avisoData, setAvisoData] = useState(null);
  const [redistribuyendo, setRedistribuyendo] = useState(false);

  // Cambiar fecha
  const [cambiarFechaPedido, setCambiarFechaPedido] = useState(null);

  const cargarPedidos = async () => {
    setLoading(true);
    try {
      const data = await pedidosApi.getAll();
      data.sort((a, b) => b.idPedido - a.idPedido);
      setPedidos(data);
      const map = {};
      await Promise.all(data.map(async (p) => {
        try { map[p.idPedido] = await pedidosApi.getDetalles(p.idPedido); }
        catch { map[p.idPedido] = []; }
      }));
      setDetallesMap(map);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarPedidos(); }, []);

  const handleNuevo = () => { setEditPedido(null); setModalOpen(true); };
  const handleEditar = (p) => { setEditPedido(p); setModalOpen(true); };

  const handleNecesitaAviso = (data) => {
    setModalOpen(false);
    setAvisoData(data);
  };

  const handleSaved = () => {
    setModalOpen(false);
    setAvisoData(null);
    setCambiarFechaPedido(null);
    cargarPedidos();
  };

  // Guardar fechas redistribuidas manualmente
  const handleGuardarFechas = async (tareasActualizadas) => {
    setRedistribuyendo(true);
    try {
      for (const t of tareasActualizadas) {
        await tareasApi.actualizarFecha(t.idTarea, { ...t, fechaEjecucion: t.fechaEjecucion });
      }
      setAvisoData(null);
      cargarPedidos();
    } catch (e) {
      alert("Error al guardar fechas: " + e.message);
    } finally {
      setRedistribuyendo(false);
    }
  };

  const handleDejarComoEsta = () => {
    setAvisoData(null);
    cargarPedidos();
  };

  // Cambiar fecha: abre el modal simple con el pedido del aviso
  const handleCambiarFecha = () => {
    if (!avisoData) return;
    // Buscamos en el array actual, si no está lo construimos con los datos del aviso
    const pedidoEncontrado = pedidos.find((p) => p.idPedido === avisoData.pedidoId);
    const pedidoParaModal = pedidoEncontrado || {
      idPedido: avisoData.pedidoId,
      idCliente: avisoData.idCliente,
      fechaEntrega: avisoData.fechaEntrega,
      estado: "Pendiente",
      nombreCliente: "",
    };
    setAvisoData(null);
    setCambiarFechaPedido(pedidoParaModal);
  };

  const handleEliminar = async () => {
    setDeleting(true);
    try {
      await pedidosApi.delete(deleteTarget.idPedido);
      setDeleteTarget(null);
      cargarPedidos();
    } catch (e) {
      alert("Error al eliminar: " + e.message);
    } finally {
      setDeleting(false);
    }
  };

  const filtrados = pedidos.filter((p) => {
    const matchFiltro = filtro === "Todos" || p.estado === filtro;
    const nombre = getNombreCompleto(p);
    const detalles = detallesMap[p.idPedido] || [];
    const matchSearch =
      nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(p.idPedido).includes(searchTerm) ||
      getProductoLabel(detalles).toLowerCase().includes(searchTerm.toLowerCase());
    return matchFiltro && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtrados.length / ITEMS_PER_PAGE));
  const paginados = filtrados.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const handleFiltro = (f) => { setFiltro(f); setPage(1); };
  const handleSearch = (v) => { setSearchTerm(v); setPage(1); };

  const TODAY = new Date().toISOString().slice(0, 10);
  const pedidosHoy = pedidos.filter((p) => formatFecha(p.fechaEntrega) === TODAY).length;
  const pendientes = pedidos.filter((p) => p.estado === "Pendiente").length;
  const enProceso = pedidos.filter((p) => p.estado === "En proceso").length;
  const ingresosHoy = pedidos
    .filter((p) => formatFecha(p.fechaEntrega) === TODAY)
    .reduce((acc, p) => {
      const detalles = detallesMap[p.idPedido] || [];
      return acc + detalles.reduce((a, d) => a + d.cantidad * (d.precioCongelado || 0), 0);
    }, 0);

  const paginationBtns = (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${palette.border}`, background: palette.bgCard, cursor: page === 1 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: palette.textMid, opacity: page === 1 ? 0.35 : 1 }}>
        <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <button key={n} onClick={() => setPage(n)} style={{ width: 28, height: 28, borderRadius: 7, fontSize: 12, fontWeight: 600, border: `1px solid ${n === page ? palette.primary : palette.border}`, background: n === page ? palette.primary : palette.bgCard, color: n === page ? "#fff" : palette.textMid, cursor: "pointer" }}>{n}</button>
      ))}
      <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${palette.border}`, background: palette.bgCard, cursor: page === totalPages ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: palette.textMid, opacity: page === totalPages ? 0.35 : 1 }}>
        <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  );

  return (
    <div style={{ maxWidth: 1150, margin: "0 auto", position: "relative" }}>

      {modalOpen && <PedidoModal pedido={editPedido} onClose={() => setModalOpen(false)} onSaved={handleSaved} onNecesitaAviso={handleNecesitaAviso} />}

      {avisoData && (
        <AvisoTareasModal
          pedidoId={avisoData.pedidoId}
          fechaEntrega={avisoData.fechaEntrega}
          tareas={avisoData.tareas}
          tareasPasado={avisoData.tareasPasado}
          onGuardar={handleGuardarFechas}
          onDejarComoEsta={handleDejarComoEsta}
          onCambiarFecha={handleCambiarFecha}
          loading={redistribuyendo}
        />
      )}

      {cambiarFechaPedido && (
        <CambiarFechaModal
          pedido={cambiarFechaPedido}
          onClose={() => setCambiarFechaPedido(null)}
          onSaved={handleSaved}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          texto={`¿Seguro que quieres eliminar el pedido #${String(deleteTarget.idPedido).padStart(4, "0")} de ${getNombreCompleto(deleteTarget)}? Esta acción no se puede deshacer.`}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleEliminar}
          loading={deleting}
        />
      )}

      {loading && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, gap: 12, color: palette.textLight, fontSize: 14 }}>
          <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${palette.border}`, borderTop: `2px solid ${palette.primary}`, animation: "spin 0.8s linear infinite" }} />
          Cargando pedidos...
        </div>
      )}

      {!loading && error && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 14, padding: "18px 22px", marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 18 }}>⚠️</span>
          <div>
            <div style={{ fontWeight: 700, color: "#991B1B", fontSize: 13 }}>No se pudo conectar con el servidor</div>
            <div style={{ color: "#B91C1C", fontSize: 12, marginTop: 2 }}>{error} — Comprueba que Spring Boot está corriendo en <b>localhost:8080</b>.</div>
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${isMobile ? 2 : 4},1fr)`, gap: isMobile ? 10 : 14, marginBottom: isMobile ? 16 : 24 }}>
            <StatCard label="Pedidos hoy" value={String(pedidosHoy)} />
            <StatCard label="Pendientes" value={String(pendientes)} trend="esta semana" trendColor={palette.accent2} />
            <StatCard label="En proceso" value={String(enProceso)} />
            <StatCard label="Ingresos hoy" value={ingresosHoy > 0 ? `€ ${ingresosHoy.toFixed(2)}` : "€ 0"} trend="+12% vs ayer" trendColor={palette.accent3} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            <FilterSelect value={filtro} onChange={handleFiltro} options={FILTROS} minWidth={130} />
            <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center", ...(isMobile ? { width: "100%" } : {}) }}>
              <div style={{ position: "relative", flex: isMobile ? 1 : undefined }}>
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke={palette.textLight} strokeWidth={2} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                  <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                </svg>
                <input type="text" placeholder="Buscar pedido..." value={searchTerm} onChange={(e) => handleSearch(e.target.value)}
                  style={{ paddingLeft: 32, paddingRight: 14, height: 34, borderRadius: 20, border: `1px solid ${palette.border}`, background: palette.bgCard, fontSize: 12.5, color: palette.textDark, width: isMobile ? "100%" : 196 }}
                  onFocus={(e) => (e.target.style.borderColor = palette.primaryMid)}
                  onBlur={(e) => (e.target.style.borderColor = palette.border)} />
              </div>
              <button onClick={handleNuevo} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 20, fontSize: 11.5, fontWeight: 600, border: "none", background: palette.primary, color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap", flexShrink: 0 }}>
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Nuevo pedido
              </button>
            </div>
          </div>

          {isMobile && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {paginados.length === 0 ? (
                <div style={{ padding: "48px 0", textAlign: "center", color: palette.textLight, fontSize: 13 }}>No se encontraron pedidos</div>
              ) : (
                paginados.map((p, i) => {
                  const es = estadoStyle[p.estado] || estadoStyle["Pendiente"];
                  const detalles = detallesMap[p.idPedido] || [];
                  const producto = getProductoLabel(detalles);
                  const total = calcularTotal(detalles);
                  const nombreCompleto = getNombreCompleto(p);
                  return (
                    <div key={p.idPedido} style={{ background: palette.bgCard, borderRadius: 12, border: `1px solid ${palette.border}`, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                          <Avatar nombre={nombreCompleto} idx={i} />
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: palette.textDark }}>{nombreCompleto}</div>
                            <div style={{ fontSize: 11, color: palette.textLight }}>#{String(p.idPedido).padStart(4, "0")}</div>
                          </div>
                        </div>
                        <span style={{ display: "inline-flex", padding: "3.5px 10px", borderRadius: 20, background: es.bg, color: es.color, fontSize: 11, fontWeight: 600 }}>{p.estado}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 12, color: palette.textMid, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 8 }}>{producto}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: palette.textDark, flexShrink: 0 }}>{total}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontSize: 11, color: palette.textLight }}>{formatFecha(p.fechaEntrega)}</div>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button onClick={() => handleEditar(p)} title="Editar" style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${palette.border}`, background: palette.bgCard, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: palette.primary }}>
                            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                          <button onClick={() => setDeleteTarget(p)} title="Eliminar" style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${palette.border}`, background: palette.bgCard, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#EF4444" }}>
                            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              {totalPages > 1 && <div style={{ display: "flex", justifyContent: "center", marginTop: 4 }}>{paginationBtns}</div>}
            </div>
          )}

          {!isMobile && (
            <div style={{ background: palette.bgCard, borderRadius: 14, border: `1px solid ${palette.border}`, boxShadow: "0 1px 4px oklch(0% 0 0 / 0.04)", overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "0.7fr 2fr 2.2fr 1.3fr 1.6fr 0.8fr 1fr", padding: "11px 22px", background: palette.bg, borderBottom: `1px solid ${palette.border}` }}>
                {["ID", "Cliente", "Producto", "Fecha entrega", "Estado", "Total", ""].map((h) => (
                  <span key={h} style={{ fontSize: 10, fontWeight: 700, color: palette.textLight, letterSpacing: "0.8px", textTransform: "uppercase" }}>{h}</span>
                ))}
              </div>

              {paginados.length === 0 ? (
                <div style={{ padding: "48px 24px", textAlign: "center", color: palette.textLight, fontSize: 13 }}>No se encontraron pedidos</div>
              ) : (
                paginados.map((p, i) => {
                  const es = estadoStyle[p.estado] || estadoStyle["Pendiente"];
                  const detalles = detallesMap[p.idPedido] || [];
                  const producto = getProductoLabel(detalles);
                  const total = calcularTotal(detalles);
                  const nombreCompleto = getNombreCompleto(p);
                  return (
                    <div key={p.idPedido}
                      style={{ display: "grid", gridTemplateColumns: "0.7fr 2fr 2.2fr 1.3fr 1.6fr 0.8fr 1fr", padding: "13px 22px", alignItems: "center", borderTop: i > 0 ? `1px solid ${palette.border}` : "none", transition: "background 0.12s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = palette.bg)}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                      <span style={{ fontSize: 11, color: palette.textLight, fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>#{String(p.idPedido).padStart(4, "0")}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                        <Avatar nombre={nombreCompleto} idx={i} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: palette.textDark }}>{nombreCompleto}</span>
                      </div>
                      <span style={{ fontSize: 12.5, color: palette.textMid, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 12 }}>{producto}</span>
                      <span style={{ fontSize: 12, color: palette.textMid }}>{formatFecha(p.fechaEntrega)}</span>
                      <div>
                        <span style={{ display: "inline-flex", alignItems: "center", padding: "3.5px 10px", borderRadius: 20, background: es.bg, color: es.color, fontSize: 11, fontWeight: 600 }}>{p.estado}</span>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: palette.textDark }}>{total}</span>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => handleEditar(p)} title="Editar"
                          style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${palette.border}`, background: palette.bgCard, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: palette.primary, transition: "all 0.15s" }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = palette.primaryLt; e.currentTarget.style.borderColor = palette.primary; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = palette.bgCard; e.currentTarget.style.borderColor = palette.border; }}>
                          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => setDeleteTarget(p)} title="Eliminar"
                          style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${palette.border}`, background: palette.bgCard, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#EF4444", transition: "all 0.15s" }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "#FEF2F2"; e.currentTarget.style.borderColor = "#EF4444"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = palette.bgCard; e.currentTarget.style.borderColor = palette.border; }}>
                          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 22px", borderTop: `1px solid ${palette.border}`, background: palette.bg }}>
                <span style={{ fontSize: 12, color: palette.textLight }}>{paginados.length} de {filtrados.length} pedidos</span>
                {paginationBtns}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}