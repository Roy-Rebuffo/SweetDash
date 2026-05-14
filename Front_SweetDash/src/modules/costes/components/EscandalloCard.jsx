import { useState } from "react";
import palette from "../../../theme/palette";
import { fmt, pct, margenColor, margenBg } from "../costesUtils";

export default function EscandalloCard({ receta, isMobile = false }) {
  const [expanded, setExpanded] = useState(false);
  const margen = receta.margenPct ? Number(receta.margenPct) : null;

  return (
    <div style={{ background: palette.bgCard, borderRadius: 12, border: `1px solid ${palette.border}`, overflow: "hidden" }}>

      {/* ── Cabecera ── */}
      <div style={{ padding: isMobile ? "12px 14px" : "14px 16px", cursor: "pointer" }}
        onClick={() => setExpanded(e => !e)}>

        {isMobile ? (
          /* Mobile: título + badge en fila, KPIs debajo siempre visibles */
          <>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: palette.textDark, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {receta.descripcionTamaño || (receta.tamañoCm ? `${receta.tamañoCm} cm` : "Sin tamaño")}
                </div>
                <div style={{ fontSize: 11, color: palette.textLight, marginTop: 2 }}>
                  {receta.ingredientes?.length || 0} ingrediente{receta.ingredientes?.length !== 1 ? "s" : ""}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <div style={{ background: margenBg(margen), borderRadius: 20, padding: "4px 10px" }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: margenColor(margen) }}>{pct(margen)}</span>
                </div>
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke={palette.textLight} strokeWidth={2}
                  style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* KPI row siempre visible en mobile */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, marginTop: 10, paddingTop: 10, borderTop: `1px solid ${palette.border}` }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: palette.textLight, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2 }}>Coste</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: palette.textDark }}>{fmt(receta.costeTotal)}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: palette.textLight, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2 }}>PVP</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: palette.primary }}>{fmt(receta.precioVenta)}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: palette.textLight, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2 }}>Ganancia</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#16A34A" }}>{fmt(receta.ganancia)}</div>
              </div>
            </div>
          </>
        ) : (
          /* Desktop: layout original en una sola fila */
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: palette.textDark }}>
                {receta.descripcionTamaño || (receta.tamañoCm ? `${receta.tamañoCm} cm` : "Sin tamaño")}
              </div>
              <div style={{ fontSize: 11, color: palette.textLight, marginTop: 2 }}>
                {receta.ingredientes?.length || 0} ingrediente{receta.ingredientes?.length !== 1 ? "s" : ""}
              </div>
            </div>

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
                <div style={{ fontSize: 10, color: palette.textLight, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Ganancia</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#16A34A" }}>{fmt(receta.ganancia)}</div>
              </div>
              <div style={{ background: margenBg(margen), borderRadius: 20, padding: "4px 10px", textAlign: "center", minWidth: 56 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: margenColor(margen) }}>{pct(margen)}</div>
                <div style={{ fontSize: 9, color: margenColor(margen), opacity: 0.8 }}>margen</div>
              </div>
            </div>

            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke={palette.textLight} strokeWidth={2}
              style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}
      </div>

      {/* ── Detalle ingredientes ── */}
      {expanded && (
        <div style={{ borderTop: `1px solid ${palette.border}`, padding: isMobile ? "12px 14px" : "14px 16px" }}>
          {isMobile && (
            <div style={{ fontSize: 10, fontWeight: 700, color: palette.textLight, letterSpacing: "0.7px", textTransform: "uppercase", marginBottom: 10 }}>
              Ingredientes · {receta.ingredientes?.length || 0}
            </div>
          )}

          {receta.ingredientes?.length === 0 && (
            <div style={{ fontSize: 12, color: palette.textLight, padding: "8px 0" }}>Sin ingredientes definidos</div>
          )}

          {isMobile ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {receta.ingredientes?.map((ing) => (
                <div key={ing.id} style={{ background: palette.bg, border: `1px solid ${palette.border}`, borderRadius: 10, padding: "10px 12px", minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 6, marginBottom: 4, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: palette.textDark, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ing.nombreMateriaPrima}</div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: palette.primary, flexShrink: 0 }}>{fmt(ing.costeIngrediente)}</div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: palette.textLight, gap: 6, minWidth: 0 }}>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }}>{ing.cantidadUsada} {ing.unidad} · paq. {ing.unidadesPaquete} {ing.unidad}</span>
                    <span style={{ flexShrink: 0 }}>{fmt(ing.precioPaquete)}/paq.</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 8, paddingBottom: 8, borderBottom: `1px solid ${palette.border}`, marginBottom: 8 }}>
                {["Ingrediente", "Cantidad", "Paquete", "Precio/paq.", "Coste"].map(h => (
                  <span key={h} style={{ fontSize: 10, fontWeight: 700, color: palette.textLight, letterSpacing: "0.6px", textTransform: "uppercase" }}>{h}</span>
                ))}
              </div>
              {receta.ingredientes?.map((ing, i) => (
                <div key={ing.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 8, padding: "7px 0", borderTop: i > 0 ? `1px solid ${palette.border}` : "none", alignItems: "center" }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: palette.textDark }}>{ing.nombreMateriaPrima}</span>
                  <span style={{ fontSize: 12, color: palette.textMid }}>{ing.cantidadUsada} {ing.unidad}</span>
                  <span style={{ fontSize: 12, color: palette.textMid }}>{ing.unidadesPaquete} {ing.unidad}</span>
                  <span style={{ fontSize: 12, color: palette.textMid }}>{fmt(ing.precioPaquete)}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: palette.primary }}>{fmt(ing.costeIngrediente)}</span>
                </div>
              ))}
            </>
          )}

          {/* Resumen */}
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${palette.border}`, ...(isMobile ? { display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 8 } : { display: "flex", justifyContent: "flex-end", gap: 28 }) }}>
            <div style={{ textAlign: isMobile ? "center" : "right" }}>
              <div style={{ fontSize: 10, color: palette.textLight, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Coste</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: palette.textDark }}>{fmt(receta.costeTotal)}</div>
            </div>
            <div style={{ textAlign: isMobile ? "center" : "right" }}>
              <div style={{ fontSize: 10, color: palette.textLight, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Ganancia</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#16A34A" }}>{fmt(receta.ganancia)}</div>
            </div>
            <div style={{ textAlign: isMobile ? "center" : "right" }}>
              <div style={{ fontSize: 10, color: palette.textLight, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Margen</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: margenColor(margen) }}>{pct(margen)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
