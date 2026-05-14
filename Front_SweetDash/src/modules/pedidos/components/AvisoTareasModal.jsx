import { useState } from "react";
import palette from "../../../theme/palette";
import { formatFecha, parseFechaLocal } from "../pedidosUtils";

export default function AvisoTareasModal({ pedidoId, fechaEntrega, tareas, tareasPasado, onGuardar, onDejarComoEsta, onCambiarFecha, loading }) {
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  const hoyStr = hoy.toISOString().slice(0, 10);

  const [paso, setPaso] = useState("aviso");

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
