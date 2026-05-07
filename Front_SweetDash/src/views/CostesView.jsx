import { useState, useEffect } from "react";
import palette from "../theme/palette";
import { productosApi, materiasPrimasApi, recetasTamañoApi } from "../services/api";

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(n) {
  if (n == null) return "—";
  return `€ ${Number(n).toFixed(2)}`;
}

function pct(n) {
  if (n == null) return "—";
  return `${Number(n).toFixed(1)}%`;
}

function margenColor(margen) {
  if (margen == null) return palette.textLight;
  if (margen >= 50) return "#16A34A";
  if (margen >= 30) return palette.accent3;
  return "#EF4444";
}

// ── Modal receta tamaño ───────────────────────────────────────────────────────
function RecetaTamañoModal({ receta, idProducto, materiasPrimas, onClose, onSaved }) {
  const isEdit = !!receta;

  const [tamañoCm,        setTamañoCm]        = useState(receta?.tamañoCm        ?? "");
  const [descripcionTamaño, setDescripcionTamaño] = useState(receta?.descripcionTamaño ?? "");
  const [precioVenta,     setPrecioVenta]      = useState(receta?.precioVenta     ?? "");
  const [ingredientes,    setIngredientes]     = useState(
    receta?.ingredientes?.map(i => ({
      idMateriaPrima: i.idMateriaPrima,
      cantidadUsada:  i.cantidadUsada,
    })) ?? [{ idMateriaPrima: materiasPrimas[0]?.idMateriaPrima ?? "", cantidadUsada: "" }]
  );
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState(null);

  const addIngrediente = () =>
    setIngredientes(l => [...l, { idMateriaPrima: materiasPrimas[0]?.idMateriaPrima ?? "", cantidadUsada: "" }]);

  const removeIngrediente = (idx) =>
    setIngredientes(l => l.filter((_, i) => i !== idx));

  const updateIngrediente = (idx, key, value) =>
    setIngredientes(l => l.map((item, i) => i !== idx ? item : { ...item, [key]: value }));

  const handleSubmit = async () => {
    if (!precioVenta) { setError("El precio de venta es obligatorio"); return; }
    if (ingredientes.length === 0) { setError("Añade al menos un ingrediente"); return; }
    setSaving(true); setError(null);
    try {
      const payload = {
        idProducto,
        tamañoCm:         tamañoCm ? Number(tamañoCm) : null,
        descripcionTamaño: descripcionTamaño || null,
        precioVenta:      Number(precioVenta),
        ingredientes:     ingredientes.map(i => ({
          idMateriaPrima: Number(i.idMateriaPrima),
          cantidadUsada:  Number(i.cantidadUsada),
        })),
      };
      if (isEdit) await recetasTamañoApi.update(receta.id, payload);
      else        await recetasTamañoApi.create(payload);
      onSaved();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    height: 36, borderRadius: 8, border: `1px solid ${palette.border}`,
    background: palette.bg, padding: "0 12px", fontSize: 13,
    color: palette.textDark, fontFamily: "'DM Sans', sans-serif", width: "100%",
  };
  const labelStyle = { fontSize: 11, fontWeight: 600, color: palette.textLight, letterSpacing: "0.5px", textTransform: "uppercase" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "oklch(0% 0 0 / 0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, overflowY: "auto" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: palette.bgCard, borderRadius: 18, border: `1px solid ${palette.border}`, boxShadow: "0 8px 32px oklch(0% 0 0 / 0.14)", width: "100%", maxWidth: 560, padding: 28, margin: "auto" }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: palette.textDark }}>{isEdit ? "Editar escandallo" : "Nuevo escandallo"}</div>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${palette.border}`, background: palette.bg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: palette.textLight }}>
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Tamaño + descripción */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={labelStyle}>Tamaño (cm)</label>
              <input type="number" min="1" value={tamañoCm} onChange={e => setTamañoCm(e.target.value)}
                placeholder="20" style={inputStyle}
                onFocus={e => e.target.style.borderColor = palette.primaryMid}
                onBlur={e  => e.target.style.borderColor = palette.border} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={labelStyle}>Descripción</label>
              <input type="text" value={descripcionTamaño} onChange={e => setDescripcionTamaño(e.target.value)}
                placeholder="ej: 20cm · 8-10 personas" style={inputStyle}
                onFocus={e => e.target.style.borderColor = palette.primaryMid}
                onBlur={e  => e.target.style.borderColor = palette.border} />
            </div>
          </div>

          {/* Precio venta */}
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={labelStyle}>Precio de venta (€)</label>
            <input type="number" min="0" step="0.01" value={precioVenta} onChange={e => setPrecioVenta(e.target.value)}
              placeholder="35.00" style={inputStyle}
              onFocus={e => e.target.style.borderColor = palette.primaryMid}
              onBlur={e  => e.target.style.borderColor = palette.border} />
          </div>

          {/* Ingredientes */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <label style={labelStyle}>Ingredientes</label>
              <button onClick={addIngrediente} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, fontWeight: 600, color: palette.primary, background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "'DM Sans', sans-serif" }}>
                <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Añadir
              </button>
            </div>

            {/* Cabecera */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr auto", gap: 8, padding: "0 4px" }}>
              <span style={{ ...labelStyle, fontSize: 10 }}>Ingrediente</span>
              <span style={{ ...labelStyle, fontSize: 10 }}>Cantidad usada</span>
              <span style={{ width: 28 }} />
            </div>

            {ingredientes.map((ing, idx) => {
              const mp = materiasPrimas.find(m => m.idMateriaPrima === Number(ing.idMateriaPrima));
              return (
                <div key={idx} style={{ display: "grid", gridTemplateColumns: "2fr 1fr auto", gap: 8, alignItems: "center" }}>
                  <select value={ing.idMateriaPrima} onChange={e => updateIngrediente(idx, "idMateriaPrima", Number(e.target.value))}
                    style={{ ...inputStyle, fontSize: 12, appearance: "none" }}
                    onFocus={e => e.target.style.borderColor = palette.primaryMid}
                    onBlur={e  => e.target.style.borderColor = palette.border}>
                    {materiasPrimas.map(m => <option key={m.idMateriaPrima} value={m.idMateriaPrima}>{m.nombre}</option>)}
                  </select>
                  <div style={{ position: "relative" }}>
                    <input type="number" min="0" step="0.01" value={ing.cantidadUsada}
                      onChange={e => updateIngrediente(idx, "cantidadUsada", e.target.value)}
                      placeholder="180" style={{ ...inputStyle, paddingRight: mp ? 36 : 12, fontSize: 12 }}
                      onFocus={e => e.target.style.borderColor = palette.primaryMid}
                      onBlur={e  => e.target.style.borderColor = palette.border} />
                    {mp && <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 10, color: palette.textLight, pointerEvents: "none" }}>{mp.unidad}</span>}
                  </div>
                  <button onClick={() => removeIngrediente(idx)} style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${palette.border}`, background: palette.bgCard, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#EF4444", flexShrink: 0 }}>
                    <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              );
            })}
          </div>

          {error && <div style={{ fontSize: 12, color: "#EF4444", background: "#FEF2F2", borderRadius: 8, padding: "8px 12px" }}>{error}</div>}

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 4 }}>
            <button onClick={onClose} style={{ padding: "8px 18px", borderRadius: 10, border: `1px solid ${palette.border}`, background: palette.bg, fontSize: 13, fontWeight: 600, color: palette.textMid, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Cancelar
            </button>
            <button onClick={handleSubmit} disabled={saving} style={{ padding: "8px 18px", borderRadius: 10, border: "none", background: palette.primary, fontSize: 13, fontWeight: 600, color: "#fff", cursor: saving ? "default" : "pointer", opacity: saving ? 0.7 : 1, fontFamily: "'DM Sans', sans-serif", boxShadow: `0 2px 10px ${palette.primary}33` }}>
              {saving ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear escandallo"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Tarjeta de escandallo ─────────────────────────────────────────────────────
function EscandalloCard({ receta, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const margen = receta.margenPct ? Number(receta.margenPct) : null;

  return (
    <div style={{ background: palette.bg, borderRadius: 12, border: `1px solid ${palette.border}`, overflow: "hidden" }}>
      {/* Cabecera */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer" }}
        onClick={() => setExpanded(e => !e)}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: palette.textDark }}>
            {receta.tamañoCm ? `${receta.tamañoCm} cm` : "—"}
            {receta.descripcionTamaño && <span style={{ fontSize: 11.5, fontWeight: 400, color: palette.textLight, marginLeft: 8 }}>{receta.descripcionTamaño}</span>}
          </div>
        </div>

        {/* KPIs inline */}
        <div style={{ display: "flex", gap: 16, alignItems: "center", flexShrink: 0 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: palette.textLight, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Coste</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: palette.textDark }}>{fmt(receta.costeTotal)}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: palette.textLight, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>PVP</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: palette.primary }}>{fmt(receta.precioVenta)}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: palette.textLight, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Margen</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: margenColor(margen) }}>{pct(margen)}</div>
          </div>
        </div>

        {/* Botones */}
        <div style={{ display: "flex", gap: 6, marginLeft: 8 }} onClick={e => e.stopPropagation()}>
          <button onClick={() => onEdit(receta)} style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${palette.border}`, background: palette.bgCard, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: palette.primary }}>
            <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          </button>
          <button onClick={() => onDelete(receta.id)} style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${palette.border}`, background: palette.bgCard, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#EF4444" }}>
            <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>

        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke={palette.textLight} strokeWidth={2} style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Detalle ingredientes */}
      {expanded && (
        <div style={{ borderTop: `1px solid ${palette.border}`, padding: "12px 16px" }}>
          {/* Cabecera tabla */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 8, padding: "0 0 8px", borderBottom: `1px solid ${palette.border}`, marginBottom: 8 }}>
            {["Ingrediente", "Cantidad", "Paquete", "Precio/paq.", "Coste"].map(h => (
              <span key={h} style={{ fontSize: 10, fontWeight: 700, color: palette.textLight, letterSpacing: "0.6px", textTransform: "uppercase" }}>{h}</span>
            ))}
          </div>

          {receta.ingredientes?.map((ing, i) => (
            <div key={ing.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 8, padding: "6px 0", borderTop: i > 0 ? `1px solid ${palette.border}` : "none", alignItems: "center" }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: palette.textDark }}>{ing.nombreMateriaPrima}</span>
              <span style={{ fontSize: 12, color: palette.textMid }}>{ing.cantidadUsada} {ing.unidad}</span>
              <span style={{ fontSize: 12, color: palette.textMid }}>{ing.unidadesPaquete} {ing.unidad}</span>
              <span style={{ fontSize: 12, color: palette.textMid }}>{fmt(ing.precioPaquete)}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: palette.primary }}>{fmt(ing.costeIngrediente)}</span>
            </div>
          ))}

          {/* Resumen */}
          <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${palette.border}`, display: "flex", justifyContent: "flex-end", gap: 24 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10, color: palette.textLight, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Coste total</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: palette.textDark }}>{fmt(receta.costeTotal)}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10, color: palette.textLight, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Ganancia</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#16A34A" }}>{fmt(receta.ganancia)}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10, color: palette.textLight, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Margen</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: margenColor(margen) }}>{pct(margen)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Vista principal ───────────────────────────────────────────────────────────
export default function CostesView({ isMobile = false }) {
  const [productos,      setProductos]      = useState([]);
  const [materiasPrimas, setMateriasPrimas] = useState([]);
  const [recetas,        setRecetas]        = useState([]);
  const [productoActivo, setProductoActivo] = useState(null);
  const [loading,        setLoading]        = useState(true);
  const [loadingRecetas, setLoadingRecetas] = useState(false);
  const [error,          setError]          = useState(null);
  const [modalOpen,      setModalOpen]      = useState(false);
  const [editReceta,     setEditReceta]     = useState(null);
  const [searchTerm,     setSearchTerm]     = useState("");

  // Cargar productos y materias primas al montar
  useEffect(() => {
    setLoading(true);
    Promise.all([productosApi.getAll(), materiasPrimasApi.getAll()])
      .then(([prods, mps]) => {
        setProductos(prods);
        setMateriasPrimas(mps);
        if (prods.length > 0) setProductoActivo(prods[0]);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Cargar recetas cuando cambia el producto activo
  useEffect(() => {
    if (!productoActivo) return;
    setLoadingRecetas(true);
    recetasTamañoApi.getByProducto(productoActivo.idProducto)
      .then(setRecetas)
      .catch(() => setRecetas([]))
      .finally(() => setLoadingRecetas(false));
  }, [productoActivo]);

  const handleNuevo  = () => { setEditReceta(null); setModalOpen(true); };
  const handleEditar = (r) => { setEditReceta(r);   setModalOpen(true); };

  const handleSaved = () => {
    setModalOpen(false);
    if (!productoActivo) return;
    recetasTamañoApi.getByProducto(productoActivo.idProducto).then(setRecetas).catch(() => {});
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este escandallo?")) return;
    try {
      await recetasTamañoApi.delete(id);
      setRecetas(r => r.filter(rec => rec.id !== id));
    } catch (e) {
      alert("Error al eliminar: " + e.message);
    }
  };

  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, gap: 12, color: palette.textLight, fontSize: 14 }}>
      <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${palette.border}`, borderTop: `2px solid ${palette.primary}`, animation: "spin 0.8s linear infinite" }} />
      Cargando costes...
    </div>
  );

  if (error) return (
    <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 14, padding: "18px 22px", display: "flex", gap: 12, alignItems: "center" }}>
      <span style={{ fontSize: 18 }}>⚠️</span>
      <div style={{ fontSize: 13, color: "#991B1B" }}>{error}</div>
    </div>
  );

  return (
    <div style={{ maxWidth: 1150, margin: "0 auto", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "260px 1fr", gap: 20, alignItems: "start" }}>

      {/* Modal */}
      {modalOpen && productoActivo && (
        <RecetaTamañoModal
          receta={editReceta}
          idProducto={productoActivo.idProducto}
          materiasPrimas={materiasPrimas}
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
        />
      )}

      {/* ── Panel izquierdo: lista de productos ── */}
      <div style={{ background: palette.bgCard, borderRadius: 16, border: `1px solid ${palette.border}`, overflow: "hidden", position: isMobile ? "static" : "sticky", top: 0 }}>
        <div style={{ padding: "16px 16px 10px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: palette.textLight, letterSpacing: "0.7px", textTransform: "uppercase", marginBottom: 10 }}>Productos</div>
          {/* Buscador */}
          <div style={{ position: "relative" }}>
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke={palette.textLight} strokeWidth={2} style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
              <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
            </svg>
            <input type="text" placeholder="Buscar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              style={{ width: "100%", paddingLeft: 28, paddingRight: 10, height: 32, borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.bg, fontSize: 12, color: palette.textDark, fontFamily: "'DM Sans', sans-serif" }}
              onFocus={e => e.target.style.borderColor = palette.primaryMid}
              onBlur={e  => e.target.style.borderColor = palette.border} />
          </div>
        </div>

        <div style={{ maxHeight: isMobile ? 180 : 520, overflowY: "auto" }}>
          {productosFiltrados.map(p => {
            const activo = productoActivo?.idProducto === p.idProducto;
            return (
              <button key={p.idProducto} onClick={() => setProductoActivo(p)}
                style={{ width: "100%", textAlign: "left", padding: "11px 16px", border: "none", borderTop: `1px solid ${palette.border}`, background: activo ? palette.primaryLt : "transparent", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "background 0.1s" }}
                onMouseEnter={e => { if (!activo) e.currentTarget.style.background = palette.bg; }}
                onMouseLeave={e => { if (!activo) e.currentTarget.style.background = "transparent"; }}>
                <div style={{ fontSize: 13, fontWeight: activo ? 700 : 500, color: activo ? palette.primary : palette.textDark, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.nombre}</div>
                {p.tipo && <div style={{ fontSize: 11, color: palette.textLight, marginTop: 1 }}>{p.tipo}</div>}
              </button>
            );
          })}
          {productosFiltrados.length === 0 && (
            <div style={{ padding: "24px 16px", textAlign: "center", color: palette.textLight, fontSize: 12 }}>Sin resultados</div>
          )}
        </div>
      </div>

      {/* ── Panel derecho: escandallos del producto ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Header producto */}
        {productoActivo && (
          <div style={{ background: palette.bgCard, borderRadius: 16, border: `1px solid ${palette.border}`, padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: palette.textDark }}>{productoActivo.nombre}</div>
              <div style={{ fontSize: 12, color: palette.textLight, marginTop: 2 }}>
                {recetas.length} tamaño{recetas.length !== 1 ? "s" : ""} · Precio base {productoActivo.precioBase ? `€ ${Number(productoActivo.precioBase).toFixed(2)}` : "—"}
                {productoActivo.costeFijo > 0 && ` · Coste fijo € ${Number(productoActivo.costeFijo).toFixed(2)}`}
              </div>
            </div>
            <button onClick={handleNuevo} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: "none", background: palette.primary, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap", flexShrink: 0, boxShadow: `0 2px 8px ${palette.primary}33` }}>
              <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              Nuevo tamaño
            </button>
          </div>
        )}

        {/* Lista escandallos */}
        {loadingRecetas ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 120, gap: 10, color: palette.textLight, fontSize: 13 }}>
            <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${palette.border}`, borderTop: `2px solid ${palette.primary}`, animation: "spin 0.8s linear infinite" }} />
            Cargando escandallos...
          </div>
        ) : recetas.length === 0 ? (
          <div style={{ background: palette.bgCard, borderRadius: 16, border: `1px dashed ${palette.border}`, padding: "48px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📊</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: palette.textDark, marginBottom: 6 }}>Sin escandallos todavía</div>
            <div style={{ fontSize: 12, color: palette.textLight, marginBottom: 18 }}>Añade el coste por tamaño para calcular márgenes automáticamente</div>
            <button onClick={handleNuevo} style={{ padding: "8px 18px", borderRadius: 10, border: "none", background: palette.primary, fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Añadir primer tamaño
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Resumen visual si hay varios tamaños */}
            {recetas.length > 1 && (
              <div style={{ background: palette.bgCard, borderRadius: 16, border: `1px solid ${palette.border}`, padding: "16px 20px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: palette.textLight, letterSpacing: "0.7px", textTransform: "uppercase", marginBottom: 12 }}>Comparativa de tamaños</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {recetas.sort((a, b) => (a.tamañoCm || 0) - (b.tamañoCm || 0)).map(r => {
                    const margen = r.margenPct ? Number(r.margenPct) : null;
                    return (
                      <div key={r.id} style={{ flex: "1 1 120px", background: palette.bg, borderRadius: 10, border: `1px solid ${palette.border}`, padding: "12px 14px", textAlign: "center" }}>
                        <div style={{ fontSize: 16, fontWeight: 800, color: palette.textDark }}>{r.tamañoCm ? `${r.tamañoCm}cm` : "—"}</div>
                        <div style={{ fontSize: 11, color: palette.textLight, marginBottom: 8 }}>{r.descripcionTamaño || ""}</div>
                        <div style={{ fontSize: 12, color: palette.textMid }}>Coste {fmt(r.costeTotal)}</div>
                        <div style={{ fontSize: 12, color: palette.primary, fontWeight: 600 }}>PVP {fmt(r.precioVenta)}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: margenColor(margen), marginTop: 4 }}>{pct(margen)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Cards individuales */}
            {recetas.map(r => (
              <EscandalloCard key={r.id} receta={r} onEdit={handleEditar} onDelete={handleDelete} />
            ))}
          </div>
        )}

        {/* Info materias primas sin precio */}
        {materiasPrimas.some(m => !m.precioPaquete || Number(m.precioPaquete) === 0) && (
          <div style={{ background: "oklch(98% 0.02 80)", border: "1px solid oklch(88% 0.08 80)", borderRadius: 12, padding: "12px 16px", display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
            <div style={{ fontSize: 12, color: "oklch(45% 0.08 80)" }}>
              <b>Algunas materias primas no tienen precio configurado.</b> Ve a Inventario y actualiza el precio de paquete y unidades por paquete para que el cálculo de costes sea correcto.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}