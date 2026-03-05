import { useState } from "react";
import palette from "../theme/palette";

// ── Mock data – reemplazar con fetch al backend ────────────────────────────
const pedidosData = [
  { id: "#0001", cliente: "María García",   producto: "Tarta de chocolate",     fecha: "2026-03-05", estado: "Pendiente",   total: 45  },
  { id: "#0002", cliente: "Juan Pérez",     producto: "Cupcakes variados x12",  fecha: "2026-03-05", estado: "En proceso",  total: 28  },
  { id: "#0003", cliente: "Ana López",      producto: "Tarta de bodas 3 pisos", fecha: "2026-03-04", estado: "Completado",  total: 350 },
  { id: "#0004", cliente: "Carlos Ruiz",    producto: "Galletas decoradas x24", fecha: "2026-03-06", estado: "Pendiente",   total: 36  },
  { id: "#0005", cliente: "Laura Martín",   producto: "Macarons x20",           fecha: "2026-03-05", estado: "En proceso",  total: 42  },
  { id: "#0006", cliente: "Elena Torres",   producto: "Bizcocho vainilla",      fecha: "2026-03-07", estado: "Pendiente",   total: 22  },
  { id: "#0007", cliente: "Pedro Sánchez",  producto: "Tarta fondant cumple",   fecha: "2026-03-04", estado: "Completado",  total: 95  },
  { id: "#0008", cliente: "Sofía Iglesias", producto: "Croissants x8",          fecha: "2026-03-05", estado: "En proceso",  total: 18  },
];

const estadoStyle = {
  "Pendiente":  { color: "#D97706", bg: "#FFFBEB", icon: "⏱" },
  "En proceso": { color: "#3B82F6", bg: "#EFF6FF", icon: "⚙️" },
  "Completado": { color: "#10B981", bg: "#ECFDF5", icon: "✓"  },
};

const avatarBgs = ["#FF6B9D", "#A855F7", "#3B82F6", "#10B981", "#F97316", "#6366F1", "#EC4899", "#14B8A6"];

function Avatar({ nombre, idx }) {
  const initials = nombre.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: 34, height: 34, borderRadius: "50%",
      background: avatarBgs[idx % avatarBgs.length],
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontWeight: 800, fontSize: 12, flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

const ITEMS_PER_PAGE = 7;
const FILTROS = ["Todos", "Pendientes", "En proceso", "Completados"];

export default function PedidosView() {
  const [filtro,     setFiltro]     = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [page,       setPage]       = useState(1);

  const filtrados = pedidosData.filter(p => {
    const matchFiltro =
      filtro === "Todos"       ||
      (filtro === "Pendientes"  && p.estado === "Pendiente")  ||
      (filtro === "En proceso"  && p.estado === "En proceso") ||
      (filtro === "Completados" && p.estado === "Completado");
    const matchSearch =
      p.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.includes(searchTerm);
    return matchFiltro && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtrados.length / ITEMS_PER_PAGE));
  const paginados  = filtrados.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const handleFiltro = (f) => { setFiltro(f); setPage(1); };
  const handleSearch = (v) => { setSearchTerm(v); setPage(1); };

  const TODAY = "2026-03-05";
  const pedidosHoy  = pedidosData.filter(p => p.fecha === TODAY).length;
  const pendientes  = pedidosData.filter(p => p.estado === "Pendiente").length;
  const enProceso   = pedidosData.filter(p => p.estado === "En proceso").length;
  const ingresosHoy = pedidosData.filter(p => p.fecha === TODAY).reduce((acc, p) => acc + p.total, 0);

  return (
    <div style={{ maxWidth: 1150, margin: "0 auto", position: "relative" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, #FF6B9D, #FF3366)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🛒</div>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: palette.textPrimary, margin: 0, letterSpacing: "-0.5px" }}>Pedidos</h1>
            <p style={{ color: palette.textMuted, margin: "2px 0 0", fontSize: 13 }}>Gestiona todos tus pedidos</p>
          </div>
        </div>
        <button style={{ background: "linear-gradient(135deg, #FF6B9D, #FF3366)", color: "#fff", border: "none", borderRadius: 20, padding: "10px 22px", fontWeight: 800, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 4px 14px rgba(255,51,102,0.35)", fontFamily: "inherit" }}>
          + Nuevo Pedido
        </button>
      </div>

      {/* KPI cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Pedidos hoy",  value: pedidosHoy,         color: palette.textPrimary },
          { label: "Pendientes",   value: pendientes,          color: "#D97706"           },
          { label: "En proceso",   value: enProceso,           color: "#3B82F6"           },
          { label: "Ingresos hoy", value: `€ ${ingresosHoy}`, color: "#10B981"           },
        ].map(k => (
          <div key={k.label} style={{ background: "#fff", borderRadius: 16, padding: "18px 22px", boxShadow: palette.cardShadow, border: `1px solid ${palette.cardBorder}` }}>
            <div style={{ fontSize: 12, color: palette.textMuted, fontWeight: 600, marginBottom: 8 }}>{k.label}</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: k.color, lineHeight: 1.1 }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Filtros + buscador */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {FILTROS.map(f => (
          <button key={f} onClick={() => handleFiltro(f)} style={{ padding: "7px 20px", borderRadius: 20, fontSize: 13, fontWeight: 700, border: `1px solid ${filtro === f ? "#FF3366" : palette.cardBorder}`, background: filtro === f ? "linear-gradient(135deg, #FF6B9D, #FF3366)" : "#fff", color: filtro === f ? "#fff" : palette.textSecondary, cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit" }}>
            {f}
          </button>
        ))}
        <div style={{ position: "relative", marginLeft: "auto" }}>
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF" strokeWidth={2} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
            <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
          </svg>
          <input type="text" placeholder="Buscar pedido, cliente..." value={searchTerm} onChange={e => handleSearch(e.target.value)} style={{ paddingLeft: 36, paddingRight: 16, height: 38, borderRadius: 20, border: `1px solid ${palette.cardBorder}`, background: "#fff", fontSize: 13, color: palette.textPrimary, outline: "none", width: 210, fontFamily: "inherit" }} />
        </div>
      </div>

      {/* Tabla */}
      <div style={{ background: "#fff", borderRadius: 20, boxShadow: palette.cardShadow, border: `1px solid ${palette.cardBorder}`, overflow: "hidden" }}>

        {/* Cabecera */}
        <div style={{ display: "grid", gridTemplateColumns: "0.7fr 2fr 2.2fr 1.3fr 1.6fr 0.8fr 1fr", padding: "13px 24px", borderBottom: `1px solid ${palette.cardBorder}`, background: "#FAFAFA" }}>
          {["ID", "Cliente", "Producto", "Fecha", "Estado", "Total", "Acciones"].map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 800, color: palette.textMuted, letterSpacing: "0.5px" }}>{h}</span>
          ))}
        </div>

        {/* Filas */}
        {paginados.length === 0 ? (
          <div style={{ padding: "48px 24px", textAlign: "center", color: palette.textMuted, fontSize: 14 }}>No se encontraron pedidos</div>
        ) : (
          paginados.map((p, i) => {
            const es = estadoStyle[p.estado] || estadoStyle["Pendiente"];
            return (
              <div key={p.id}
                style={{ display: "grid", gridTemplateColumns: "0.7fr 2fr 2.2fr 1.3fr 1.6fr 0.8fr 1fr", padding: "15px 24px", alignItems: "center", borderTop: i > 0 ? `1px solid ${palette.cardBorder}` : "none", transition: "background 0.12s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <span style={{ fontSize: 12, color: palette.textMuted, fontWeight: 600 }}>{p.id}</span>

                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Avatar nombre={p.cliente} idx={i} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: palette.textPrimary }}>{p.cliente}</span>
                </div>

                <span style={{ fontSize: 13, color: "#6B7280" }}>{p.producto}</span>
                <span style={{ fontSize: 13, color: "#6B7280" }}>{p.fecha}</span>

                <div>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 20, background: es.bg, color: es.color, fontSize: 12, fontWeight: 700, minWidth: 110, justifyContent: "center" }}>
                    <span>{es.icon}</span>{p.estado}
                  </span>
                </div>

                <span style={{ fontSize: 14, fontWeight: 800, color: palette.textPrimary }}>€ {p.total}</span>

                <button style={{ background: "none", border: "none", cursor: "pointer", color: "#FF3366", fontSize: 13, fontWeight: 700, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 3, padding: 0 }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >
                  Ver detalles →
                </button>
              </div>
            );
          })
        )}

        {/* Paginación */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", borderTop: `1px solid ${palette.cardBorder}` }}>
          <span style={{ fontSize: 13, color: palette.textMuted }}>Mostrando {paginados.length} de {filtrados.length} pedidos</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${palette.cardBorder}`, background: page === 1 ? palette.background : "#fff", color: page === 1 ? palette.textMuted : palette.textPrimary, cursor: page === 1 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg, #FF6B9D, #FF3366)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>{page}</div>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${palette.cardBorder}`, background: page === totalPages ? palette.background : "#fff", color: page === totalPages ? palette.textMuted : palette.textPrimary, cursor: page === totalPages ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}