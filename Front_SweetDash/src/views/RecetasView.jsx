import { useState } from "react";
import palette from "../theme/palette";

// ── Mock data – reemplazar con fetch al backend ────────────────────────────
const recetas = [
  { id: 1, nombre: "Tarta de Chocolate Premium", categoria: "Tartas",     tiempo: 90,  ingredientes: 12, usada: 156, imagen: null },
  { id: 2, nombre: "Cupcakes de Vainilla",        categoria: "Cupcakes",   tiempo: 45,  ingredientes: 8,  usada: 243, imagen: null },
  { id: 3, nombre: "Macarons Franceses",          categoria: "Petit fours",tiempo: 120, ingredientes: 6,  usada: 189, imagen: null },
  { id: 4, nombre: "Red Velvet Cake",             categoria: "Tartas",     tiempo: 75,  ingredientes: 14, usada: 134, imagen: null },
  { id: 5, nombre: "Galletas de Mantequilla",     categoria: "Galletas",   tiempo: 30,  ingredientes: 6,  usada: 201, imagen: null },
  { id: 6, nombre: "Cheesecake de Frambuesa",     categoria: "Tartas",     tiempo: 60,  ingredientes: 10, usada: 178, imagen: null },
  { id: 7, nombre: "Fondant Casero",              categoria: "Cobertura",  tiempo: 30,  ingredientes: 4,  usada: 95,  imagen: null },
  { id: 8, nombre: "Crema de Mantequilla",        categoria: "Relleno",    tiempo: 20,  ingredientes: 5,  usada: 312, imagen: null },
];

const categorias = ["Todas", ...Array.from(new Set(recetas.map(r => r.categoria)))];

// La más usada
const masUsada = recetas.reduce((a, b) => b.usada > a.usada ? b : a);
const nuevasEsteMes = 4; // reemplazar con dato del backend
const tiempoPromedio = Math.round(recetas.reduce((acc, r) => acc + r.tiempo, 0) / recetas.length);

function RecetaCard({ receta }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: hovered ? "0 10px 32px rgba(82,37,102,0.14)" : "0 2px 12px rgba(82,37,102,0.07)",
        border: `1px solid ${hovered ? palette.accent : "#F0EBF4"}`,
        transition: "all 0.18s ease",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Zona imagen / placeholder con gradiente */}
      <div style={{
        height: 140,
        background: receta.imagen
          ? `url(${receta.imagen}) center/cover no-repeat`
          : "linear-gradient(135deg, #FFE0B2 0%, #FFCCBC 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {!receta.imagen && (
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#F97316" strokeWidth={1.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8 2 6 5 6 8c0 2.5 1.5 4.5 3 5.5V16h6v-2.5c1.5-1 3-3 3-5.5 0-3-2-6-6-6z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 16v2a3 3 0 006 0v-2" />
          </svg>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "16px 18px 18px", flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Nombre */}
        <div style={{ fontSize: 16, fontWeight: 800, color: "#1A0D2E", marginBottom: 12, lineHeight: 1.25 }}>
          {receta.nombre}
        </div>

        {/* Filas de datos */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
          <DataRow icon={<ClockIcon />} label="Tiempo:" value={`${receta.tiempo} min`} />
          <DataRow icon={<IngrIcon />}  label="Ingredientes:" value={receta.ingredientes} />
        </div>

        {/* Footer: usada + botón */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
          <span style={{ fontSize: 12, color: "#9CA3AF" }}>Usada {receta.usada} veces</span>
          <button style={{
            background: "linear-gradient(135deg, #FF6B9D, #FF3366)",
            color: "#fff", border: "none", borderRadius: 20,
            padding: "7px 18px", fontSize: 13, fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit",
            boxShadow: "0 3px 10px rgba(255,51,102,0.3)",
            transition: "opacity 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            Ver receta
          </button>
        </div>
      </div>
    </div>
  );
}

function DataRow({ icon, label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ color: "#9CA3AF" }}>{icon}</span>
        <span style={{ fontSize: 13, color: "#6B7280" }}>{label}</span>
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color: "#1A0D2E" }}>{value}</span>
    </div>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 6v6l4 2" />
    </svg>
  );
}

function IngrIcon() {
  return (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  );
}

// ── Componente principal ───────────────────────────────────────────────────
export default function RecetasView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [catActiva,  setCatActiva]  = useState("Todas");

  const filtradas = recetas.filter(r => {
    const matchSearch = r.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        r.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat    = catActiva === "Todas" || r.categoria === catActiva;
    return matchSearch && matchCat;
  });

  return (
    <div style={{ maxWidth: 1150, margin: "0 auto", position: "relative" }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, #FF6B9D, #FF3366)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
            📖
          </div>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: palette.textPrimary, margin: 0, letterSpacing: "-0.5px" }}>Recetas</h1>
            <p style={{ color: palette.textMuted, margin: "2px 0 0", fontSize: 13 }}>Biblioteca de recetas profesionales</p>
          </div>
        </div>

        <button style={{
          background: "linear-gradient(135deg, #FF6B9D, #FF3366)",
          color: "#fff", border: "none", borderRadius: 20,
          padding: "10px 22px", fontWeight: 800, fontSize: 14,
          cursor: "pointer", display: "flex", alignItems: "center",
          gap: 6, boxShadow: "0 4px 14px rgba(255,51,102,0.35)",
          fontFamily: "inherit",
        }}>
          + Nueva Receta
        </button>
      </div>

      {/* ── KPI cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Recetas",    value: recetas.length,         valueColor: palette.textPrimary, bold: true  },
          { label: "Más usada",        value: masUsada.nombre,        valueColor: "#FF3366",           bold: true  },
          { label: "Nuevas este mes",  value: nuevasEsteMes,          valueColor: "#10B981",           bold: true  },
          { label: "Tiempo promedio",  value: `${tiempoPromedio}min`, valueColor: "#F97316",           bold: true  },
        ].map(k => (
          <div key={k.label} style={{ background: "#fff", borderRadius: 16, padding: "18px 20px", boxShadow: palette.cardShadow, border: `1px solid ${palette.cardBorder}` }}>
            <div style={{ fontSize: 12, color: palette.textMuted, fontWeight: 600, marginBottom: 8 }}>{k.label}</div>
            <div style={{ fontSize: k.label === "Más usada" ? 16 : 26, fontWeight: 900, color: k.valueColor, lineHeight: 1.1 }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* ── Filtros categoría ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22, flexWrap: "wrap" }}>
        {categorias.map(cat => (
          <button
            key={cat}
            onClick={() => setCatActiva(cat)}
            style={{
              padding: "7px 18px", borderRadius: 20, fontSize: 13, fontWeight: 700,
              border: `1px solid ${catActiva === cat ? "#FF3366" : palette.cardBorder}`,
              background: catActiva === cat
                ? "linear-gradient(135deg, #FF6B9D, #FF3366)"
                : "#fff",
              color: catActiva === cat ? "#fff" : palette.textSecondary,
              cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit",
            }}
          >
            {cat}
          </button>
        ))}

        {/* Buscador al final */}
        <div style={{ position: "relative", marginLeft: "auto" }}>
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF" strokeWidth={2}
            style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
            <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Buscar receta..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setCatActiva("Todas"); }}
            style={{
              paddingLeft: 36, paddingRight: 16, height: 38, borderRadius: 20,
              border: `1px solid ${palette.cardBorder}`, background: "#fff",
              fontSize: 13, color: palette.textPrimary, outline: "none",
              width: 200, fontFamily: "inherit",
            }}
          />
        </div>
      </div>

      {/* ── Grid recetas ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        {filtradas.map(r => <RecetaCard key={r.id} receta={r} />)}
        {filtradas.length === 0 && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 0", color: palette.textMuted, fontSize: 14 }}>
            No se encontraron recetas
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        title="Nueva receta"
        style={{
          position: "fixed", bottom: 36, right: 36,
          width: 52, height: 52, borderRadius: "50%",
          background: "linear-gradient(135deg, #FF6B9D, #FF3366)",
          color: "#fff", border: "none", fontSize: 26, cursor: "pointer",
          boxShadow: "0 6px 20px rgba(255,51,102,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "inherit", zIndex: 100,
        }}
      >
        +
      </button>
    </div>
  );
}