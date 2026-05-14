import { useState, useEffect } from "react";
import palette from "../../../theme/palette";
import { recetasTamañoApi, plantillasApi, procesosApi } from "../../../services/api";

export default function VistaModal({ producto, onClose, onEditar }) {
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
              } catch { }
            }
            return { ...t, pasos, nombrePlantilla };
          })
        );
        setTamaños(tamañosConPasos);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const toggleExpandido = (i) => setExpandidos(e => ({ ...e, [i]: !e[i] }));

  return (
    <div style={{ position: "fixed", inset: 0, background: "oklch(0% 0 0 / 0.4)", zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: 16, overflowY: "auto" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: palette.bgCard, borderRadius: 18, border: `1px solid ${palette.border}`, boxShadow: "0 8px 32px oklch(0% 0 0 / 0.14)", width: "100%", maxWidth: 580, margin: "auto" }}>

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
            <span style={{ display: "inline-flex", padding: "4px 12px", borderRadius: 20, background: tamaños.length > 0 ? palette.accent1Lt : palette.border, color: tamaños.length > 0 ? palette.accent1 : palette.textLight, fontSize: 12, fontWeight: 600 }}>
              {tamaños.length > 0 ? `${tamaños.length} tamaño${tamaños.length !== 1 ? "s" : ""}` : "Sin tamaños"}
            </span>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "24px 0", color: palette.textLight, fontSize: 13 }}>Cargando datos...</div>
          ) : (
            <>
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
                          {isExp && (
                            <div style={{ borderTop: `1px solid ${palette.border}`, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
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
