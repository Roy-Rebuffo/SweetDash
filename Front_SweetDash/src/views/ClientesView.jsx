import { useState, useEffect } from "react";
import palette from "../theme/palette";
import { clientesApi } from "../services/api";

// Mapea los campos del backend — nombre y apellidos siempre juntos
function mapCliente(c) {
  const nombre   = (c.nombre    || "").trim();
  const apellidos = (c.apellidos || "").trim();
  return {
    id:        c.idCliente,
    nombre:    apellidos ? `${nombre} ${apellidos}` : nombre,
    email:     c.email     || "—",
    telefono:  c.telefono  || "—",
    direccion: c.direccion || "—",
    notas:     c.notas     || "",
    tipo:      "Cliente",
  };
}

const AVATAR_COLORS = [palette.primary, palette.accent1, palette.accent2, palette.accent3, palette.primaryMid];

function Avatar({ nombre, idx }) {
  const words    = nombre.trim().split(/\s+/);
  const initials = words.length >= 2
    ? (words[0][0] + words[1][0]).toUpperCase()
    : (words[0][0] || "?").toUpperCase();
  const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];
  return (
    <div
      style={{
        width: 32, height: 32, borderRadius: "50%",
        background: `${color}1A`, border: `1.5px solid ${color}44`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color, fontWeight: 700, fontSize: 11, flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

function StatCard({ label, value, trend, trendColor }) {
  return (
    <div
      style={{
        background: palette.bgCard, borderRadius: 14,
        border: `1px solid ${palette.border}`,
        boxShadow: "0 1px 4px oklch(0% 0 0 / 0.04)",
        padding: "20px 22px",
      }}
    >
      <div style={{ fontSize: 10.5, fontWeight: 600, color: palette.textLight, letterSpacing: "0.7px", textTransform: "uppercase", marginBottom: 10 }}>
        {label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: palette.textDark, letterSpacing: "-0.5px", lineHeight: 1, marginBottom: 8 }}>
        {value}
      </div>
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

const ITEMS_PER_PAGE = 8;

export default function ClientesView() {
  const [clientes,   setClientes]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page,       setPage]       = useState(1);

  useEffect(() => {
    setLoading(true);
    clientesApi.getAll()
      .then((data) => { setClientes(data.map(mapCliente)); setError(null); })
      .catch((err)  => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtrados  = clientes.filter((c) =>
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtrados.length / ITEMS_PER_PAGE));
  const paginados  = filtrados.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const handleSearch = (v) => { setSearchTerm(v); setPage(1); };

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", position: "relative" }}>

      {/* Loading */}
      {loading && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, gap: 12, color: palette.textLight, fontSize: 14 }}>
          <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${palette.border}`, borderTop: `2px solid ${palette.primary}`, animation: "spin 0.8s linear infinite" }} />
          Cargando clientes...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 14, padding: "18px 22px", marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 18 }}>⚠️</span>
          <div>
            <div style={{ fontWeight: 700, color: "#991B1B", fontSize: 13 }}>No se pudo conectar con el servidor</div>
            <div style={{ color: "#B91C1C", fontSize: 12, marginTop: 2 }}>{error} — Asegúrate de que Spring Boot está corriendo en <b>localhost:8080</b> y CORS está configurado.</div>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      {!loading && !error && (
        <>
          {/* KPI cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
            <StatCard label="Total clientes"   value={String(clientes.length)} />
            <StatCard label="Activos este mes"  value="—" trend="+8 nuevos"     trendColor={palette.accent3} />
            <StatCard label="Ticket promedio"   value="—" />
            <StatCard label="Clientes VIP"      value="—" trend="≥10 pedidos"   trendColor={palette.accent2} />
          </div>

          {/* Search + new button */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, marginBottom: 16 }}>
            <div style={{ position: "relative" }}>
              <svg
                width="13" height="13" fill="none" viewBox="0 0 24 24" stroke={palette.textLight} strokeWidth={2}
                style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
              >
                <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Buscar cliente..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                style={{
                  paddingLeft: 32, paddingRight: 14, height: 34, borderRadius: 20,
                  border: `1px solid ${palette.border}`, background: palette.bgCard,
                  fontSize: 12.5, color: palette.textDark, width: 196,
                }}
                onFocus={(e) => (e.target.style.borderColor = palette.primaryMid)}
                onBlur={(e)  => (e.target.style.borderColor = palette.border)}
              />
            </div>
            <button
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "7px 16px", borderRadius: 20, fontSize: 12.5, fontWeight: 600,
                border: "none", background: palette.primary, color: "#fff", cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: `0 2px 10px ${palette.primary}33`,
              }}
            >
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Nuevo cliente
            </button>
          </div>

          {/* Table */}
          <div
            style={{
              background: palette.bgCard, borderRadius: 14,
              border: `1px solid ${palette.border}`,
              boxShadow: "0 1px 4px oklch(0% 0 0 / 0.04)",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2.2fr 2fr 1.4fr 1.6fr 0.7fr",
                padding: "11px 22px",
                background: palette.bg,
                borderBottom: `1px solid ${palette.border}`,
              }}
            >
              {["Cliente", "Correo electrónico", "Teléfono", "Dirección", ""].map((h) => (
                <span
                  key={h}
                  style={{ fontSize: 10, fontWeight: 700, color: palette.textLight, letterSpacing: "0.8px", textTransform: "uppercase" }}
                >
                  {h}
                </span>
              ))}
            </div>

            {/* Rows */}
            {paginados.length === 0 ? (
              <div style={{ padding: "48px 24px", textAlign: "center", color: palette.textLight, fontSize: 13 }}>
                No se encontraron clientes
              </div>
            ) : (
              paginados.map((c, i) => (
                <div
                  key={c.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2.2fr 2fr 1.4fr 1.6fr 0.7fr",
                    padding: "13px 22px", alignItems: "center",
                    borderTop: i > 0 ? `1px solid ${palette.border}` : "none",
                    transition: "background 0.12s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = palette.bg)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {/* Nombre completo */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar nombre={c.nombre} idx={i} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: palette.textDark }}>
                      {c.nombre}
                    </span>
                  </div>

                  {/* Email */}
                  <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: palette.textMid }}>
                    <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke={palette.textLight} strokeWidth={1.7}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {c.email}
                  </div>

                  {/* Teléfono */}
                  <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: palette.textMid }}>
                    <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke={palette.textLight} strokeWidth={1.7}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {c.telefono}
                  </div>

                  {/* Dirección */}
                  <span
                    style={{
                      fontSize: 12, color: palette.textMid,
                      overflow: "hidden", textOverflow: "ellipsis",
                      whiteSpace: "nowrap", paddingRight: 8,
                    }}
                  >
                    {c.direccion}
                  </span>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      title="Editar"
                      style={{
                        width: 28, height: 28, borderRadius: 7,
                        border: `1px solid ${palette.border}`, background: palette.bgCard,
                        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                        color: palette.primary, transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = palette.primaryLt; e.currentTarget.style.borderColor = palette.primary; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = palette.bgCard;    e.currentTarget.style.borderColor = palette.border;  }}
                    >
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      title="Eliminar"
                      style={{
                        width: 28, height: 28, borderRadius: 7,
                        border: `1px solid ${palette.border}`, background: palette.bgCard,
                        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#EF4444", transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#FEF2F2"; e.currentTarget.style.borderColor = "#EF4444"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = palette.bgCard; e.currentTarget.style.borderColor = palette.border; }}
                    >
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* Pagination */}
            <div
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "12px 22px", borderTop: `1px solid ${palette.border}`,
                background: palette.bg,
              }}
            >
              <span style={{ fontSize: 12, color: palette.textLight }}>
                {paginados.length} de {filtrados.length} clientes
              </span>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{
                    width: 28, height: 28, borderRadius: 7,
                    border: `1px solid ${palette.border}`, background: palette.bgCard,
                    cursor: page === 1 ? "default" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: palette.textMid, opacity: page === 1 ? 0.35 : 1,
                  }}
                >
                  <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    style={{
                      width: 28, height: 28, borderRadius: 7, fontSize: 12, fontWeight: 600,
                      border: `1px solid ${n === page ? palette.primary : palette.border}`,
                      background: n === page ? palette.primary : palette.bgCard,
                      color: n === page ? "#fff" : palette.textMid, cursor: "pointer",
                    }}
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={{
                    width: 28, height: 28, borderRadius: 7,
                    border: `1px solid ${palette.border}`, background: palette.bgCard,
                    cursor: page === totalPages ? "default" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: palette.textMid, opacity: page === totalPages ? 0.35 : 1,
                  }}
                >
                  <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
