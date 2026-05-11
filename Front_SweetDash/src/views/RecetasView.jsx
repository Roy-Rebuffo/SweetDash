import { useState, useEffect } from "react";
import palette from "../theme/palette";
import { productosApi, procesosApi, pedidosApi, materiasPrimasApi, plantillasApi, recetasTamañoApi, tareasApi } from "../services/api";
import FilterSelect from "../components/FilterSelect";

// ── Helpers ───────────────────────────────────────────────────────────────────
const STRIPE_COLORS = [
  [palette.primaryLt, palette.primary + "22"],
  [palette.accent1Lt, palette.accent1 + "22"],
  [palette.accent2Lt, palette.accent2 + "22"],
  [palette.accent3Lt, palette.accent3 + "22"],
];

function getDificultad(pasos) {
  if (pasos === 0) return { label: "—", bg: palette.border, color: palette.textLight };
  if (pasos <= 3) return { label: "Baja", bg: palette.accent3Lt, color: palette.accent3 };
  if (pasos <= 6) return { label: "Media", bg: palette.accent2Lt, color: palette.accent2 };
  return { label: "Alta", bg: palette.primaryLt, color: palette.primary };
}

function PhotoPlaceholder({ idx, imagenUrl, tipo }) {
  const [sc1, sc2] = STRIPE_COLORS[idx % STRIPE_COLORS.length];
  const accentColors = [palette.primary, palette.accent1, palette.accent2, palette.accent3];
  const accentColor = accentColors[idx % accentColors.length];

  if (imagenUrl) {
    return (
      <div style={{ height: 130, background: `url(${imagenUrl}) center/cover no-repeat`, position: "relative" }}>
        <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(255,255,255,0.9)", borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700, color: palette.textMid }}>{tipo}</div>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", height: 130, background: sc1, overflow: "hidden" }}>
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id={`stripe-${idx}`} patternUnits="userSpaceOnUse" width="16" height="16" patternTransform="rotate(45)">
            <rect width="16" height="16" fill={sc1} />
            <rect width="8" height="16" fill={sc2} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#stripe-${idx})`} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke={accentColor} strokeWidth={1.6}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <span style={{ fontSize: 9.5, color: palette.textMid, background: "rgba(255,255,255,0.6)", padding: "2px 7px", borderRadius: 4 }}>foto de receta</span>
      </div>
      <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(255,255,255,0.85)", borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700, color: palette.textMid }}>{tipo}</div>
    </div>
  );
}

function RecetaCard({ producto, pasos, usada, idx, onEditar, onEliminar, onVer }) {
  const [hovered, setHovered] = useState(false);
  const dif = getDificultad(pasos);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onVer(producto)}
      style={{ background: palette.bgCard, borderRadius: 14, border: `1px solid ${hovered ? palette.primaryMid + "55" : palette.border}`, boxShadow: hovered ? `0 4px 20px ${palette.primary}0F` : "0 1px 4px oklch(0% 0 0 / 0.04)", overflow: "hidden", display: "flex", flexDirection: "column", transition: "all 0.18s ease", cursor: "pointer" }}
    >
      <PhotoPlaceholder idx={idx} imagenUrl={producto.imagenUrl} tipo={producto.tipo} />
      <div style={{ padding: "16px 18px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: 14.5, color: palette.textDark, marginBottom: 3, lineHeight: 1.3 }}>{producto.nombre}</div>
        <div style={{ fontSize: 11.5, color: palette.textLight, marginBottom: 12 }}>{producto.descripcion}</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 14 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: palette.textMid }}>
            <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke={palette.textLight} strokeWidth={1.8}><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 6v6l4 2" /></svg>
            {pasos > 0 ? `${pasos} paso${pasos !== 1 ? "s" : ""}` : "—"}
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: palette.textMid }}>
            <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke={palette.textLight} strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            {producto.cantidadPersonas || "—"}
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: palette.textMid }}>
            <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke={palette.textLight} strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0M8 10.5h4m-4 3h4" /></svg>
            € {producto.precioBase}
          </span>
          <span style={{ marginLeft: "auto", display: "inline-flex", padding: "2.5px 9px", borderRadius: 20, background: dif.bg, color: dif.color, fontSize: 10.5, fontWeight: 600 }}>{dif.label}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
          <span style={{ fontSize: 11, color: palette.textLight }}>
            {usada > 0 ? `Pedida ${usada} vez${usada !== 1 ? "es" : ""}` : "Sin pedidos aún"}
          </span>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={(e) => { e.stopPropagation(); onEditar(producto); }} title="Editar"
              style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${palette.border}`, background: palette.bgCard, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: palette.primary, transition: "all 0.15s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = palette.primaryLt; e.currentTarget.style.borderColor = palette.primary; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = palette.bgCard; e.currentTarget.style.borderColor = palette.border; }}>
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            </button>
            <button onClick={(e) => { e.stopPropagation(); onEliminar(producto); }} title="Eliminar"
              style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${palette.border}`, background: palette.bgCard, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#EF4444", transition: "all 0.15s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#FEF2F2"; e.currentTarget.style.borderColor = "#EF4444"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = palette.bgCard; e.currentTarget.style.borderColor = palette.border; }}>
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, valueColor }) {
  return (
    <div style={{ background: palette.bgCard, borderRadius: 14, border: `1px solid ${palette.border}`, boxShadow: "0 1px 4px oklch(0% 0 0 / 0.04)", padding: "20px 22px" }}>
      <div style={{ fontSize: 10.5, fontWeight: 600, color: palette.textLight, letterSpacing: "0.7px", textTransform: "uppercase", marginBottom: 10 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: valueColor || palette.textDark, letterSpacing: "-0.5px", lineHeight: 1 }}>{value}</div>
    </div>
  );
}

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

// ── Modal Vista (solo lectura) ────────────────────────────────────────────────
// ── Modal Vista (solo lectura) ────────────────────────────────────────────────
function VistaModal({ producto, onClose, onEditar }) {
  const [tamaños, setTamaños] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandidos, setExpandidos] = useState({});

  useEffect(() => {
    recetasTamañoApi.getByProducto(producto.idProducto)
      .then(async (tams) => {
        if (!tams || tams.length === 0) { setTamaños([]); return; }
        const tamañosConPasos = await Promise.all(
          tams.map(async (t) => {
            let pasos = [];
            let nombrePlantilla = null;
            if (t.idPlantilla) {
              try {
                const plantilla = await plantillasApi.getById(t.idPlantilla);
                const procs = await procesosApi.getByPlantilla(t.idPlantilla);
                pasos = [...procs].sort((a, b) => b.diasAntesEntrega - a.diasAntesEntrega);
                nombrePlantilla = plantilla?.nombre || null;
              } catch {}
            }
            return { ...t, pasos, nombrePlantilla };
          })
        );
        setTamaños(tamañosConPasos);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleExpandido = (i) => setExpandidos(e => ({ ...e, [i]: !e[i] }));

  const totalPasos = tamaños.reduce((acc, t) => acc + (t.pasos?.length || 0), 0);
  const dif = getDificultad(totalPasos);

  return (
    <div style={{ position: "fixed", inset: 0, background: "oklch(0% 0 0 / 0.4)", zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: 16, overflowY: "auto" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: palette.bgCard, borderRadius: 18, border: `1px solid ${palette.border}`, boxShadow: "0 8px 32px oklch(0% 0 0 / 0.14)", width: "100%", maxWidth: 580, margin: "auto" }}>

        {/* Foto / Header */}
        <div style={{ position: "relative", height: 160, borderRadius: "18px 18px 0 0", overflow: "hidden", background: producto.imagenUrl ? `url(${producto.imagenUrl}) center/cover no-repeat` : palette.primaryLt }}>
          {!producto.imagenUrl && (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke={palette.primary} strokeWidth={1.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          )}
          <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 8 }}>
            <button onClick={() => { onClose(); onEditar(producto); }}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 20, border: "none", background: palette.primary, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: `0 2px 8px ${palette.primary}55` }}>
              <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              Editar
            </button>
            <button onClick={onClose}
              style={{ width: 30, height: 30, borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.3)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div style={{ position: "absolute", bottom: 12, left: 16, background: "rgba(255,255,255,0.92)", borderRadius: 20, padding: "3px 12px", fontSize: 11, fontWeight: 700, color: palette.textMid }}>{producto.tipo}</div>
        </div>

        <div style={{ padding: 24 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 20, color: palette.textDark, marginBottom: 4 }}>{producto.nombre}</div>
          {producto.descripcion && <div style={{ fontSize: 13, color: palette.textMid, marginBottom: 16, lineHeight: 1.5 }}>{producto.descripcion}</div>}

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: palette.textMid, background: palette.bg, borderRadius: 20, padding: "4px 12px", border: `1px solid ${palette.border}` }}>
              <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke={palette.textLight} strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0M8 10.5h4m-4 3h4" /></svg>
              € {producto.precioBase}
            </span>
            {producto.cantidadPersonas && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: palette.textMid, background: palette.bg, borderRadius: 20, padding: "4px 12px", border: `1px solid ${palette.border}` }}>
                <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke={palette.textLight} strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                {producto.cantidadPersonas}
              </span>
            )}
            <span style={{ display: "inline-flex", padding: "4px 12px", borderRadius: 20, background: dif.bg, color: dif.color, fontSize: 12, fontWeight: 600 }}>
              {tamaños.length > 0 ? `${tamaños.length} tamaño${tamaños.length !== 1 ? "s" : ""}` : "Sin tamaños"}
            </span>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "24px 0", color: palette.textLight, fontSize: 13 }}>Cargando datos...</div>
          ) : (
            <>
              {/* Sección tamaños con escandallos y plantillas */}
              {tamaños.length === 0 ? (
                <div style={{ fontSize: 12, color: palette.textLight, background: palette.bg, borderRadius: 8, padding: "10px 14px", border: `1px dashed ${palette.border}` }}>
                  Sin tamaños ni escandallos definidos
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 11, fontWeight: 700, color: palette.primary, letterSpacing: "0.8px", textTransform: "uppercase", paddingBottom: 4, borderBottom: `1px solid ${palette.border}`, marginBottom: 12 }}>
                    Tamaños y elaboración
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {tamaños.map((t, i) => {
                      const coste = t.costeTotal ?? 0;
                      const pvp = t.precioVenta ?? 0;
                      const margen = pvp > 0 ? ((pvp - coste) / pvp * 100).toFixed(0) : null;
                      const isExp = !!expandidos[i];
                      return (
                        <div key={i} style={{ background: palette.bg, borderRadius: 12, border: `1px solid ${palette.border}`, overflow: "hidden" }}>

                          {/* Cabecera del tamaño */}
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", cursor: "pointer" }}
                            onClick={() => toggleExpandido(i)}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: palette.textDark }}>{t.descripcionTamaño || `Tamaño ${i + 1}`}</div>
                              {t.pasos?.length > 0 && (
                                <span style={{ fontSize: 10.5, color: palette.textMid, background: palette.bgCard, border: `1px solid ${palette.border}`, borderRadius: 20, padding: "2px 8px" }}>
                                  {t.pasos.length} paso{t.pasos.length !== 1 ? "s" : ""}
                                </span>
                              )}
                            </div>
                            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                              <span style={{ fontSize: 11, color: palette.textMid }}>Coste <b style={{ color: palette.textDark }}>€ {Number(coste).toFixed(2)}</b></span>
                              <span style={{ fontSize: 11, color: palette.textMid }}>PVP <b style={{ color: palette.primary }}>€ {Number(pvp).toFixed(2)}</b></span>
                              {margen !== null && (
                                <span style={{ fontSize: 11, fontWeight: 700, color: Number(margen) >= 40 ? palette.accent3 : palette.accent2, background: Number(margen) >= 40 ? palette.accent3Lt : palette.accent2Lt, borderRadius: 20, padding: "2px 8px" }}>
                                  {margen}%
                                </span>
                              )}
                              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke={palette.textLight} strokeWidth={2}
                                style={{ transform: isExp ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 0.2s", flexShrink: 0 }}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>

                          {/* Contenido expandido */}
                          {isExp && (
                            <div style={{ borderTop: `1px solid ${palette.border}`, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>

                              {/* Ingredientes */}
                              {t.ingredientes?.length > 0 && (
                                <div>
                                  <div style={{ fontSize: 10, fontWeight: 700, color: palette.textLight, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>Ingredientes</div>
                                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                                    {t.ingredientes.map((ing, j) => (
                                      <span key={j} style={{ fontSize: 10.5, color: palette.textMid, background: palette.bgCard, border: `1px solid ${palette.border}`, borderRadius: 6, padding: "2px 8px" }}>
                                        {ing.nombreMateriaPrima} · {ing.cantidadUsada} {ing.unidad || ""}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Plantilla del tamaño */}
                              <div>
                                <div style={{ fontSize: 10, fontWeight: 700, color: palette.textLight, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>
                                  Plantilla{t.nombrePlantilla ? ` · ${t.nombrePlantilla}` : ""}
                                </div>
                                {!t.pasos || t.pasos.length === 0 ? (
                                  <div style={{ fontSize: 11, color: palette.textLight, fontStyle: "italic" }}>Sin pasos definidos</div>
                                ) : (
                                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                    {t.pasos.map((paso, j) => (
                                      <div key={j} style={{ display: "flex", alignItems: "center", gap: 10, background: palette.bgCard, borderRadius: 8, border: `1px solid ${palette.border}`, padding: "8px 12px" }}>
                                        <div style={{ width: 26, height: 26, borderRadius: "50%", background: palette.primaryLt, border: `1px solid ${palette.primary}33`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                          <span style={{ fontSize: 9, fontWeight: 700, color: palette.primary }}>{paso.diasAntesEntrega}d</span>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                          <div style={{ fontSize: 12, fontWeight: 600, color: palette.textDark }}>{paso.nombre}</div>
                                          <div style={{ fontSize: 10.5, color: palette.textLight, marginTop: 1 }}>{paso.diasAntesEntrega} día{paso.diasAntesEntrega !== 1 ? "s" : ""} antes de la entrega</div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Subcomponente: un tamaño con sus ingredientes ─────────────────────────────
function TamañoRow({ tamaño, idx, materiasPrimas, onChange, onRemove, onDuplicate }) {
  const [collapsed, setCollapsed] = useState(true);
  const inputStyle = { height: 34, borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.bgCard, padding: "0 10px", fontSize: 12, color: palette.textDark, fontFamily: "'DM Sans', sans-serif", width: "100%" };
  const labelStyle = { fontSize: 10, fontWeight: 600, color: palette.textLight, textTransform: "uppercase", letterSpacing: "0.5px" };

  const addIng = () => {
    if (materiasPrimas.length === 0) return;
    onChange(idx, "ingredientes", [...tamaño.ingredientes, { idMateriaPrima: materiasPrimas[0].idMateriaPrima, cantidadUsada: "" }]);
  };
  const removeIng = (i) => onChange(idx, "ingredientes", tamaño.ingredientes.filter((_, j) => j !== i));
  const updateIng = (i, key, value) => onChange(idx, "ingredientes", tamaño.ingredientes.map((ing, j) => j !== i ? ing : { ...ing, [key]: value }));

  const addPaso = () => onChange(idx, "pasos", [...(tamaño.pasos || []), { nombre: "", diasAntesEntrega: 1 }]);
  const removePaso = (i) => onChange(idx, "pasos", tamaño.pasos.filter((_, j) => j !== i));
  const updatePaso = (i, key, value) => onChange(idx, "pasos", tamaño.pasos.map((p, j) => j !== i ? p : { ...p, [key]: value }));

  return (
    <div style={{ background: palette.bg, borderRadius: 12, border: `1px solid ${palette.border}`, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>

      {/* ── Cabecera ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto auto auto", gap: 10, alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label style={labelStyle}>Tamaño</label>
          <input type="text" value={tamaño.descripcionTamaño} onChange={e => onChange(idx, "descripcionTamaño", e.target.value)}
            placeholder="20cm · 8-10p / 450gr / 12 unidades..."
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = palette.primaryMid}
            onBlur={e => e.target.style.borderColor = palette.border} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label style={labelStyle}>Precio venta (€)</label>
          <input type="number" min="0" step="0.01" value={tamaño.precioVenta} onChange={e => onChange(idx, "precioVenta", e.target.value)}
            placeholder="35.00" style={inputStyle}
            onFocus={e => e.target.style.borderColor = palette.primaryMid}
            onBlur={e => e.target.style.borderColor = palette.border} />
        </div>
        <button onClick={() => setCollapsed(v => !v)}
          style={{ width: 30, height: 30, borderRadius: 7, border: `1px solid ${palette.border}`, background: palette.bgCard, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: palette.textMid, flexShrink: 0, marginTop: 16 }}>
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <button onClick={() => onDuplicate(idx)} title="Duplicar tamaño"
          style={{ width: 30, height: 30, borderRadius: 7, border: `1px solid ${palette.border}`, background: palette.bgCard, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: palette.accent3, flexShrink: 0, marginTop: 16 }}>
          <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
        </button>
        <button onClick={() => onRemove(idx)}
          style={{ width: 30, height: 30, borderRadius: 7, border: `1px solid ${palette.border}`, background: palette.bgCard, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#EF4444", flexShrink: 0, marginTop: 16 }}>
          <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {!collapsed && (
        <>
          {/* ── Ingredientes ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={labelStyle}>Ingredientes y cantidades</span>
              <button onClick={addIng} style={{ fontSize: 11, fontWeight: 600, color: palette.primary, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 3, fontFamily: "'DM Sans', sans-serif" }}>
                <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Añadir
              </button>
            </div>

            {tamaño.ingredientes.length === 0 && (
              <div style={{ fontSize: 11, color: palette.textLight, padding: "8px 0", textAlign: "center" }}>Sin ingredientes — pulsa Añadir</div>
            )}

            {tamaño.ingredientes.map((ing, i) => {
              const mp = materiasPrimas.find(m => m.idMateriaPrima === Number(ing.idMateriaPrima));
              return (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr auto", gap: 8, alignItems: "center" }}>
                  <select value={ing.idMateriaPrima} onChange={e => updateIng(i, "idMateriaPrima", Number(e.target.value))}
                    style={{ ...inputStyle, appearance: "none", fontSize: 12 }}
                    onFocus={e => e.target.style.borderColor = palette.primaryMid}
                    onBlur={e => e.target.style.borderColor = palette.border}>
                    {materiasPrimas.map(m => <option key={m.idMateriaPrima} value={m.idMateriaPrima}>{m.nombre} ({m.unidad})</option>)}
                  </select>
                  <div style={{ position: "relative" }}>
                    <input type="number" min="0" step="0.01" value={ing.cantidadUsada}
                      onChange={e => updateIng(i, "cantidadUsada", e.target.value)}
                      placeholder="180" style={{ ...inputStyle, paddingRight: mp ? 32 : 10, fontSize: 12 }}
                      onFocus={e => e.target.style.borderColor = palette.primaryMid}
                      onBlur={e => e.target.style.borderColor = palette.border} />
                    {mp && <span style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", fontSize: 10, color: palette.textLight, pointerEvents: "none" }}>{mp.unidad}</span>}
                  </div>
                  <button onClick={() => removeIng(i)} style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${palette.border}`, background: palette.bgCard, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#EF4444", flexShrink: 0 }}>
                    <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              );
            })}
          </div>

          {/* ── Plantilla del tamaño ── */}
          <div style={{ fontSize: 10, fontWeight: 700, color: palette.primary, letterSpacing: "0.8px", textTransform: "uppercase", paddingBottom: 4, borderBottom: `1px solid ${palette.border}`, marginTop: 4, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>Plantilla de elaboración</span>
            <button onClick={addPaso} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: palette.primary, background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "'DM Sans', sans-serif", textTransform: "none", letterSpacing: 0 }}>
              <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              Añadir paso
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={labelStyle}>Nombre plantilla</label>
              <input type="text" value={tamaño.nombrePlantilla} onChange={e => onChange(idx, "nombrePlantilla", e.target.value)}
                placeholder={tamaño.descripcionTamaño || "Nombre de la plantilla..."}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = palette.primaryMid}
                onBlur={e => e.target.style.borderColor = palette.border} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={labelStyle}>Descripción plantilla</label>
              <input type="text" value={tamaño.descripcionPlantilla} onChange={e => onChange(idx, "descripcionPlantilla", e.target.value)}
                placeholder="Proceso de 3 días..."
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = palette.primaryMid}
                onBlur={e => e.target.style.borderColor = palette.border} />
            </div>
          </div>

          {(tamaño.pasos || []).length === 0 && (
            <div style={{ fontSize: 11, color: palette.textLight, padding: "8px 0", textAlign: "center" }}>Pulsa "Añadir paso" para definir los pasos de elaboración</div>
          )}

          {(tamaño.pasos || []).map((paso, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 8, alignItems: "center", background: palette.bgCard, borderRadius: 9, border: `1px solid ${palette.border}`, padding: "8px 10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 18, height: 18, borderRadius: "50%", background: palette.primaryLt, border: `1px solid ${palette.primary}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, color: palette.primary, flexShrink: 0 }}>{i + 1}</span>
                <input value={paso.nombre} onChange={e => updatePaso(i, "nombre", e.target.value)}
                  placeholder="Ej: Hacer el bizcocho..."
                  style={{ ...inputStyle, fontSize: 12 }}
                  onFocus={e => e.target.style.borderColor = palette.primaryMid}
                  onBlur={e => e.target.style.borderColor = palette.border} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <span style={{ fontSize: 9, color: palette.textLight, whiteSpace: "nowrap" }}>Días antes</span>
                <input type="number" min="0" value={paso.diasAntesEntrega} onChange={e => updatePaso(i, "diasAntesEntrega", e.target.value)}
                  style={{ ...inputStyle, width: 60, fontSize: 12, textAlign: "center" }}
                  onFocus={e => e.target.style.borderColor = palette.primaryMid}
                  onBlur={e => e.target.style.borderColor = palette.border} />
              </div>
              <button onClick={() => removePaso(i)} style={{ width: 30, height: 34, borderRadius: 7, border: `1px solid ${palette.border}`, background: palette.bgCard, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#EF4444", flexShrink: 0 }}>
                <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          ))}

          {(tamaño.pasos || []).length > 0 && (
            <div style={{ background: palette.accent3Lt, borderRadius: 8, padding: "8px 12px", fontSize: 11, color: palette.accent3, display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              "Días antes" indica cuántos días antes de la entrega se realiza ese paso.
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Modal Receta/Producto ─────────────────────────────────────────────────────
const EMPTY_PROD = { nombre: "", descripcion: "", tipo: "", cantidadPersonas: "", precioBase: "" };
const EMPTY_TAMAÑO = () => ({
  id: null,
  descripcionTamaño: "",
  precioVenta: "",
  ingredientes: [],
  idPlantilla: null,
  nombrePlantilla: "",
  descripcionPlantilla: "",
  pasos: [],
  plantillaCollapsed: true,
});
function RecetaModal({ producto, onClose, onSaved }) {
  const isEdit = !!producto;

  const [materiasPrimas, setMateriasPrimas] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [avisoHueco, setAvisoHueco] = useState(null);

  const [form, setForm] = useState(isEdit ? {
    nombre: producto.nombre || "",
    descripcion: producto.descripcion || "",
    tipo: producto.tipo || "",
    cantidadPersonas: producto.cantidadPersonas || "",
    precioBase: producto.precioBase || "",
  } : EMPTY_PROD);

  const [imagenFile, setImagenFile] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(producto?.imagenUrl || null);
  const [plantillaNombre, setPlantillaNombre] = useState("");
  const [plantillaDescripcion, setPlantillaDescripcion] = useState("");
  const [pasos, setPasos] = useState([]);
  const [plantillaExistenteId, setPlantillaExistenteId] = useState(null);
  const [tamaños, setTamaños] = useState([]);
  const [plantillaCollapsed, setPlantillaCollapsed] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const promises = [materiasPrimasApi.getAll()];
    if (isEdit) {
      promises.push(recetasTamañoApi.getByProducto(producto.idProducto));
    }

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
                return {
                  id: t.id,
                  descripcionTamaño: t.descripcionTamaño || "",
                  precioVenta: t.precioVenta || "",
                  ingredientes: (t.ingredientes || []).map(i => ({ idMateriaPrima: i.idMateriaPrima, cantidadUsada: i.cantidadUsada })),
                  idPlantilla: t.idPlantilla,
                  nombrePlantilla: plantilla.nombre || "",
                  descripcionPlantilla: plantilla.descripcion || "",
                  pasos,
                  plantillaCollapsed: true,
                };
              } catch { }
            }
            return {
              id: t.id,
              descripcionTamaño: t.descripcionTamaño || "",
              precioVenta: t.precioVenta || "",
              ingredientes: (t.ingredientes || []).map(i => ({ idMateriaPrima: i.idMateriaPrima, cantidadUsada: i.cantidadUsada })),
              idPlantilla: null,
              nombrePlantilla: "",
              descripcionPlantilla: "",
              pasos: [],
              plantillaCollapsed: true,
            };
          })
        );
        setTamaños(tamañosConPasos);
      }
    }).finally(() => setLoadingData(false));
  }, []);



  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagenFile(file);
    setImagenPreview(URL.createObjectURL(file));
  };

  const addPaso = () => setPasos((l) => [...l, { nombre: "", diasAntesEntrega: 1 }]);
  const removePaso = (idx) => {
    const pasoaBorrar = pasos[idx];
    const nuevosPasos = pasos.filter((_, i) => i !== idx);
    const diasBorrado = Number(pasoaBorrar.diasAntesEntrega);
    const quedaOtroConMismoDia = nuevosPasos.some(p => Number(p.diasAntesEntrega) === diasBorrado);
    if (!quedaOtroConMismoDia) setAvisoHueco({ diasBorrado });
    setPasos(nuevosPasos);
  };
  const updatePaso = (idx, key, value) => setPasos((l) => l.map((item, i) => i !== idx ? item : { ...item, [key]: value }));

  const addTamaño = () => setTamaños(l => [...l, EMPTY_TAMAÑO()]);
  const removeTamaño = (idx) => setTamaños(l => l.filter((_, i) => i !== idx));
  const updateTamaño = (idx, key, value) => setTamaños(l => l.map((item, i) => i !== idx ? item : { ...item, [key]: value }));

  const duplicarTamaño = (idx) => {
    const original = tamaños[idx];
    const copia = {
      id: null,
      descripcionTamaño: original.descripcionTamaño + " (copia)",
      precioVenta: original.precioVenta,
      ingredientes: original.ingredientes.map(i => ({ ...i })),
      idPlantilla: null, // nueva plantilla, se creará al guardar
      nombrePlantilla: original.nombrePlantilla,
      descripcionPlantilla: original.descripcionPlantilla,
      pasos: original.pasos.map(p => ({ nombre: p.nombre, diasAntesEntrega: p.diasAntesEntrega })), // sin idProceso
      plantillaCollapsed: true,
    };
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

      if (isEdit) {
        await productosApi.update(producto.idProducto, payload);
        productoId = producto.idProducto;
      } else {
        const nuevo = await productosApi.create(payload);
        productoId = nuevo.idProducto;
      }

      if (imagenFile) await productosApi.subirImagen(productoId, imagenFile);

      if (plantillaNombre.trim() || pasos.length > 0) {
        let plantillaId = plantillaExistenteId;
        if (plantillaId) {
          await plantillasApi.update(plantillaId, { nombre: plantillaNombre, descripcion: plantillaDescripcion });
          const pasosActuales = await procesosApi.getByPlantilla(plantillaId);
          for (const p of pasosActuales) await procesosApi.delete(p.idProceso);
        } else {
          const nuevaPlantilla = await plantillasApi.create({ nombre: plantillaNombre || form.nombre, descripcion: plantillaDescripcion });
          plantillaId = nuevaPlantilla.idPlantilla;
        }
        await procesosApi.vincularProducto(productoId, plantillaId);
        await tareasApi.recalcularPorPlantilla(plantillaId);
        for (const paso of pasos) {
          if (!paso.nombre.trim()) continue;
          await procesosApi.create({ nombre: paso.nombre, diasAntesEntrega: Number(paso.diasAntesEntrega), plantillaProceso: { idPlantilla: plantillaId } });
        }
        await procesosApi.vincularProducto(productoId, plantillaId);
        await tareasApi.recalcularPorPlantilla(plantillaId);
      }

      // Plantilla por tamaño
      for (const tam of tamaños) {
        if (!tam.precioVenta) continue;

        // Gestionar plantilla del tamaño
        let plantillaId = tam.idPlantilla;
        if (tam.pasos.length > 0 || tam.nombrePlantilla.trim()) {
          if (plantillaId) {
            await plantillasApi.update(plantillaId, { nombre: tam.nombrePlantilla || tam.descripcionTamaño, descripcion: tam.descripcionPlantilla });
            const pasosActuales = await procesosApi.getByPlantilla(plantillaId);
            for (const p of pasosActuales) await procesosApi.delete(p.idProceso);
          } else {
            const nuevaPlantilla = await plantillasApi.create({ nombre: tam.nombrePlantilla || tam.descripcionTamaño || "Plantilla", descripcion: tam.descripcionPlantilla });
            plantillaId = nuevaPlantilla.idPlantilla;
          }
          for (const paso of tam.pasos) {
            if (!paso.nombre.trim()) continue;
            await procesosApi.create({ nombre: paso.nombre, diasAntesEntrega: Number(paso.diasAntesEntrega), plantillaProceso: { idPlantilla: plantillaId } });
          }
          if (plantillaId) await tareasApi.recalcularPorPlantilla(plantillaId);
        }

        const tamPayload = {
          idProducto: productoId,
          descripcionTamaño: tam.descripcionTamaño || null,
          precioVenta: Number(tam.precioVenta),
          idPlantilla: plantillaId || null,
          ingredientes: tam.ingredientes
            .filter(i => i.cantidadUsada)
            .map(i => ({ idMateriaPrima: Number(i.idMateriaPrima), cantidadUsada: Number(i.cantidadUsada) })),
        };
        if (tam.id) await recetasTamañoApi.update(tam.id, tamPayload);
        else await recetasTamañoApi.create(tamPayload);
      }

      onSaved();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
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

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
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
              Define el precio de venta y los ingredientes para cada tamaño. Los costes y márgenes se calcularán automáticamente en la sección de Costes.
            </div>
            {tamaños.length === 0 && (
              <div style={{ padding: "14px", textAlign: "center", color: palette.textLight, fontSize: 12, background: palette.bg, borderRadius: 8, border: `1px dashed ${palette.border}` }}>
                Pulsa "Añadir tamaño" para definir escandallos de coste
              </div>
            )}
            {tamaños.map((tam, idx) => (
              <TamañoRow key={idx} tamaño={tam} idx={idx} materiasPrimas={materiasPrimas} onChange={updateTamaño} onRemove={removeTamaño} onDuplicate={duplicarTamaño} />
            ))}

            {/* ── Plantilla de elaboración ── */}
            <div style={{ fontSize: 11, fontWeight: 700, color: palette.primary, letterSpacing: "0.8px", textTransform: "uppercase", paddingBottom: 4, borderBottom: `1px solid ${palette.border}`, marginTop: 4, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>Plantilla de elaboración</span>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {!plantillaCollapsed && (
                  <button onClick={addPaso} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: palette.primary, background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "'DM Sans', sans-serif", textTransform: "none", letterSpacing: 0 }}>
                    <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                    Añadir paso
                  </button>
                )}
                <button onClick={() => setPlantillaCollapsed(v => !v)}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", color: palette.textLight }}>
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ transform: plantillaCollapsed ? "rotate(-90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>

            {!plantillaCollapsed && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    <label style={labelStyle}>Nombre plantilla</label>
                    <input value={plantillaNombre} onChange={(e) => setPlantillaNombre(e.target.value)} placeholder="Proceso tarta fondant..." style={inputStyle} onFocus={(e) => (e.target.style.borderColor = palette.primaryMid)} onBlur={(e) => (e.target.style.borderColor = palette.border)} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    <label style={labelStyle}>Descripción plantilla</label>
                    <input value={plantillaDescripcion} onChange={(e) => setPlantillaDescripcion(e.target.value)} placeholder="Proceso de 3 días..." style={inputStyle} onFocus={(e) => (e.target.style.borderColor = palette.primaryMid)} onBlur={(e) => (e.target.style.borderColor = palette.border)} />
                  </div>
                </div>

                {pasos.length === 0 && (
                  <div style={{ padding: "14px", textAlign: "center", color: palette.textLight, fontSize: 12, background: palette.bg, borderRadius: 8, border: `1px dashed ${palette.border}` }}>
                    Pulsa "Añadir paso" para definir los pasos de elaboración
                  </div>
                )}

                {pasos.map((paso, idx) => (
                  <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 8, alignItems: "center", background: palette.bg, borderRadius: 10, border: `1px solid ${palette.border}`, padding: "10px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 20, height: 20, borderRadius: "50%", background: palette.primaryLt, border: `1px solid ${palette.primary}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: palette.primary, flexShrink: 0 }}>{idx + 1}</span>
                      <input value={paso.nombre} onChange={(e) => updatePaso(idx, "nombre", e.target.value)} placeholder="Ej: Hacer el bizcocho..."
                        style={{ ...inputStyle, fontSize: 12 }}
                        onFocus={(e) => (e.target.style.borderColor = palette.primaryMid)}
                        onBlur={(e) => (e.target.style.borderColor = palette.border)} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                      <span style={{ fontSize: 9, color: palette.textLight, whiteSpace: "nowrap" }}>Días antes</span>
                      <input type="number" min="0" value={paso.diasAntesEntrega} onChange={(e) => updatePaso(idx, "diasAntesEntrega", e.target.value)}
                        style={{ ...inputStyle, width: 64, fontSize: 12, textAlign: "center" }}
                        onFocus={(e) => (e.target.style.borderColor = palette.primaryMid)}
                        onBlur={(e) => (e.target.style.borderColor = palette.border)} />
                    </div>
                    <button onClick={() => removePaso(idx)} style={{ width: 34, height: 36, borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.bgCard, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#EF4444", flexShrink: 0 }}>
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                ))}

                {pasos.length > 0 && (
                  <div style={{ background: palette.accent3Lt, borderRadius: 8, padding: "10px 14px", fontSize: 12, color: palette.accent3, display: "flex", alignItems: "center", gap: 8 }}>
                    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    "Días antes" indica cuántos días antes de la entrega se realiza ese paso.
                  </div>
                )}

                {avisoHueco && (
                  <div style={{ background: palette.accent2Lt, border: `1px solid ${palette.accent2}44`, borderRadius: 10, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke={palette.accent2} strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: palette.accent2 }}>El día {avisoHueco.diasBorrado} antes de la entrega se ha quedado sin ningún paso.</span>
                    </div>
                    <div style={{ fontSize: 12, color: palette.textMid }}>¿Quieres ajustar los días de los pasos restantes?</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => setAvisoHueco(null)} style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.bg, fontSize: 12, fontWeight: 600, color: palette.textMid, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Dejar como está</button>
                      <button onClick={() => setAvisoHueco(null)} style={{ padding: "6px 14px", borderRadius: 8, border: "none", background: palette.accent2, fontSize: 12, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Ajustar días manualmente</button>
                    </div>
                  </div>
                )}
              </>
            )}

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

// ── Modal confirmar borrado ───────────────────────────────────────────────────
function ConfirmModal({ nombre, onClose, onConfirm, loading }) {
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

// ── Vista principal ───────────────────────────────────────────────────────────
export default function RecetasView({ isMobile = false, productoParaEditar = null, onClearEditar }) {
  const [productos, setProductos] = useState([]);
  const [procesos, setProcesos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [catActiva, setCatActiva] = useState("Todas");
  const [modalOpen, setModalOpen] = useState(false);
  const [editProducto, setEditProducto] = useState(null);
  const [verProducto, setVerProducto] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const cargarDatos = () => {
    setLoading(true);
    Promise.all([productosApi.getAll(), procesosApi.getAll(), pedidosApi.getAll()])
      .then(([prods, procs, peds]) => { setProductos(prods); setProcesos(procs); setPedidos(peds); setError(null); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { cargarDatos(); }, []);

  useEffect(() => {
    if (productoParaEditar) {
      setEditProducto(productoParaEditar);
      setModalOpen(true);
      onClearEditar && onClearEditar();
    }
  }, [productoParaEditar]);

  const handleNuevo = () => { setEditProducto(null); setModalOpen(true); };
  const handleEditar = (p) => { setVerProducto(null); setEditProducto(p); setModalOpen(true); };
  const handleSaved = () => { setModalOpen(false); cargarDatos(); };

  const handleEliminar = async () => {
    setDeleting(true);
    try {
      const tamañosExistentes = await recetasTamañoApi.getByProducto(deleteTarget.idProducto);
      for (const t of tamañosExistentes) await recetasTamañoApi.delete(t.id);
      if (deleteTarget.idPlantilla) {
        await productosApi.desvincularPlantilla(deleteTarget.idProducto);
        const pasosActuales = await procesosApi.getByPlantilla(deleteTarget.idPlantilla);
        for (const p of pasosActuales) await procesosApi.delete(p.idProceso);
        await plantillasApi.delete(deleteTarget.idPlantilla);
      }
      await productosApi.delete(deleteTarget.idProducto);
      setDeleteTarget(null);
      cargarDatos();
    } catch (e) {
      alert("Error al eliminar: " + e.message);
    } finally {
      setDeleting(false);
    }
  };

  // Fix: cruzar producto → idPlantilla → procesos de esa plantilla
  function getPasos(producto) {
    if (!producto.idPlantilla) return 0;
    return procesos.filter((p) => p.idPlantilla === producto.idPlantilla).length;
  }

  const pedidosEntregados = pedidos.filter((p) => p.estado === "Entregado").length;
  const categorias = ["Todas", ...Array.from(new Set(productos.map((p) => p.tipo)))];
  const tiempoPromedio = productos.length > 0
    ? Math.round(productos.reduce((acc, p) => acc + getPasos(p), 0) / productos.length)
    : 0;

  const filtrados = productos.filter((p) => {
    const matchSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || (p.tipo || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = catActiva === "Todas" || p.tipo === catActiva;
    return matchSearch && matchCat;
  });

  return (
    <div style={{ maxWidth: 1150, margin: "0 auto", position: "relative" }}>

      {verProducto && (
        <VistaModal
          producto={verProducto}
          onClose={() => setVerProducto(null)}
          onEditar={handleEditar}
        />
      )}
      {modalOpen && <RecetaModal producto={editProducto} onClose={() => setModalOpen(false)} onSaved={handleSaved} />}
      {deleteTarget && <ConfirmModal nombre={deleteTarget.nombre} onClose={() => setDeleteTarget(null)} onConfirm={handleEliminar} loading={deleting} />}

      {loading && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, gap: 12, color: palette.textLight, fontSize: 14 }}>
          <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${palette.border}`, borderTop: `2px solid ${palette.primary}`, animation: "spin 0.8s linear infinite" }} />
          Cargando recetas...
        </div>
      )}

      {!loading && error && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 14, padding: "18px 22px", marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 18 }}>⚠️</span>
          <div>
            <div style={{ fontWeight: 700, color: "#991B1B", fontSize: 13 }}>No se pudo conectar con el servidor</div>
            <div style={{ color: "#B91C1C", fontSize: 12, marginTop: 2 }}>{error}</div>
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${isMobile ? 2 : 4},1fr)`, gap: isMobile ? 10 : 14, marginBottom: isMobile ? 14 : 24 }}>
            <StatCard label="Total productos" value={String(productos.length)} />
            <StatCard label="Tipos distintos" value={String(categorias.length - 1)} valueColor={palette.accent1} />
            <StatCard label="Pedidos entregados" value={String(pedidosEntregados)} valueColor={palette.accent3} />
            <StatCard label="Pasos promedio" value={`${tiempoPromedio} pasos`} valueColor={palette.accent2} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
            <FilterSelect value={catActiva} onChange={(v) => { setCatActiva(v); setSearchTerm(""); }} options={categorias} minWidth={130} />
            <div style={{ marginLeft: isMobile ? 0 : "auto", display: "flex", gap: 8, alignItems: "center", ...(isMobile ? { width: "100%" } : {}) }}>
              <div style={{ position: "relative", flex: isMobile ? 1 : undefined }}>
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke={palette.textLight} strokeWidth={2} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                  <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                </svg>
                <input type="text" placeholder="Buscar receta..." value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCatActiva("Todas"); }}
                  style={{ paddingLeft: 32, paddingRight: 14, height: 34, borderRadius: 20, border: `1px solid ${palette.border}`, background: palette.bgCard, fontSize: 12.5, color: palette.textDark, width: isMobile ? "100%" : 196 }}
                  onFocus={(e) => (e.target.style.borderColor = palette.primaryMid)}
                  onBlur={(e) => (e.target.style.borderColor = palette.border)} />
              </div>
              <button onClick={handleNuevo} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 20, fontSize: 12.5, fontWeight: 600, border: "none", background: palette.primary, color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: `0 2px 10px ${palette.primary}33` }}>
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Nueva receta
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: `repeat(${isMobile ? 1 : 3},1fr)`, gap: 16 }}>
            {filtrados.map((p, i) => (
              <RecetaCard
                key={p.idProducto}
                producto={p}
                pasos={getPasos(p)}
                usada={0}
                idx={i}
                onVer={setVerProducto}
                onEditar={handleEditar}
                onEliminar={setDeleteTarget}
              />
            ))}
            {filtrados.length === 0 && (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 0", color: palette.textLight, fontSize: 13 }}>No se encontraron recetas</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}