import { useState, useEffect } from "react";
import palette from "../theme/palette";
import { stockMaterialesApi, materiasPrimasApi } from "../services/api";
import FilterSelect from "../components/FilterSelect";

// ── Helpers ───────────────────────────────────────────────────────────────────
function getEstado(stock, max) {
  const pct = (stock / max) * 100;
  if (pct >= 50) return { label: "OK", color: palette.accent3, bg: palette.accent3Lt, barColor: palette.accent3 };
  if (pct >= 20) return { label: "BAJO", color: palette.accent2, bg: palette.accent2Lt, barColor: palette.accent2 };
  return { label: "CRÍTICO", color: palette.primary, bg: palette.primaryLt, barColor: palette.primary };
}

function formatFecha(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
}

function diasHastaCaducidad(iso) {
  if (!iso) return null;
  const diff = new Date(iso) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function emojiParaNombre(nombre) {
  const n = nombre.toLowerCase();
  if (n.includes("harina")) return "🌾";
  if (n.includes("azúcar") || n.includes("azucar")) return "🍬";
  if (n.includes("huevo")) return "🥚";
  if (n.includes("chocolate")) return "🍫";
  if (n.includes("mantequilla")) return "🧈";
  if (n.includes("vainilla")) return "🌿";
  if (n.includes("almendra")) return "🌰";
  if (n.includes("cacao")) return "🍫";
  if (n.includes("nata")) return "🥛";
  if (n.includes("queso")) return "🧀";
  if (n.includes("fondant")) return "🎂";
  if (n.includes("frambuesa")) return "🍓";
  if (n.includes("limón") || n.includes("limon")) return "🍋";
  if (n.includes("pistacho")) return "🌱";
  if (n.includes("caja")) return "📦";
  if (n.includes("lazo")) return "🎀";
  if (n.includes("cinta")) return "🎗️";
  if (n.includes("bolsa")) return "🛍️";
  if (n.includes("cápsula") || n.includes("capsula")) return "🧁";
  if (n.includes("manga")) return "🍦";
  if (n.includes("papel")) return "📄";
  if (n.includes("etiqueta")) return "🏷️";
  if (n.includes("base") || n.includes("cartón")) return "🗂️";
  return "📦";
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

// ── Modal Materia Prima ───────────────────────────────────────────────────────
const EMPTY_MP = { nombre: "", cantidadStock: "", stockMaximo: "", unidad: "", fechaCaducidad: "" };

function MateriaPrimaModal({ item, onClose, onSaved }) {
  const isEdit = !!item;
  const [form, setForm] = useState(isEdit ? {
    nombre: item.nombre,
    cantidadStock: item.stock,
    stockMaximo: item.stockMax,
    unidad: item.unidad,
    fechaCaducidad: item.caducidad ? item.caducidad.slice(0, 10) : "",
  } : EMPTY_MP);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const inputStyle = { height: 36, borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.bg, padding: "0 12px", fontSize: 13, color: palette.textDark, fontFamily: "'DM Sans', sans-serif", width: "100%" };
  const labelStyle = { fontSize: 11, fontWeight: 600, color: palette.textLight, letterSpacing: "0.5px", textTransform: "uppercase" };

  const handleSubmit = async () => {
    if (!form.nombre.trim()) { setError("El nombre es obligatorio"); return; }
    if (!form.unidad.trim()) { setError("La unidad es obligatoria"); return; }
    if (form.cantidadStock === "") { setError("La cantidad es obligatoria"); return; }
    setSaving(true); setError(null);
    try {
      const payload = {
        nombre: form.nombre,
        cantidadStock: Number(form.cantidadStock),
        stockMaximo: Number(form.stockMaximo) || 0,
        unidad: form.unidad,
        fechaCaducidad: form.fechaCaducidad || null,
      };
      if (isEdit) await materiasPrimasApi.update(item.rawId, payload);
      else await materiasPrimasApi.create(payload);
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
      <div style={{ background: palette.bgCard, borderRadius: 18, border: `1px solid ${palette.border}`, boxShadow: "0 8px 32px oklch(0% 0 0 / 0.12)", width: "100%", maxWidth: 460, padding: 28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: palette.textDark }}>{isEdit ? "Editar materia prima" : "Nueva materia prima"}</div>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${palette.border}`, background: palette.bg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: palette.textLight }}>
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={labelStyle}>Nombre</label>
            <input value={form.nombre} onChange={(e) => setForm(f => ({ ...f, nombre: e.target.value }))} placeholder="Harina de trigo..." style={inputStyle} onFocus={(e) => (e.target.style.borderColor = palette.primaryMid)} onBlur={(e) => (e.target.style.borderColor = palette.border)} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={labelStyle}>Stock actual</label>
              <input type="number" min="0" step="0.01" value={form.cantidadStock} onChange={(e) => setForm(f => ({ ...f, cantidadStock: e.target.value }))} placeholder="0" style={inputStyle} onFocus={(e) => (e.target.style.borderColor = palette.primaryMid)} onBlur={(e) => (e.target.style.borderColor = palette.border)} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={labelStyle}>Stock máximo</label>
              <input type="number" min="0" step="0.01" value={form.stockMaximo} onChange={(e) => setForm(f => ({ ...f, stockMaximo: e.target.value }))} placeholder="0" style={inputStyle} onFocus={(e) => (e.target.style.borderColor = palette.primaryMid)} onBlur={(e) => (e.target.style.borderColor = palette.border)} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={labelStyle}>Unidad</label>
              <input value={form.unidad} onChange={(e) => setForm(f => ({ ...f, unidad: e.target.value }))} placeholder="kg, g, L..." style={inputStyle} onFocus={(e) => (e.target.style.borderColor = palette.primaryMid)} onBlur={(e) => (e.target.style.borderColor = palette.border)} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={labelStyle}>Fecha caducidad</label>
              <input type="date" value={form.fechaCaducidad} onChange={(e) => setForm(f => ({ ...f, fechaCaducidad: e.target.value }))} style={inputStyle} onFocus={(e) => (e.target.style.borderColor = palette.primaryMid)} onBlur={(e) => (e.target.style.borderColor = palette.border)} />
            </div>
          </div>
        </div>
        {error && <div style={{ marginTop: 12, fontSize: 12, color: "#EF4444", background: "#FEF2F2", borderRadius: 8, padding: "8px 12px" }}>{error}</div>}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 22 }}>
          <button onClick={onClose} style={{ padding: "8px 18px", borderRadius: 10, border: `1px solid ${palette.border}`, background: palette.bg, fontSize: 13, fontWeight: 600, color: palette.textMid, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Cancelar</button>
          <button onClick={handleSubmit} disabled={saving} style={{ padding: "8px 18px", borderRadius: 10, border: "none", background: palette.primary, fontSize: 13, fontWeight: 600, color: "#fff", cursor: saving ? "default" : "pointer", opacity: saving ? 0.7 : 1, fontFamily: "'DM Sans', sans-serif", boxShadow: `0 2px 10px ${palette.primary}33` }}>
            {saving ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal Material ────────────────────────────────────────────────────────────
const EMPTY_MAT = { nombre: "", cantidadStock: "", stockMaximo: "" };

function MaterialModal({ item, onClose, onSaved }) {
  const isEdit = !!item;
  const [form, setForm] = useState(isEdit ? { nombre: item.nombre, cantidadStock: item.stock, stockMaximo: item.stockMax } : EMPTY_MAT);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const inputStyle = { height: 36, borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.bg, padding: "0 12px", fontSize: 13, color: palette.textDark, fontFamily: "'DM Sans', sans-serif", width: "100%" };
  const labelStyle = { fontSize: 11, fontWeight: 600, color: palette.textLight, letterSpacing: "0.5px", textTransform: "uppercase" };

  const handleSubmit = async () => {
    if (!form.nombre.trim()) { setError("El nombre es obligatorio"); return; }
    if (form.cantidadStock === "") { setError("La cantidad es obligatoria"); return; }
    setSaving(true); setError(null);
    try {
      const payload = { nombre: form.nombre, cantidadStock: Number(form.cantidadStock), stockMaximo: Number(form.stockMaximo) || 0 };
      if (isEdit) await stockMaterialesApi.update(item.rawId, payload);
      else await stockMaterialesApi.create(payload);
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
      <div style={{ background: palette.bgCard, borderRadius: 18, border: `1px solid ${palette.border}`, boxShadow: "0 8px 32px oklch(0% 0 0 / 0.12)", width: "100%", maxWidth: 400, padding: 28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: palette.textDark }}>{isEdit ? "Editar material" : "Nuevo material"}</div>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${palette.border}`, background: palette.bg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: palette.textLight }}>
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={labelStyle}>Nombre</label>
            <input value={form.nombre} onChange={(e) => setForm(f => ({ ...f, nombre: e.target.value }))} placeholder="Caja kraft..." style={inputStyle} onFocus={(e) => (e.target.style.borderColor = palette.primaryMid)} onBlur={(e) => (e.target.style.borderColor = palette.border)} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={labelStyle}>Stock actual</label>
              <input type="number" min="0" value={form.cantidadStock} onChange={(e) => setForm(f => ({ ...f, cantidadStock: e.target.value }))} placeholder="0" style={inputStyle} onFocus={(e) => (e.target.style.borderColor = palette.primaryMid)} onBlur={(e) => (e.target.style.borderColor = palette.border)} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={labelStyle}>Stock máximo</label>
              <input type="number" min="0" value={form.stockMaximo} onChange={(e) => setForm(f => ({ ...f, stockMaximo: e.target.value }))} placeholder="0" style={inputStyle} onFocus={(e) => (e.target.style.borderColor = palette.primaryMid)} onBlur={(e) => (e.target.style.borderColor = palette.border)} />
            </div>
          </div>
        </div>
        {error && <div style={{ marginTop: 12, fontSize: 12, color: "#EF4444", background: "#FEF2F2", borderRadius: 8, padding: "8px 12px" }}>{error}</div>}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 22 }}>
          <button onClick={onClose} style={{ padding: "8px 18px", borderRadius: 10, border: `1px solid ${palette.border}`, background: palette.bg, fontSize: 13, fontWeight: 600, color: palette.textMid, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Cancelar</button>
          <button onClick={handleSubmit} disabled={saving} style={{ padding: "8px 18px", borderRadius: 10, border: "none", background: palette.primary, fontSize: 13, fontWeight: 600, color: "#fff", cursor: saving ? "default" : "pointer", opacity: saving ? 0.7 : 1, fontFamily: "'DM Sans', sans-serif", boxShadow: `0 2px 10px ${palette.primary}33` }}>
            {saving ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal confirmar borrado ───────────────────────────────────────────────────
function ConfirmModal({ nombre, onClose, onConfirm, loading }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "oklch(0% 0 0 / 0.35)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: palette.bgCard, borderRadius: 18, border: `1px solid ${palette.border}`, boxShadow: "0 8px 32px oklch(0% 0 0 / 0.12)", width: "100%", maxWidth: 360, padding: 28 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: palette.textDark, marginBottom: 10 }}>Eliminar artículo</div>
        <div style={{ fontSize: 13, color: palette.textMid, marginBottom: 22 }}>¿Seguro que quieres eliminar <b>{nombre}</b>? Esta acción no se puede deshacer.</div>
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
const ITEMS_PER_PAGE = 8;
const TABS = ["Todos", "Materias Primas", "Materiales"];

export default function InventarioView({ isMobile = false }) {
  const [materias, setMaterias] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  // CRUD state
  const [modalTipo, setModalTipo] = useState(null); // "mp" | "mat"
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const cargarDatos = () => {
    setLoading(true);
    Promise.all([materiasPrimasApi.getAll(), stockMaterialesApi.getAll()])
      .then(([mp, mat]) => { setMaterias(mp); setMateriales(mat); setError(null); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { cargarDatos(); }, []);

  const itemsUnificados = [
    ...materias.map((m) => ({
      id: `mp-${m.idMateriaPrima}`,
      rawId: m.idMateriaPrima,
      tipo: "mp",
      nombre: m.nombre,
      categoria: "Materias Primas",
      stock: m.cantidadStock,
      stockMax: m.stockMaximo,
      unidad: m.unidad,
      caducidad: m.fechaCaducidad,
      emoji: emojiParaNombre(m.nombre),
    })),
    ...materiales.map((m) => ({
      id: `mat-${m.idStock}`,
      rawId: m.idStock,
      tipo: "mat",
      nombre: m.nombre,
      categoria: "Materiales",
      stock: m.cantidadStock,
      stockMax: m.stockMaximo,
      unidad: "ud",
      caducidad: null,
      emoji: emojiParaNombre(m.nombre),
    })),
  ];

  const filtrados = itemsUnificados.filter((item) => {
    const matchTab = tab === "Todos" || item.categoria === tab;
    const matchSearch = item.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    return matchTab && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtrados.length / ITEMS_PER_PAGE));
  const paginados = filtrados.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const handleSearch = (v) => { setSearchTerm(v); setPage(1); };
  const handleTab = (t) => { setTab(t); setPage(1); };

  const handleNuevo = () => {
    // decide tipo según el tab activo
    const tipo = tab === "Materiales" ? "mat" : "mp";
    setEditItem(null); setModalTipo(tipo);
  };
  const handleEditar = (item) => { setEditItem(item); setModalTipo(item.tipo); };
  const handleSaved = () => { setModalTipo(null); setEditItem(null); cargarDatos(); };

  const handleEliminar = async () => {
    setDeleting(true);
    try {
      if (deleteTarget.tipo === "mp") await materiasPrimasApi.delete(deleteTarget.rawId);
      else await stockMaterialesApi.delete(deleteTarget.rawId);
      setDeleteTarget(null);
      cargarDatos();
    } catch (e) {
      setDeleteTarget(null);
      alert(e.message.includes("409")
        ? "No se puede eliminar porque está siendo usado en recetas o pedidos existentes."
        : "Error al eliminar: " + e.message);
    } finally {
      setDeleting(false);
    }
  };

  const totalItems = itemsUnificados.length;
  const criticos = itemsUnificados.filter((i) => getEstado(i.stock, i.stockMax).label === "CRÍTICO").length;
  const proxCaducar = materias.filter((m) => { const d = diasHastaCaducidad(m.fechaCaducidad); return d !== null && d <= 30; }).length;

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
    <div style={{ maxWidth: 1050, margin: "0 auto", position: "relative" }}>

      {/* Modales */}
      {modalTipo === "mp" && <MateriaPrimaModal item={editItem} onClose={() => { setModalTipo(null); setEditItem(null); }} onSaved={handleSaved} />}
      {modalTipo === "mat" && <MaterialModal item={editItem} onClose={() => { setModalTipo(null); setEditItem(null); }} onSaved={handleSaved} />}
      {deleteTarget && <ConfirmModal nombre={deleteTarget.nombre} onClose={() => setDeleteTarget(null)} onConfirm={handleEliminar} loading={deleting} />}

      {/* Loading */}
      {loading && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, gap: 12, color: palette.textLight, fontSize: 14 }}>
          <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${palette.border}`, borderTop: `2px solid ${palette.primary}`, animation: "spin 0.8s linear infinite" }} />
          Cargando inventario...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 14, padding: "18px 22px", marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 18 }}>⚠️</span>
          <div>
            <div style={{ fontWeight: 700, color: "#991B1B", fontSize: 13 }}>No se pudo conectar con el servidor</div>
            <div style={{ color: "#B91C1C", fontSize: 12, marginTop: 2 }}>{error} — Comprueba que Spring Boot está en <b>localhost:8080</b>.</div>
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${isMobile ? 2 : 3},1fr)`, gap: isMobile ? 10 : 14, marginBottom: isMobile ? 14 : 24 }}>
            <StatCard label="Total artículos" value={String(totalItems)} />
            <StatCard label="Stock crítico" value={String(criticos)} trend="Requieren reposición" trendColor={palette.primary} />
            <StatCard label="Próx. a caducar (30d)" value={String(proxCaducar)} trend="Revisar pronto" trendColor={palette.accent2} />
          </div>

          {/* Tabs + search + button */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            <FilterSelect value={tab} onChange={handleTab} options={TABS} minWidth={155} />
            <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center", ...(isMobile ? { width: "100%" } : {}) }}>
              <div style={{ position: "relative", flex: isMobile ? 1 : undefined }}>
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke={palette.textLight} strokeWidth={2} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                  <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                </svg>
                <input type="text" placeholder="Buscar producto..." value={searchTerm} onChange={(e) => handleSearch(e.target.value)}
                  style={{ paddingLeft: 32, paddingRight: 14, height: 34, borderRadius: 20, border: `1px solid ${palette.border}`, background: palette.bgCard, fontSize: 12.5, color: palette.textDark, width: isMobile ? "100%" : 196 }}
                  onFocus={(e) => (e.target.style.borderColor = palette.primaryMid)}
                  onBlur={(e) => (e.target.style.borderColor = palette.border)} />
              </div>
              <button onClick={handleNuevo} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 20, fontSize: 12.5, fontWeight: 600, border: "none", background: palette.primary, color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: `0 2px 10px ${palette.primary}33` }}>
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Agregar
              </button>
            </div>
          </div>

          {/* Mobile: tarjetas */}
          {isMobile && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {paginados.length === 0 ? (
                <div style={{ padding: "48px 0", textAlign: "center", color: palette.textLight, fontSize: 13 }}>No se encontraron artículos</div>
              ) : (
                paginados.map((item) => {
                  const pct = Math.round((item.stock / item.stockMax) * 100);
                  const estado = getEstado(item.stock, item.stockMax);
                  const dias = diasHastaCaducidad(item.caducidad);
                  const fechaStr = formatFecha(item.caducidad);
                  const caducWarning = dias !== null && dias <= 30;
                  return (
                    <div key={item.id} style={{ background: estado.label === "CRÍTICO" ? `${palette.primaryLt}88` : palette.bgCard, borderRadius: 12, border: `1px solid ${palette.border}`, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: palette.primaryLt, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{item.emoji}</div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: palette.textDark }}>{item.nombre}</div>
                            <div style={{ fontSize: 11, color: palette.textLight }}>{item.stock} {item.unidad} en stock</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                          <span style={{ display: "inline-flex", padding: "3.5px 10px", borderRadius: 20, background: estado.bg, color: estado.color, fontSize: 11, fontWeight: 700 }}>{estado.label}</span>
                          <div style={{ display: "flex", gap: 5 }}>
                            <button onClick={() => handleEditar(item)} style={{ width: 26, height: 26, borderRadius: 6, border: `1px solid ${palette.border}`, background: palette.bgCard, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: palette.primary }}>
                              <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </button>
                            <button onClick={() => setDeleteTarget(item)} style={{ width: 26, height: 26, borderRadius: 6, border: `1px solid ${palette.border}`, background: palette.bgCard, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#EF4444" }}>
                              <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                          <span style={{ fontSize: 11.5, fontWeight: 700, color: estado.color }}>{Math.min(pct, 100)}%</span>
                          <span style={{ fontSize: 11, color: palette.textLight }}>{item.categoria === "Materias Primas" ? "M. Prima" : "Material"}</span>
                        </div>
                        <div style={{ height: 6, borderRadius: 99, background: palette.border, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${Math.min(pct, 100)}%`, borderRadius: 99, background: estado.barColor, transition: "width 0.4s ease" }} />
                        </div>
                      </div>
                      {fechaStr && <div style={{ fontSize: 11, color: caducWarning ? palette.primary : palette.textLight }}>Caduca: {fechaStr}{caducWarning ? ` ⚠️ ${dias}d` : ""}</div>}
                    </div>
                  );
                })
              )}
              {totalPages > 1 && <div style={{ display: "flex", justifyContent: "center", marginTop: 4 }}>{paginationBtns}</div>}
            </div>
          )}

          {/* Desktop: tabla */}
          {!isMobile && (
            <div style={{ background: palette.bgCard, borderRadius: 14, border: `1px solid ${palette.border}`, boxShadow: "0 1px 4px oklch(0% 0 0 / 0.04)", overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "2.2fr 1.2fr 2.4fr 1fr 0.9fr 0.6fr", padding: "11px 22px", background: palette.bg, borderBottom: `1px solid ${palette.border}` }}>
                {["Producto", "Categoría", "Nivel de stock", "Caducidad", "Estado", ""].map((h) => (
                  <span key={h} style={{ fontSize: 10, fontWeight: 700, color: palette.textLight, letterSpacing: "0.8px", textTransform: "uppercase" }}>{h}</span>
                ))}
              </div>

              {paginados.length === 0 ? (
                <div style={{ padding: "48px 24px", textAlign: "center", color: palette.textLight, fontSize: 13 }}>No se encontraron artículos</div>
              ) : (
                paginados.map((item, i) => {
                  const pct = Math.round((item.stock / item.stockMax) * 100);
                  const estado = getEstado(item.stock, item.stockMax);
                  const dias = diasHastaCaducidad(item.caducidad);
                  const fechaStr = formatFecha(item.caducidad);
                  const caducWarning = dias !== null && dias <= 30;
                  return (
                    <div key={item.id}
                      style={{ display: "grid", gridTemplateColumns: "2.2fr 1.2fr 2.4fr 1fr 0.9fr 0.6fr", padding: "16px 22px", alignItems: "center", borderTop: i > 0 ? `1px solid ${palette.border}` : "none", transition: "background 0.12s", background: estado.label === "CRÍTICO" ? `${palette.primaryLt}88` : "transparent" }}
                      onMouseEnter={(e) => { if (estado.label !== "CRÍTICO") e.currentTarget.style.background = palette.bg; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = estado.label === "CRÍTICO" ? `${palette.primaryLt}88` : "transparent"; }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: palette.primaryLt, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{item.emoji}</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: palette.textDark }}>{item.nombre}</div>
                          <div style={{ fontSize: 11, color: palette.textLight, marginTop: 1 }}>{item.stock} {item.unidad} en stock</div>
                        </div>
                      </div>
                      <span style={{ display: "inline-flex", padding: "3px 9px", borderRadius: 20, background: item.categoria === "Materias Primas" ? palette.accent3Lt : palette.accent1Lt, color: item.categoria === "Materias Primas" ? palette.accent3 : palette.accent1, fontSize: 11, fontWeight: 600, width: "fit-content" }}>
                        {item.categoria === "Materias Primas" ? "M. Prima" : "Material"}
                      </span>
                      <div style={{ paddingRight: 20 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: estado.color }}>{Math.min(pct, 100)}%</span>
                          <span style={{ fontSize: 11, color: palette.textLight }}>{item.stock} {item.unidad}</span>
                        </div>
                        <div style={{ height: 6, borderRadius: 99, background: palette.border, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${Math.min(pct, 100)}%`, borderRadius: 99, background: estado.barColor, transition: "width 0.4s ease" }} />
                        </div>
                      </div>
                      <div>
                        {fechaStr ? (
                          <>
                            <div style={{ fontSize: 12, fontWeight: 600, color: caducWarning ? palette.primary : palette.textMid }}>{fechaStr}</div>
                            {caducWarning && <div style={{ fontSize: 11, color: palette.primary, marginTop: 1 }}>⚠️ {dias}d</div>}
                          </>
                        ) : (
                          <span style={{ fontSize: 12, color: palette.textLight }}>—</span>
                        )}
                      </div>
                      <span style={{ display: "inline-flex", padding: "3.5px 10px", borderRadius: 20, background: estado.bg, color: estado.color, fontSize: 11, fontWeight: 700, letterSpacing: "0.3px" }}>{estado.label}</span>
                      <div style={{ display: "flex", gap: 5 }}>
                        <button onClick={() => handleEditar(item)} title="Editar"
                          style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${palette.border}`, background: palette.bgCard, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: palette.primary, transition: "all 0.15s" }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = palette.primaryLt; e.currentTarget.style.borderColor = palette.primary; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = palette.bgCard; e.currentTarget.style.borderColor = palette.border; }}>
                          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => setDeleteTarget(item)} title="Eliminar"
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
                <span style={{ fontSize: 12, color: palette.textLight }}>{paginados.length} de {filtrados.length} artículos</span>
                {paginationBtns}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}