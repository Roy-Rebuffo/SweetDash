import { useState, useEffect } from "react";
import palette from "../theme/palette";
import { clientesApi } from "../services/api";

// Mapea los campos del backend → campos que usa el componente
function mapCliente(c, idx) {
  return {
    id:          c.idCliente,
    nombre:      `${c.nombre} ${c.apellidos}`,
    email:       c.email,
    telefono:    c.telefono,
    direccion:   c.direccion,
    notas:       c.notas,
    tipo:        "Cliente",
    ultimoPedido:"—",
    totalGasto:  "—",
  };
}

const tipoColor = {
  "Premium Member": { color: palette.primary },
  "Regular":        { color: "#6B7280" },
  "Nuevo cliente":  { color: "#10B981" },
  "Corporativo":    { color: "#3B82F6" },
  "Cliente":        { color: palette.accent },
};

const avatarBgs = ["#7A3A8E", "#AD74C3", "#522566", "#3B82F6", "#10B981"];

function Avatar({ nombre, id }) {
  const initials = nombre.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const bg = avatarBgs[(id - 1) % avatarBgs.length];
  return (
    <div style={{ width: 40, height: 40, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>
      {initials}
    </div>
  );
}

const ITEMS_PER_PAGE = 5;

export default function ClientesView() {
  const [clientes,   setClientes]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page,       setPage]       = useState(1);

  useEffect(() => {
    setLoading(true);
    clientesApi.getAll()
      .then(data => { setClientes(data.map(mapCliente)); setError(null); })
      .catch(err  => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtrados  = clientes.filter(c =>
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtrados.length / ITEMS_PER_PAGE));
  const paginados  = filtrados.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const handleSearch = (v) => { setSearchTerm(v); setPage(1); };

  const kpis = [
    { label: "Total Clientes",   value: clientes.length, valueColor: palette.textPrimary },
    { label: "Nuevos este mes",  value: "—",             valueColor: "#10B981"           },
    { label: "Clientes activos", value: "—",             valueColor: "#3B82F6"           },
    { label: "Valor promedio",   value: "—",             valueColor: "#A855F7"           },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Loading */}
      {loading && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, gap: 12, color: palette.textMuted, fontSize: 15 }}>
          <div style={{ width: 20, height: 20, borderRadius: "50%", border: `3px solid ${palette.cardBorder}`, borderTop: `3px solid ${palette.primary}`, animation: "spin 0.8s linear infinite" }} />
          Cargando clientes...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 16, padding: "20px 24px", marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 20 }}>⚠️</span>
          <div>
            <div style={{ fontWeight: 800, color: "#991B1B", fontSize: 14 }}>No se pudo conectar con el servidor</div>
            <div style={{ color: "#B91C1C", fontSize: 13, marginTop: 2 }}>{error} — Asegúrate de que Spring Boot está corriendo en <b>localhost:8080</b> y CORS está configurado.</div>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      {!loading && !error && (
        <>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, gap: 16, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div>
                <h1 style={{ fontSize: 26, fontWeight: 900, color: palette.textPrimary, margin: 0, letterSpacing: "-0.5px" }}>
                  Directorio de Clientes
                </h1>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 7, background: palette.soft, border: `1px solid ${palette.cardBorder}`, borderRadius: 20, padding: "6px 14px" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: palette.accent }} />
                <span style={{ fontSize: 12, fontWeight: 800, color: palette.primary, letterSpacing: "0.4px" }}>
                  {clientes.length} TOTAL
                </span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ position: "relative" }}>
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF" strokeWidth={2}
                  style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                  <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="text" placeholder="Buscar cliente..." value={searchTerm}
                  onChange={e => handleSearch(e.target.value)}
                  style={{ paddingLeft: 36, paddingRight: 16, height: 38, borderRadius: 20, border: `1px solid ${palette.cardBorder}`, background: "#fff", fontSize: 13, color: palette.textPrimary, outline: "none", width: 210, fontFamily: "inherit" }}
                />
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
            {kpis.map(k => (
              <div key={k.label} style={{ background: "#fff", borderRadius: 16, padding: "18px 20px", boxShadow: palette.cardShadow, border: `1px solid ${palette.cardBorder}` }}>
                <div style={{ fontSize: 12, color: palette.textMuted, fontWeight: 600, marginBottom: 8 }}>{k.label}</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: k.valueColor, lineHeight: 1.1 }}>{k.value}</div>
              </div>
            ))}
          </div>

          {/* Tabla */}
          <div style={{ background: "#fff", borderRadius: 20, boxShadow: palette.cardShadow, border: `1px solid ${palette.cardBorder}`, overflow: "hidden" }}>
            {/* Cabecera */}
            <div style={{ display: "grid", gridTemplateColumns: "2.5fr 2fr 1.4fr 1.4fr 1fr", padding: "14px 24px", borderBottom: `1px solid ${palette.cardBorder}` }}>
              {["NOMBRE DEL CLIENTE", "CORREO ELECTRÓNICO", "TELÉFONO", "DIRECCIÓN", "ACCIONES"].map(h => (
                <span key={h} style={{ fontSize: 11, fontWeight: 800, color: palette.textMuted, letterSpacing: "0.6px" }}>{h}</span>
              ))}
            </div>

            {/* Filas */}
            {paginados.length === 0 ? (
              <div style={{ padding: "40px 24px", textAlign: "center", color: palette.textMuted, fontSize: 14 }}>
                No se encontraron clientes
              </div>
            ) : (
              paginados.map((c, i) => (
                <div key={c.id}
                  style={{ display: "grid", gridTemplateColumns: "2.5fr 2fr 1.4fr 1.4fr 1fr", padding: "16px 24px", alignItems: "center", borderTop: i > 0 ? `1px solid ${palette.cardBorder}` : "none", transition: "background 0.12s" }}
                  onMouseEnter={e => e.currentTarget.style.background = palette.background}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Avatar nombre={c.nombre} id={c.id} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#1A0D2E" }}>{c.nombre}</div>
                      <div style={{ fontSize: 12, color: tipoColor[c.tipo]?.color ?? palette.textMuted, fontWeight: 600, marginTop: 1 }}>{c.tipo}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: "#6B7280" }}>{c.email}</div>
                  <div style={{ fontSize: 13, color: "#6B7280" }}>{c.telefono}</div>
                  <div style={{ fontSize: 13, color: "#6B7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 8 }}>{c.direccion}</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button title="Editar" style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${palette.cardBorder}`, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: palette.accent, transition: "all 0.15s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = palette.soft; e.currentTarget.style.borderColor = palette.accent; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = palette.cardBorder; }}
                    >
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button title="Eliminar" style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${palette.cardBorder}`, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#EF4444", transition: "all 0.15s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#FEF2F2"; e.currentTarget.style.borderColor = "#EF4444"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = palette.cardBorder; }}
                    >
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* Paginación */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", borderTop: `1px solid ${palette.cardBorder}` }}>
              <span style={{ fontSize: 13, color: palette.textMuted }}>
                Mostrando {paginados.length} de {filtrados.length} clientes
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${palette.cardBorder}`, background: page === 1 ? palette.background : "#fff", color: page === 1 ? palette.textMuted : palette.textPrimary, cursor: page === 1 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: palette.primary, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>{page}</div>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${palette.cardBorder}`, background: page === totalPages ? palette.background : "#fff", color: page === totalPages ? palette.textMuted : palette.textPrimary, cursor: page === totalPages ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          </div>

          {/* FAB */}
          <button style={{ position: "fixed", bottom: 36, right: 36, width: 52, height: 52, borderRadius: "50%", background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`, color: "#fff", border: "none", fontSize: 26, cursor: "pointer", boxShadow: "0 6px 20px rgba(82,37,102,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit", zIndex: 100 }} title="Nuevo cliente">
            +
          </button>
        </>
      )}
    </div>
  );
}