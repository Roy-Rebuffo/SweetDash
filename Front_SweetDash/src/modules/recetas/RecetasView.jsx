import palette from "../../theme/palette";
import FilterSelect from "../../components/FilterSelect";
import useRecetas from "./hooks/useRecetas";
import RecetaCard from "./components/RecetaCard";
import RecetaModal from "./components/RecetaModal";
import VistaModal from "./components/VistaModal";
import { ConfirmModal, ConflictoRecetaModal } from "./components/ConfirmModal";

function StatCard({ label, value, valueColor }) {
  return (
    <div style={{ background: palette.bgCard, borderRadius: 14, border: `1px solid ${palette.border}`, boxShadow: "0 1px 4px oklch(0% 0 0 / 0.04)", padding: "20px 22px" }}>
      <div style={{ fontSize: 10.5, fontWeight: 600, color: palette.textLight, letterSpacing: "0.7px", textTransform: "uppercase", marginBottom: 10 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: valueColor || palette.textDark, letterSpacing: "-0.5px", lineHeight: 1 }}>{value}</div>
    </div>
  );
}

export default function RecetasView({ isMobile = false, productoParaEditar = null, onClearEditar, onNavigate }) {
  const {
    productos, tamañosMap, loading, error,
    searchTerm, setSearchTerm, catActiva, setCatActiva,
    modalOpen, setModalOpen, editProducto, verProducto, setVerProducto,
    deleteTarget, setDeleteTarget, conflictoTarget, setConflictoTarget, deleting,
    handleNuevo, handleEditar, handleSaved, handleEliminar, handleCancelarPedidosYBorrar,
    pedidosEntregados, categorias, promedioTamaños, filtrados, usadaMap,
  } = useRecetas({ productoParaEditar, onClearEditar, onNavigate });

  return (
    <div style={{ maxWidth: 1150, margin: "0 auto", position: "relative" }}>

      {verProducto && <VistaModal producto={verProducto} onClose={() => setVerProducto(null)} onEditar={handleEditar} />}
      {modalOpen && <RecetaModal producto={editProducto} onClose={() => setModalOpen(false)} onSaved={handleSaved} isMobile={isMobile} />}
      {deleteTarget && <ConfirmModal nombre={deleteTarget.nombre} onClose={() => setDeleteTarget(null)} onConfirm={handleEliminar} loading={deleting} />}
      {conflictoTarget && (
        <ConflictoRecetaModal
          producto={conflictoTarget.producto}
          conflictos={conflictoTarget.conflictos}
          loading={deleting}
          onCancelarBorrado={() => setConflictoTarget(null)}
          onCancelarPedidos={handleCancelarPedidosYBorrar}
          onEditarPedido={() => { setConflictoTarget(null); onNavigate && onNavigate("pedidos"); }}
        />
      )}

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
            <StatCard label="Tamaños promedio" value={`${promedioTamaños} tam.`} valueColor={palette.accent2} />
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
                numTamaños={tamañosMap[p.idProducto] || 0}
                usada={usadaMap[p.idProducto] || 0}
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
