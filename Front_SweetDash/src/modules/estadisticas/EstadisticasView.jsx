import palette from "../../theme/palette";
import { formatFecha } from "../../utils/helpers";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from "recharts";
import useEstadisticas from "./hooks/useEstadisticas";
import KPICard from "./components/KPICard";
import CustomTooltip from "./components/CustomTooltip";
import { CATEGORIA_COLORES, FILTROS_PERIODO, NAV_TABS, getNombreCliente, categoriaProducto } from "./estadisticasUtils";

export default function EstadisticasView({ isMobile = false }) {
  const {
    tab, setTab,
    periodo, handleSetPeriodo,
    loading, error,
    pedidosFiltrados,
    totalIngresos, ticketMedio, clientesUnicos, pedidosEntregados,
    datosMensuales, datosCat, topProductos, topClientes,
    prodMap, catMap,
    historicoPedidos, histPage, setHistPage, histTotal, histPaginados,
    detallesMap,
  } = useEstadisticas();

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, gap: 12, color: palette.textLight, fontSize: 14 }}>
      <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${palette.border}`, borderTop: `2px solid ${palette.primary}`, animation: "spin 0.8s linear infinite" }} />
      Calculando estadísticas...
    </div>
  );

  if (error) return (
    <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 14, padding: "18px 22px", display: "flex", gap: 12, alignItems: "center" }}>
      <span style={{ fontSize: 18 }}>⚠️</span>
      <div style={{ fontSize: 13, color: "#991B1B" }}>{error}</div>
    </div>
  );

  const inputStyle = { fontSize: 12, padding: "6px 12px", borderRadius: 20, border: `1px solid ${palette.border}`, background: palette.bgCard, color: palette.textDark, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", appearance: "none" };

  return (
    <div style={{ maxWidth: 1150, margin: "0 auto", width: "100%", overflowX: "hidden" }}>

      {/* Header + filtros */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: palette.textDark }}>Estadísticas</div>
          <div style={{ fontSize: 12, color: palette.textLight, marginTop: 2 }}>{pedidosFiltrados.length} pedidos analizados</div>
        </div>
        <select value={periodo} onChange={(e) => handleSetPeriodo(e.target.value)} style={inputStyle}>
          {FILTROS_PERIODO.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, background: palette.bg, borderRadius: 12, padding: 4, width: isMobile ? "100%" : "fit-content", overflowX: isMobile ? "auto" : undefined, border: `1px solid ${palette.border}` }}>
        {NAV_TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{ padding: "7px 18px", borderRadius: 9, border: "none", fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s", background: tab === t.key ? palette.primary : "transparent", color: tab === t.key ? "#fff" : palette.textMid, flexShrink: 0 }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── DASHBOARD ── */}
      {tab === "dashboard" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${isMobile ? 2 : 4}, minmax(0,1fr))`, gap: 14 }}>
            <KPICard label="Ingresos totales" value={`€ ${totalIngresos.toFixed(0)}`} sub="precio de venta" color={palette.primary} icon="💰" />
            <KPICard label="Ticket medio" value={`€ ${ticketMedio.toFixed(0)}`} sub="por pedido" color={palette.accent3} icon="🧾" />
            <KPICard label="Clientes únicos" value={clientesUnicos} sub={`${pedidosFiltrados.length} pedidos`} color={palette.accent1} icon="👥" />
            <KPICard label="Entregados" value={pedidosEntregados} sub={`de ${pedidosFiltrados.length} pedidos`} color={palette.accent2} icon="✅" />
          </div>

          {/* Gráfico mensual */}
          {datosMensuales.length > 0 && (
            <div style={{ background: palette.bgCard, borderRadius: 16, border: `1px solid ${palette.border}`, padding: "22px 24px" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: palette.textDark, marginBottom: 18 }}>Ingresos por mes</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={datosMensuales} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={palette.border} />
                  <XAxis dataKey="mes" tick={{ fontSize: 11, fill: palette.textLight }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: palette.textLight }} axisLine={false} tickLine={false} tickFormatter={v => `€${v}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="ingresos" name="Ingresos" fill={palette.primary} radius={[6, 6, 0, 0]} maxBarSize={48} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Pie categorías + top clientes */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>

            {/* Pie */}
            {datosCat.length > 0 && (
              <div style={{ background: palette.bgCard, borderRadius: 16, border: `1px solid ${palette.border}`, padding: "22px 24px" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: palette.textDark, marginBottom: 16 }}>Ingresos por categoría</div>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={datosCat} dataKey="ingresos" nameKey="cat" cx="50%" cy="50%" outerRadius={75} label={({ cat, percent }) => `${cat} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                      {datosCat.map((_, i) => <Cell key={i} fill={CATEGORIA_COLORES[i % CATEGORIA_COLORES.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => `€ ${Number(v).toFixed(2)}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Top clientes */}
            <div style={{ background: palette.bgCard, borderRadius: 16, border: `1px solid ${palette.border}`, padding: "22px 24px" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: palette.textDark, marginBottom: 16 }}>Top clientes</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {topClientes.map((c, i) => {
                  const pct = totalIngresos > 0 ? (c.ingresos / totalIngresos) * 100 : 0;
                  return (
                    <div key={c.nombre}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 12.5, fontWeight: 600, color: palette.textDark }}>{c.nombre}</span>
                        <span style={{ fontSize: 12, color: palette.textLight }}>{c.pedidos} pedidos · <b style={{ color: palette.primary }}>€ {c.ingresos.toFixed(0)}</b></span>
                      </div>
                      <div style={{ height: 5, borderRadius: 99, background: palette.border, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: CATEGORIA_COLORES[i % CATEGORIA_COLORES.length], borderRadius: 99, transition: "width 0.6s ease" }} />
                      </div>
                    </div>
                  );
                })}
                {topClientes.length === 0 && <div style={{ color: palette.textLight, fontSize: 12 }}>Sin datos</div>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── HISTÓRICO ── */}
      {tab === "historico" && (
        <div style={{ background: palette.bgCard, borderRadius: 16, border: `1px solid ${palette.border}`, overflow: "hidden" }}>
          {/* Cabecera tabla */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "0.8fr 1.5fr 1fr 0.8fr" : "0.6fr 1.8fr 2fr 1fr 1fr 1fr", padding: "11px 20px", background: palette.bg, borderBottom: `1px solid ${palette.border}` }}>
            {(isMobile ? ["ID", "Cliente", "Fecha", "Total"] : ["ID", "Cliente", "Productos", "Fecha", "Estado", "Total"]).map(h => (
              <span key={h} style={{ fontSize: 10, fontWeight: 700, color: palette.textLight, letterSpacing: "0.8px", textTransform: "uppercase" }}>{h}</span>
            ))}
          </div>

          {histPaginados.length === 0 ? (
            <div style={{ padding: "48px 24px", textAlign: "center", color: palette.textLight, fontSize: 13 }}>No hay pedidos en este periodo</div>
          ) : (
            histPaginados.map((p, i) => {
              const detalles = detallesMap[p.idPedido] || [];
              const total = detalles.reduce((a, d) => a + (d.cantidad || 0) * (d.precioCongelado || 0), 0);
              const prodLabel = detalles.length > 0 ? detalles[0].nombreProducto + (detalles.length > 1 ? ` +${detalles.length - 1}` : "") : "—";
              const estadoColors = { "Entregado": palette.accent3, "En proceso": palette.accent1, "Pendiente": palette.accent2, "Preparado": palette.primary };
              return (
                <div key={p.idPedido}
                  style={{ display: "grid", gridTemplateColumns: isMobile ? "0.8fr 1.5fr 1fr 0.8fr" : "0.6fr 1.8fr 2fr 1fr 1fr 1fr", padding: "12px 20px", alignItems: "center", borderTop: i > 0 ? `1px solid ${palette.border}` : "none", transition: "background 0.1s" }}
                  onMouseEnter={e => e.currentTarget.style.background = palette.bg}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <span style={{ fontSize: 11, color: palette.textLight, fontVariantNumeric: "tabular-nums" }}>#{String(p.idPedido).padStart(4, "0")}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: palette.textDark, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{getNombreCliente(p)}</span>
                  {!isMobile && <span style={{ fontSize: 12, color: palette.textMid, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 8 }}>{prodLabel}</span>}
                  <span style={{ fontSize: 12, color: palette.textMid }}>{formatFecha(p.fechaEntrega)}</span>
                  {!isMobile && (
                    <span style={{ display: "inline-flex", padding: "3px 9px", borderRadius: 20, background: `${estadoColors[p.estado] || palette.primary}18`, color: estadoColors[p.estado] || palette.primary, fontSize: 10.5, fontWeight: 600, width: "fit-content" }}>
                      {p.estado}
                    </span>
                  )}
                  <span style={{ fontSize: 13, fontWeight: 700, color: total > 0 ? palette.textDark : palette.textLight }}>
                    {total > 0 ? `€ ${total.toFixed(2)}` : "—"}
                  </span>
                </div>
              );
            })
          )}

          {/* Paginación */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 20px", borderTop: `1px solid ${palette.border}`, background: palette.bg }}>
            <span style={{ fontSize: 12, color: palette.textLight }}>{histPaginados.length} de {historicoPedidos.length} pedidos</span>
            <div style={{ display: "flex", gap: 5 }}>
              <button onClick={() => setHistPage(p => Math.max(1, p - 1))} disabled={histPage === 1}
                style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${palette.border}`, background: palette.bgCard, cursor: histPage === 1 ? "default" : "pointer", opacity: histPage === 1 ? 0.35 : 1, display: "flex", alignItems: "center", justifyContent: "center", color: palette.textMid }}>
                <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              </button>
              {Array.from({ length: histTotal }, (_, i) => i + 1).slice(Math.max(0, histPage - 3), histPage + 2).map(n => (
                <button key={n} onClick={() => setHistPage(n)}
                  style={{ width: 28, height: 28, borderRadius: 7, fontSize: 12, fontWeight: 600, border: `1px solid ${n === histPage ? palette.primary : palette.border}`, background: n === histPage ? palette.primary : palette.bgCard, color: n === histPage ? "#fff" : palette.textMid, cursor: "pointer" }}>{n}</button>
              ))}
              <button onClick={() => setHistPage(p => Math.min(histTotal, p + 1))} disabled={histPage === histTotal}
                style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${palette.border}`, background: palette.bgCard, cursor: histPage === histTotal ? "default" : "pointer", opacity: histPage === histTotal ? 0.35 : 1, display: "flex", alignItems: "center", justifyContent: "center", color: palette.textMid }}>
                <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── POR PRODUCTO ── */}
      {tab === "productos" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Barra de productos */}
          {topProductos.length > 0 && (
            <div style={{ background: palette.bgCard, borderRadius: 16, border: `1px solid ${palette.border}`, padding: "22px 24px" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: palette.textDark, marginBottom: 18 }}>Ingresos por producto</div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={topProductos} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={palette.border} horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: palette.textLight }} axisLine={false} tickLine={false} tickFormatter={v => `€${v}`} />
                  <YAxis type="category" dataKey="nombre" tick={{ fontSize: 11, fill: palette.textMid }} axisLine={false} tickLine={false} width={130} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="ingresos" name="Ingresos" radius={[0, 6, 6, 0]} maxBarSize={28}>
                    {topProductos.map((_, i) => <Cell key={i} fill={CATEGORIA_COLORES[i % CATEGORIA_COLORES.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Tabla detallada */}
          <div style={{ background: palette.bgCard, borderRadius: 16, border: `1px solid ${palette.border}`, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "2.5fr 1fr 1fr 1fr", padding: "11px 20px", background: palette.bg, borderBottom: `1px solid ${palette.border}` }}>
              {(isMobile ? ["Producto", "Ingresos"] : ["Producto", "Veces vendido", "Ingresos", "% del total"]).map(h => (
                <span key={h} style={{ fontSize: 10, fontWeight: 700, color: palette.textLight, letterSpacing: "0.8px", textTransform: "uppercase" }}>{h}</span>
              ))}
            </div>
            {Object.values(prodMap).sort((a, b) => b.ingresos - a.ingresos).map((prod, i) => {
              const pct = totalIngresos > 0 ? (prod.ingresos / totalIngresos) * 100 : 0;
              return (
                <div key={prod.nombre}
                  style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "2.5fr 1fr 1fr 1fr", padding: "12px 20px", alignItems: "center", borderTop: i > 0 ? `1px solid ${palette.border}` : "none", transition: "background 0.1s" }}
                  onMouseEnter={e => e.currentTarget.style.background = palette.bg}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: CATEGORIA_COLORES[Object.values(catMap).findIndex(c => c.cat === categoriaProducto(prod.nombre)) % CATEGORIA_COLORES.length] || palette.primary, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: palette.textDark, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{prod.nombre}</span>
                  </div>
                  {!isMobile && <span style={{ fontSize: 12, color: palette.textMid }}>{prod.veces}x</span>}
                  <span style={{ fontSize: 13, fontWeight: 700, color: palette.primary }}>€ {prod.ingresos.toFixed(2)}</span>
                  {!isMobile && <span style={{ fontSize: 12, color: palette.textLight }}>{pct.toFixed(1)}%</span>}
                </div>
              );
            })}
            {Object.keys(prodMap).length === 0 && (
              <div style={{ padding: "48px 24px", textAlign: "center", color: palette.textLight, fontSize: 13 }}>Sin datos para este periodo</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
