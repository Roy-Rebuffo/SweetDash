import { useState, useEffect } from "react";
import palette from "../theme/palette";
import { pedidosApi } from "../services/api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from "recharts";

// ── Helpers ───────────────────────────────────────────────────────────────────
function parseFechaLocal(str) {
  if (!str) return null;
  const s = String(str).slice(0, 10);
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function formatFecha(iso) {
  if (!iso) return "—";
  return String(iso).slice(0, 10);
}

function mesLabel(dateStr) {
  const d = parseFechaLocal(dateStr);
  if (!d) return "—";
  return d.toLocaleDateString("es-ES", { month: "short", year: "2-digit" });
}

function getNombreCliente(p) {
  return (p.nombreCliente || p.nombre || "Cliente").trim();
}

const CATEGORIA_COLORES = [
  palette.primary, palette.accent1, palette.accent2, palette.accent3, palette.primaryMid,
  "#8B5CF6", "#EC4899", "#14B8A6",
];

function categoriaProducto(nombre) {
  const n = (nombre || "").toUpperCase();
  if (n.includes("TARTA") || n.includes("CARROT") || n.includes("CHAJA") || n.includes("FULL CHOCO") || n.includes("OREO") || n.includes("SAN MARC") || n.includes("KINDER") || n.includes("CHOCO")) return "Tartas";
  if (n.includes("GALLETA") || n.includes("COOKIE") || n.includes("RAMO")) return "Galletas";
  if (n.includes("PASTA") || n.includes("SABLE")) return "Pastas de té";
  if (n.includes("CHEESECAKE") || n.includes("LEMON PIE") || n.includes("KEYLIME")) return "Cheesecakes";
  if (n.includes("CUPCAKE")) return "Cupcakes";
  if (n.includes("ALFAJOR")) return "Alfajores";
  if (n.includes("BROWNIE")) return "Brownies";
  return "Otros";
}

// ── Subcomponentes ────────────────────────────────────────────────────────────
function KPICard({ label, value, sub, color, icon }) {
  return (
    <div style={{
      background: palette.bgCard, borderRadius: 16,
      border: `1px solid ${palette.border}`,
      boxShadow: "0 2px 8px oklch(0% 0 0 / 0.05)",
      padding: "22px 24px",
      display: "flex", flexDirection: "column", gap: 8,
      borderTop: `3px solid ${color || palette.primary}`,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: palette.textLight, letterSpacing: "0.8px", textTransform: "uppercase" }}>{label}</div>
        {icon && <span style={{ fontSize: 18, opacity: 0.7 }}>{icon}</span>}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: palette.textDark, letterSpacing: "-1px", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11.5, color: palette.textLight, fontWeight: 500 }}>{sub}</div>}
    </div>
  );
}

const FILTROS_PERIODO = ["Todo", "Este mes", "Últimos 3 meses", "Este año"];

const NAV_TABS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "historico", label: "Histórico" },
  { key: "productos", label: "Por producto" },
];

// ── Tooltip personalizado ─────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: palette.bgCard, border: `1px solid ${palette.border}`, borderRadius: 10, padding: "10px 14px", boxShadow: "0 4px 16px oklch(0% 0 0 / 0.1)", fontSize: 12 }}>
      <div style={{ fontWeight: 700, color: palette.textDark, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontWeight: 600 }}>
          {p.name}: {typeof p.value === "number" ? `€ ${p.value.toFixed(2)}` : p.value}
        </div>
      ))}
    </div>
  );
}

// ── Vista principal ───────────────────────────────────────────────────────────
export default function EstadisticasView({ isMobile = false }) {
  const [tab, setTab] = useState("dashboard");
  const [periodo, setPeriodo] = useState("Todo");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [pedidos, setPedidos] = useState([]);
  const [detallesMap, setDetallesMap] = useState({});

  // Histórico paginación
  const [histPage, setHistPage] = useState(1);
  const HIST_PER_PAGE = 10;

  useEffect(() => {
    setLoading(true);
    pedidosApi.getAll()
      .then(async (peds) => {
        setPedidos(peds);
        const map = {};
        await Promise.all(peds.map(async (p) => {
          try { map[p.idPedido] = await pedidosApi.getDetalles(p.idPedido); }
          catch { map[p.idPedido] = []; }
        }));
        setDetallesMap(map);
        setError(null);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // ── Filtrado por periodo ──────────────────────────────────────────────────
  const hoy = new Date();
  const pedidosFiltrados = pedidos.filter((p) => {
    const f = parseFechaLocal(p.fechaEntrega);
    if (!f) return true;
    if (periodo === "Este mes") return f.getMonth() === hoy.getMonth() && f.getFullYear() === hoy.getFullYear();
    if (periodo === "Últimos 3 meses") {
      const hace3 = new Date(hoy); hace3.setMonth(hace3.getMonth() - 3);
      return f >= hace3;
    }
    if (periodo === "Este año") return f.getFullYear() === hoy.getFullYear();
    return true;
  });

  // ── Cálculos ─────────────────────────────────────────────────────────────
  const totalIngresos = pedidosFiltrados.reduce((acc, p) => {
    const d = detallesMap[p.idPedido] || [];
    return acc + d.reduce((a, det) => a + (det.cantidad || 0) * (det.precioCongelado || 0), 0);
  }, 0);

  const pedidosConDetalles = pedidosFiltrados.filter(p => (detallesMap[p.idPedido] || []).length > 0);
  const ticketMedio = pedidosConDetalles.length > 0
    ? pedidosConDetalles.reduce((acc, p) => {
      const d = detallesMap[p.idPedido] || [];
      return acc + d.reduce((a, det) => a + (det.cantidad || 0) * (det.precioCongelado || 0), 0);
    }, 0) / pedidosConDetalles.length
    : 0;

  const clientesUnicos = new Set(pedidosFiltrados.map(p => getNombreCliente(p))).size;
  const pedidosEntregados = pedidosFiltrados.filter(p => p.estado === "Entregado").length;

  // ── Datos para gráfico mensual ────────────────────────────────────────────
  const mesesMap = {};
  pedidosFiltrados.forEach((p) => {
    const mes = mesLabel(p.fechaEntrega);
    if (!mes || mes === "—") return;
    if (!mesesMap[mes]) mesesMap[mes] = { mes, ingresos: 0, pedidos: 0 };
    const d = detallesMap[p.idPedido] || [];
    const total = d.reduce((a, det) => a + (det.cantidad || 0) * (det.precioCongelado || 0), 0);
    mesesMap[mes].ingresos += total;
    mesesMap[mes].pedidos += 1;
  });
  const datosMensuales = Object.values(mesesMap).sort((a, b) => {
    const pa = parseFechaLocal(pedidosFiltrados.find(p => mesLabel(p.fechaEntrega) === a.mes)?.fechaEntrega);
    const pb = parseFechaLocal(pedidosFiltrados.find(p => mesLabel(p.fechaEntrega) === b.mes)?.fechaEntrega);
    return (pa || 0) - (pb || 0);
  });

  // ── Datos por categoría ───────────────────────────────────────────────────
  const catMap = {};
  pedidosFiltrados.forEach((p) => {
    const d = detallesMap[p.idPedido] || [];
    d.forEach((det) => {
      const cat = categoriaProducto(det.nombreProducto || "");
      if (!catMap[cat]) catMap[cat] = { cat, ingresos: 0, pedidos: 0 };
      catMap[cat].ingresos += (det.cantidad || 0) * (det.precioCongelado || 0);
      catMap[cat].pedidos += 1;
    });
  });
  const datosCat = Object.values(catMap).sort((a, b) => b.ingresos - a.ingresos);

  // ── Top productos ─────────────────────────────────────────────────────────
  const prodMap = {};
  pedidosFiltrados.forEach((p) => {
    const d = detallesMap[p.idPedido] || [];
    d.forEach((det) => {
      const key = (det.nombreProducto || "Desconocido").trim();
      if (!prodMap[key]) prodMap[key] = { nombre: key, ingresos: 0, veces: 0 };
      prodMap[key].ingresos += (det.cantidad || 0) * (det.precioCongelado || 0);
      prodMap[key].veces += 1;
    });
  });
  const topProductos = Object.values(prodMap).sort((a, b) => b.ingresos - a.ingresos).slice(0, 8);

  // ── Top clientes ──────────────────────────────────────────────────────────
  const cliMap = {};
  pedidosFiltrados.forEach((p) => {
    const nombre = getNombreCliente(p);
    if (!cliMap[nombre]) cliMap[nombre] = { nombre, ingresos: 0, pedidos: 0 };
    const d = detallesMap[p.idPedido] || [];
    cliMap[nombre].ingresos += d.reduce((a, det) => a + (det.cantidad || 0) * (det.precioCongelado || 0), 0);
    cliMap[nombre].pedidos += 1;
  });
  const topClientes = Object.values(cliMap).sort((a, b) => b.ingresos - a.ingresos).slice(0, 5);

  // ── Histórico paginado ────────────────────────────────────────────────────
  const historicoPedidos = [...pedidosFiltrados].sort((a, b) => b.idPedido - a.idPedido);
  const histTotal = Math.max(1, Math.ceil(historicoPedidos.length / HIST_PER_PAGE));
  const histPaginados = historicoPedidos.slice((histPage - 1) * HIST_PER_PAGE, histPage * HIST_PER_PAGE);

  // ── Render ────────────────────────────────────────────────────────────────
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
    <div style={{ maxWidth: 1150, margin: "0 auto" }}>

      {/* Header + filtros */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: palette.textDark }}>Estadísticas</div>
          <div style={{ fontSize: 12, color: palette.textLight, marginTop: 2 }}>{pedidosFiltrados.length} pedidos analizados</div>
        </div>
        <select value={periodo} onChange={(e) => { setPeriodo(e.target.value); setHistPage(1); }} style={inputStyle}>
          {FILTROS_PERIODO.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, background: palette.bg, borderRadius: 12, padding: 4, width: "fit-content", border: `1px solid ${palette.border}` }}>
        {NAV_TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{ padding: "7px 18px", borderRadius: 9, border: "none", fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s", background: tab === t.key ? palette.primary : "transparent", color: tab === t.key ? "#fff" : palette.textMid }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── DASHBOARD ── */}
      {tab === "dashboard" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${isMobile ? 2 : 4}, 1fr)`, gap: 14 }}>
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
            <div style={{ display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 1fr", padding: "11px 20px", background: palette.bg, borderBottom: `1px solid ${palette.border}` }}>
              {["Producto", "Veces vendido", "Ingresos", "% del total"].map(h => (
                <span key={h} style={{ fontSize: 10, fontWeight: 700, color: palette.textLight, letterSpacing: "0.8px", textTransform: "uppercase" }}>{h}</span>
              ))}
            </div>
            {Object.values(prodMap).sort((a, b) => b.ingresos - a.ingresos).map((prod, i) => {
              const pct = totalIngresos > 0 ? (prod.ingresos / totalIngresos) * 100 : 0;
              return (
                <div key={prod.nombre}
                  style={{ display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 1fr", padding: "12px 20px", alignItems: "center", borderTop: i > 0 ? `1px solid ${palette.border}` : "none", transition: "background 0.1s" }}
                  onMouseEnter={e => e.currentTarget.style.background = palette.bg}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: CATEGORIA_COLORES[Object.values(catMap).findIndex(c => c.cat === categoriaProducto(prod.nombre)) % CATEGORIA_COLORES.length] || palette.primary, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: palette.textDark }}>{prod.nombre}</span>
                  </div>
                  <span style={{ fontSize: 12, color: palette.textMid }}>{prod.veces}x</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: palette.primary }}>€ {prod.ingresos.toFixed(2)}</span>
                  <span style={{ fontSize: 12, color: palette.textLight }}>{pct.toFixed(1)}%</span>
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