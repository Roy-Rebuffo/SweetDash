import React, { useState, useEffect } from "react";
import palette from "../../../theme/palette";
import { productosApi, procesosApi, materiasPrimasApi, plantillasApi, recetasTamañoApi, tareasApi } from "../../../services/api";
import TamañoRow from "./TamañoRow";

const EMPTY_PROD = { nombre: "", descripcion: "", tipo: "", cantidadPersonas: "", precioBase: "" };
const EMPTY_TAMAÑO = () => ({
  id: null, descripcionTamaño: "", precioVenta: "", ingredientes: [],
  idPlantilla: null, nombrePlantilla: "", descripcionPlantilla: "", pasos: [], plantillaCollapsed: true,
});

function SectionHeader({ title, onAdd, addLabel }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, color: palette.primary, letterSpacing: "0.8px", textTransform: "uppercase", paddingBottom: 4, borderBottom: `1px solid ${palette.border}`, marginTop: 4, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span>{title}</span>
      {onAdd && (
        <button onClick={onAdd} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: palette.primary, background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "'DM Sans', sans-serif", textTransform: "none", letterSpacing: 0 }}>
          <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          {addLabel}
        </button>
      )}
    </div>
  );
}

export default function RecetaModal({ producto, onClose, onSaved, isMobile = false }) {
  const isEdit = !!producto;
  const [materiasPrimas, setMateriasPrimas] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [form, setForm] = useState(isEdit ? {
    nombre: producto.nombre || "", descripcion: producto.descripcion || "",
    tipo: producto.tipo || "", cantidadPersonas: producto.cantidadPersonas || "", precioBase: producto.precioBase || "",
  } : EMPTY_PROD);
  const [imagenFile, setImagenFile] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(producto?.imagenUrl || null);
  const [tamaños, setTamaños] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  // Tamaños que existían en BD al abrir el modal (para detectar cuáles se han eliminado)
  const tamañosOriginales = React.useRef([]);

  useEffect(() => {
    const promises = [materiasPrimasApi.getAll()];
    if (isEdit) promises.push(recetasTamañoApi.getByProducto(producto.idProducto));

    Promise.all(promises).then(async ([mps, tamañosExistentes]) => {
      setMateriasPrimas(mps);
      if (tamañosExistentes && tamañosExistentes.length > 0) {
        const tamañosConPasos = await Promise.all(
          tamañosExistentes.map(async (t) => {
            if (t.idPlantilla) {
              try {
                const plantilla = await plantillasApi.getById(t.idPlantilla);
                const procesosData = await procesosApi.getByPlantilla(t.idPlantilla);
                const pasos = procesosData.map(p => ({ idProceso: p.idProceso, nombre: p.nombre, diasAntesEntrega: p.diasAntesEntrega }));
                return { id: t.id, descripcionTamaño: t.descripcionTamaño || "", precioVenta: t.precioVenta || "", ingredientes: (t.ingredientes || []).map(i => ({ idMateriaPrima: i.idMateriaPrima, cantidadUsada: i.cantidadUsada })), idPlantilla: t.idPlantilla, nombrePlantilla: plantilla.nombre || "", descripcionPlantilla: plantilla.descripcion || "", pasos, plantillaCollapsed: true };
              } catch { }
            }
            return { id: t.id, descripcionTamaño: t.descripcionTamaño || "", precioVenta: t.precioVenta || "", ingredientes: (t.ingredientes || []).map(i => ({ idMateriaPrima: i.idMateriaPrima, cantidadUsada: i.cantidadUsada })), idPlantilla: null, nombrePlantilla: "", descripcionPlantilla: "", pasos: [], plantillaCollapsed: true };
          })
        );
        setTamaños(tamañosConPasos);
        tamañosOriginales.current = tamañosConPasos;
      }
    }).finally(() => setLoadingData(false));
  }, []);

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagenFile(file);
    setImagenPreview(URL.createObjectURL(file));
  };

  const addTamaño = () => setTamaños(l => [...l, EMPTY_TAMAÑO()]);
  const removeTamaño = (idx) => setTamaños(l => l.filter((_, i) => i !== idx));
  const updateTamaño = (idx, key, value) => setTamaños(l => l.map((item, i) => i !== idx ? item : { ...item, [key]: value }));
  const duplicarTamaño = (idx) => {
    const original = tamaños[idx];
    const copia = { id: null, descripcionTamaño: original.descripcionTamaño + " (copia)", precioVenta: original.precioVenta, ingredientes: original.ingredientes.map(i => ({ ...i })), idPlantilla: null, nombrePlantilla: original.nombrePlantilla, descripcionPlantilla: original.descripcionPlantilla, pasos: original.pasos.map(p => ({ nombre: p.nombre, diasAntesEntrega: p.diasAntesEntrega })), plantillaCollapsed: true };
    setTamaños(l => [...l.slice(0, idx + 1), copia, ...l.slice(idx + 1)]);
  };

  const handleSubmit = async () => {
    if (!form.nombre.trim()) { setError("El nombre es obligatorio"); return; }
    if (!form.tipo.trim()) { setError("El tipo es obligatorio"); return; }
    if (!form.precioBase) { setError("El precio base es obligatorio"); return; }
    setSaving(true); setError(null);
    try {
      let productoId;
      const payload = { nombre: form.nombre, descripcion: form.descripcion, tipo: form.tipo, cantidadPersonas: form.cantidadPersonas, precioBase: Number(form.precioBase) };
      if (isEdit) { await productosApi.update(producto.idProducto, payload); productoId = producto.idProducto; }
      else { const nuevo = await productosApi.create(payload); productoId = nuevo.idProducto; }
      if (imagenFile) await productosApi.subirImagen(productoId, imagenFile);

      // Eliminar los tamaños que el usuario borró en el modal
      const currentIds = new Set(tamaños.filter(t => t.id).map(t => t.id));
      const removidos = tamañosOriginales.current.filter(t => t.id && !currentIds.has(t.id));
      for (const tam of removidos) {
        // Borrar RecetaTamaño primero para liberar la FK hacia plantilla_proceso
        await recetasTamañoApi.delete(tam.id);
        if (tam.idPlantilla) {
          const pasos = await procesosApi.getByPlantilla(tam.idPlantilla);
          for (const p of pasos) await procesosApi.delete(p.idProceso);
          await plantillasApi.delete(tam.idPlantilla);
        }
      }

      for (const tam of tamaños) {
        if (!tam.precioVenta) continue;
        let plantillaId = tam.idPlantilla;
        if (tam.pasos.length > 0 || tam.nombrePlantilla.trim()) {
          if (plantillaId) {
            // Actualizar metadatos de la plantilla
            await plantillasApi.update(plantillaId, { nombre: tam.nombrePlantilla || tam.descripcionTamaño, descripcion: tam.descripcionPlantilla });

            // Actualizar procesos en sitio para preservar la FK de las tareas
            const pasosEnDB = await procesosApi.getByPlantilla(plantillaId);
            const idsEnUI = new Set(tam.pasos.filter(p => p.idProceso).map(p => p.idProceso));

            // Eliminar solo los pasos que el usuario ha borrado
            for (const p of pasosEnDB) {
              if (!idsEnUI.has(p.idProceso)) await procesosApi.delete(p.idProceso);
            }

            // Actualizar los existentes y crear los nuevos
            for (const paso of tam.pasos) {
              if (!paso.nombre.trim()) continue;
              if (paso.idProceso) {
                await procesosApi.update(paso.idProceso, { nombre: paso.nombre, diasAntesEntrega: Number(paso.diasAntesEntrega), plantillaProceso: { idPlantilla: plantillaId } });
              } else {
                await procesosApi.create({ nombre: paso.nombre, diasAntesEntrega: Number(paso.diasAntesEntrega), plantillaProceso: { idPlantilla: plantillaId } });
              }
            }
          } else {
            const nuevaPlantilla = await plantillasApi.create({ nombre: tam.nombrePlantilla || tam.descripcionTamaño || "Plantilla", descripcion: tam.descripcionPlantilla });
            plantillaId = nuevaPlantilla.idPlantilla;
            for (const paso of tam.pasos) {
              if (!paso.nombre.trim()) continue;
              await procesosApi.create({ nombre: paso.nombre, diasAntesEntrega: Number(paso.diasAntesEntrega), plantillaProceso: { idPlantilla: plantillaId } });
            }
          }
          if (plantillaId) await tareasApi.recalcularPorPlantilla(plantillaId);
        }
        const tamPayload = { idProducto: productoId, descripcionTamaño: tam.descripcionTamaño || null, precioVenta: Number(tam.precioVenta), idPlantilla: plantillaId || null, ingredientes: tam.ingredientes.filter(i => i.cantidadUsada).map(i => ({ idMateriaPrima: Number(i.idMateriaPrima), cantidadUsada: Number(i.cantidadUsada) })) };
        if (tam.id) await recetasTamañoApi.update(tam.id, tamPayload);
        else await recetasTamañoApi.create(tamPayload);
      }
      onSaved();
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const inputStyle = { height: 36, borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.bg, padding: "0 12px", fontSize: 13, color: palette.textDark, fontFamily: "'DM Sans', sans-serif", width: "100%" };
  const labelStyle = { fontSize: 11, fontWeight: 600, color: palette.textLight, letterSpacing: "0.5px", textTransform: "uppercase" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "oklch(0% 0 0 / 0.35)", zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: 16, overflowY: "auto" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: palette.bgCard, borderRadius: 18, border: `1px solid ${palette.border}`, boxShadow: "0 8px 32px oklch(0% 0 0 / 0.12)", width: "100%", maxWidth: 600, padding: 28, margin: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: palette.textDark }}>{isEdit ? "Editar receta" : "Nueva receta"}</div>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${palette.border}`, background: palette.bg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: palette.textLight }}>
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        {loadingData ? (
          <div style={{ textAlign: "center", padding: "32px 0", color: palette.textLight, fontSize: 13 }}>Cargando datos...</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <SectionHeader title="Datos del producto" />
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={labelStyle}>Nombre</label>
              <input value={form.nombre} onChange={(e) => setForm(f => ({ ...f, nombre: e.target.value }))} placeholder="Tarta de chocolate..." style={inputStyle} onFocus={(e) => (e.target.style.borderColor = palette.primaryMid)} onBlur={(e) => (e.target.style.borderColor = palette.border)} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={labelStyle}>Descripción</label>
              <textarea value={form.descripcion} onChange={(e) => setForm(f => ({ ...f, descripcion: e.target.value }))} placeholder="Descripción del producto..." rows={2}
                style={{ ...inputStyle, height: "auto", padding: "8px 12px", resize: "vertical" }}
                onFocus={(e) => (e.target.style.borderColor = palette.primaryMid)} onBlur={(e) => (e.target.style.borderColor = palette.border)} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr", gap: 12 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={labelStyle}>Tipo</label>
                <input value={form.tipo} onChange={(e) => setForm(f => ({ ...f, tipo: e.target.value }))} placeholder="Tarta, Cupcake..." style={inputStyle} onFocus={(e) => (e.target.style.borderColor = palette.primaryMid)} onBlur={(e) => (e.target.style.borderColor = palette.border)} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={labelStyle}>Personas</label>
                <input value={form.cantidadPersonas} onChange={(e) => setForm(f => ({ ...f, cantidadPersonas: e.target.value }))} placeholder="2-4" style={inputStyle} onFocus={(e) => (e.target.style.borderColor = palette.primaryMid)} onBlur={(e) => (e.target.style.borderColor = palette.border)} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={labelStyle}>Precio base (€)</label>
                <input type="number" min="0" step="0.01" value={form.precioBase} onChange={(e) => setForm(f => ({ ...f, precioBase: e.target.value }))} placeholder="0.00" style={inputStyle} onFocus={(e) => (e.target.style.borderColor = palette.primaryMid)} onBlur={(e) => (e.target.style.borderColor = palette.border)} />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={labelStyle}>Foto del producto</label>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                {imagenPreview && <div style={{ width: 56, height: 56, borderRadius: 10, background: `url(${imagenPreview}) center/cover no-repeat`, border: `1px solid ${palette.border}`, flexShrink: 0 }} />}
                <label style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, border: `1px dashed ${palette.border}`, background: palette.bg, cursor: "pointer", fontSize: 12, color: palette.textMid, fontFamily: "'DM Sans', sans-serif" }}>
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  {imagenPreview ? "Cambiar foto" : "Subir foto"}
                  <input type="file" accept="image/*" onChange={handleImagenChange} style={{ display: "none" }} />
                </label>
                {imagenPreview && <span style={{ fontSize: 11, color: palette.textLight }}>Se subirá a Cloudinary al guardar</span>}
              </div>
            </div>
            <SectionHeader title="Coste por tamaño" onAdd={addTamaño} addLabel="Añadir tamaño" />
            <div style={{ fontSize: 11.5, color: palette.textLight, marginTop: -8 }}>
              Define el precio de venta, ingredientes y pasos de elaboración para cada tamaño.
            </div>
            {tamaños.length === 0 && (
              <div style={{ padding: "14px", textAlign: "center", color: palette.textLight, fontSize: 12, background: palette.bg, borderRadius: 8, border: `1px dashed ${palette.border}` }}>
                Pulsa "Añadir tamaño" para definir tamaños, escandallos y plantillas
              </div>
            )}
            {tamaños.map((tam, idx) => (
              <TamañoRow key={idx} tamaño={tam} idx={idx} materiasPrimas={materiasPrimas} onChange={updateTamaño} onRemove={removeTamaño} onDuplicate={duplicarTamaño} />
            ))}
            {error && <div style={{ fontSize: 12, color: "#EF4444", background: "#FEF2F2", borderRadius: 8, padding: "8px 12px" }}>{error}</div>}
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 4 }}>
              <button onClick={onClose} style={{ padding: "8px 18px", borderRadius: 10, border: `1px solid ${palette.border}`, background: palette.bg, fontSize: 13, fontWeight: 600, color: palette.textMid, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Cancelar</button>
              <button onClick={handleSubmit} disabled={saving} style={{ padding: "8px 18px", borderRadius: 10, border: "none", background: palette.primary, fontSize: 13, fontWeight: 600, color: "#fff", cursor: saving ? "default" : "pointer", opacity: saving ? 0.7 : 1, fontFamily: "'DM Sans', sans-serif", boxShadow: `0 2px 10px ${palette.primary}33` }}>
                {saving ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear receta"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
