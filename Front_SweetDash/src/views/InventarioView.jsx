import { useState } from "react";
import palette from "../theme/palette";

// Mock data – reemplazar con fetch al backend
// stock: unidades actuales | stockMax: capacidad máxima
const inventarioData = [
  { id: 1, nombre: "Harina de Trigo",     categoria: "Harinas",      emoji: "🌾", stock: 42,  stockMax: 50,  unidad: "kg"  },
  { id: 2, nombre: "Huevos",              categoria: "Lácteos",      emoji: "🥚", stock: 12,  stockMax: 80,  unidad: "ud"  },
  { id: 3, nombre: "Mantequilla",         categoria: "Lácteos",      emoji: "🧈", stock: 120, stockMax: 130, unidad: "g"   },
  { id: 4, nombre: "Azúcar",             categoria: "Endulzantes",   emoji: "🍬", stock: 2,   stockMax: 25,  unidad: "kg"  },
  { id: 5, nombre: "Chocolate Negro",     categoria: "Chocolates",   emoji: "🍫", stock: 18,  stockMax: 40,  unidad: "kg"  },
  { id: 6, nombre: "Cajas de cartón",     categoria: "Packaging",    emoji: "📦", stock: 5,   stockMax: 100, unidad: "ud"  },
  { id: 7, nombre: "Velas decorativas",   categoria: "Decoración",   emoji: "🕯️", stock: 60,  stockMax: 80,  unidad: "ud"  },
  { id: 8, nombre: "Levadura",            categoria: "Harinas",      emoji: "🫙", stock: 30,  stockMax: 30,  unidad: "g"   },
  { id: 9, nombre: "Nata para montar",    categoria: "Lácteos",      emoji: "🥛", stock: 8,   stockMax: 20,  unidad: "l"   },
  { id: 10, nombre: "Fondant blanco",     categoria: "Decoración",   emoji: "🎂", stock: 15,  stockMax: 30,  unidad: "kg"  },
];

const categorias = ["Todas", ...Array.from(new Set(inventarioData.map(i => i.categoria)))];

function getEstado(stock, stockMax) {
  const pct = (stock / stockMax) * 100;
  if (pct >= 50) return { label: "OK",       color: "#10B981", bg: "#ECFDF5", barColor: "#10B981" };
  if (pct >= 20) return { label: "BAJO",     color: "#F97316", bg: "#FFF7ED", barColor: "#F97316" };
  return              { label: "CRÍTICO",    color: "#EF4444", bg: "#FEF2F2", barColor: "#EF4444" };
}

const ITEMS_PER_PAGE = 7;

export default function InventarioView() {
  const [searchTerm, setSearchTerm]     = useState("");
  const [categoriaActiva, setCat]       = useState("Todas");
  const [page, setPage]                 = useState(1);

  const filtrados = inventarioData.filter(item => {
    const matchSearch =
      item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = categoriaActiva === "Todas" || item.categoria === categoriaActiva;
    return matchSearch && matchCat;
  });

  const totalPages = Math.max(1, Math.ceil(filtrados.length / ITEMS_PER_PAGE));
  const paginados  = filtrados.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleSearch = (v) => { setSearchTerm(v); setPage(1); };
  const handleCat    = (c) => { setCat(c);         setPage(1); };

  return (
    <div style={{ maxWidth: 1050, margin: "0 auto", position: "relative" }}>

      {/* ── Header ────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, gap: 16, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: 35, fontWeight: 900, color: palette.textPrimary, margin: 0, letterSpacing: "-0.5px" }}>
            Gestión de Inventario
          </h1>
          <p style={{ color: palette.textMuted, margin: "4px 0 0", fontSize: 16 }}>
            Controla el stock de ingredientes y materiales
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Chip total */}
          <div style={{ display: "flex", alignItems: "center", gap: 7, background: palette.soft, border: `1px solid ${palette.cardBorder}`, borderRadius: 20, padding: "6px 14px" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981" }} />
            <span style={{ fontSize: 16, fontWeight: 800, color: palette.primary, letterSpacing: "0.4px" }}>
              {inventarioData.length} ARTÍCULOS EN TOTAL
            </span>
          </div>

          {/* Buscador */}
          <div style={{ position: "relative" }}>
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF" strokeWidth={2}
              style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
              <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Buscar producto..."
              value={searchTerm}
              onChange={e => handleSearch(e.target.value)}
              style={{
                paddingLeft: 36, paddingRight: 16, height: 38, borderRadius: 20,
                border: `1px solid ${palette.cardBorder}`, background: "#fff",
                fontSize: 13, color: palette.textPrimary, outline: "none",
                width: 200, fontFamily: "inherit",
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Filtros categoría ─────────────────────────── */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {categorias.map(cat => (
          <button
            key={cat}
            onClick={() => handleCat(cat)}
            style={{
              padding: "6px 16px", borderRadius: 20, fontSize: 16, fontWeight: 700,
              border: `1px solid ${categoriaActiva === cat ? palette.primary : palette.cardBorder}`,
              background: categoriaActiva === cat ? palette.primary : "#fff",
              color: categoriaActiva === cat ? "#fff" : palette.textSecondary,
              cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Tabla ─────────────────────────────────────── */}
      <div style={{ background: "#fff", borderRadius: 20, boxShadow: palette.cardShadow, border: `1px solid ${palette.cardBorder}`, overflow: "hidden" }}>

        {/* Cabecera */}
        <div style={{ display: "grid", gridTemplateColumns: "2.2fr 1.4fr 2.4fr 0.8fr", padding: "14px 24px", borderBottom: `1px solid ${palette.cardBorder}` }}>
          {[
            { label: "PRODUCTO",        align: "left"   },
            { label: "CATEGORÍA",       align: "left"   },
            { label: "NIVEL DE STOCK",  align: "left"   },
            { label: "ESTADO",          align: "center" },
          ].map(h => (
            <span key={h.label} style={{ fontSize: 11, fontWeight: 800, color: palette.textMuted, letterSpacing: "0.6px", textAlign: h.align }}>{h.label}</span>
          ))}
        </div>

        {/* Filas */}
        {paginados.length === 0 ? (
          <div style={{ padding: "40px 24px", textAlign: "center", color: palette.textMuted, fontSize: 14 }}>
            No se encontraron artículos
          </div>
        ) : (
          paginados.map((item, i) => {
            const pct    = Math.round((item.stock / item.stockMax) * 100);
            const estado = getEstado(item.stock, item.stockMax);

            return (
              <div
                key={item.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2.2fr 1.4fr 2.4fr 0.8fr",
                  padding: "18px 24px",
                  alignItems: "center",
                  borderTop: i > 0 ? `1px solid ${palette.cardBorder}` : "none",
                  transition: "background 0.12s",
                  background: estado.label === "CRÍTICO" ? `${estado.bg}60` : "transparent",
                }}
                onMouseEnter={e => { if (estado.label !== "CRÍTICO") e.currentTarget.style.background = palette.background; }}
                onMouseLeave={e => { e.currentTarget.style.background = estado.label === "CRÍTICO" ? `${estado.bg}60` : "transparent"; }}
              >
                {/* Producto */}
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 12,
                    background: palette.soft,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 20, flexShrink: 0,
                  }}>
                    {item.emoji}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#1A0D2E" }}>{item.nombre}</div>
                    <div style={{ fontSize: 12, color: palette.textMuted, marginTop: 1 }}>Máx. {item.stockMax} {item.unidad}</div>
                  </div>
                </div>

                {/* Categoría */}
                <div style={{ fontSize: 13, fontWeight: 600, color: palette.accent }}>{item.categoria}</div>

                {/* Nivel de stock */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: estado.color }}>{pct}%</span>
                    <span style={{ fontSize: 12, color: palette.textMuted }}>
                      {item.stock}/{item.stockMax} {item.unidad}
                    </span>
                  </div>
                  <div style={{ height: 7, borderRadius: 10, background: "#F3F4F6", overflow: "hidden", marginRight: 24 }}>
                    <div style={{
                      height: "100%",
                      width: `${pct}%`,
                      borderRadius: 10,
                      background: estado.barColor,
                      transition: "width 0.4s ease",
                    }} />
                  </div>
                </div>

                {/* Estado */}
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <span style={{
                    fontSize: 11, fontWeight: 800, letterSpacing: "0.5px",
                    color: estado.color,
                    background: estado.bg,
                    padding: "4px 10px", borderRadius: 20,
                  }}>
                    {estado.label}
                  </span>
                </div>
              </div>
            );
          })
        )}

        {/* Footer paginación */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", borderTop: `1px solid ${palette.cardBorder}` }}>
          <span style={{ fontSize: 13, color: palette.textMuted }}>
            Mostrando {paginados.length} de {filtrados.length} artículos
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                width: 30, height: 30, borderRadius: 8,
                border: `1px solid ${palette.cardBorder}`,
                background: page === 1 ? palette.background : "#fff",
                color: page === 1 ? palette.textMuted : palette.textPrimary,
                cursor: page === 1 ? "default" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: palette.primary, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>
              {page}
            </div>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                width: 30, height: 30, borderRadius: 8,
                border: `1px solid ${palette.cardBorder}`,
                background: page === totalPages ? palette.background : "#fff",
                color: page === totalPages ? palette.textMuted : palette.textPrimary,
                cursor: page === totalPages ? "default" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── FAB ───────────────────────────────────────── */}
      <button
        title="Añadir artículo"
        style={{
          position: "fixed", bottom: 36, right: 36,
          width: 52, height: 52, borderRadius: "50%",
          background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`,
          color: "#fff", border: "none", fontSize: 26, cursor: "pointer",
          boxShadow: "0 6px 20px rgba(82,37,102,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "inherit", zIndex: 100,
        }}
      >
        +
      </button>
    </div>
  );
}