import { useState } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/Topbar";
import BottomNav from "./components/BottomNav";
import HomeView from "./modules/home/HomeView";
import ClientesView from "./modules/clientes/ClientesView";
import PedidosView from "./modules/pedidos/PedidosView";
import InventarioView from "./modules/inventario/InventarioView";
import RecetasView from "./modules/recetas/RecetasView";
import CalendarioView from "./modules/calendario/CalendarioView";
import AdminView from "./modules/admin/AdminView";
import EstadisticasView from "./modules/estadisticas/EstadisticasView";
import CostesView from "./modules/costes/CostesView";
import useIsMobile from "./hooks/useIsMobile";
import palette from "./theme/palette";
import "./index.css";

const VIEW_META = {
  home:         { title: "Bienvenida",     sub: "Resumen de hoy en tu repostería"        },
  pedidos:      { title: "Pedidos",        sub: "Gestiona y supervisa todos los pedidos" },
  clientes:     { title: "Clientes",       sub: "Base de clientes activos"               },
  productos:    { title: "Inventario",     sub: "Stock y catálogo de productos"          },
  recetas:      { title: "Recetas",        sub: "Biblioteca de recetas guardadas"        },
  calendario:   { title: "Calendario",     sub: "Entregas y eventos programados"         },
  estadisticas: { title: "Estadísticas",   sub: "Analítica y rendimiento"                },
  costes:       { title: "Costes",         sub: "Costes y márgenes por producto"     },
  admin:        { title: "Administración", sub: "Configuración de la tienda"             },
};

export default function App() {
  const [activeModule, setActiveModule] = useState("home");
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const isMobile = useIsMobile();

  const navigate = (id) => { setActiveModule(id); setSidebarOpen(false); };
  const meta = VIEW_META[activeModule] || VIEW_META.home;

  const vp = { isMobile };

  const [editarProducto, setEditarProducto] = useState(null);

  const renderView = () => {
    switch (activeModule) {
      case "home":         return <HomeView onNavigate={navigate} {...vp} />;
      case "pedidos":      return <PedidosView {...vp} />;
      case "clientes":     return <ClientesView {...vp} />;
      case "productos":    return <InventarioView {...vp} />;
      case "recetas": return <RecetasView productoParaEditar={editarProducto} onClearEditar={() => setEditarProducto(null)} onNavigate={navigate} {...vp} />;
      case "calendario":   return <CalendarioView {...vp} />;
      case "estadisticas": return <EstadisticasView {...vp} />;
      case "costes": return <CostesView onNavigate={navigate} onEditarReceta={(prod) => { setEditarProducto(prod); navigate("recetas"); }} {...vp} />;
      case "admin":        return <AdminView {...vp} />;
      default:             return <HomeView onNavigate={navigate} {...vp} />;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        background: palette.bg,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Sidebar — desktop siempre visible, mobile como drawer */}
      {!isMobile && (
        <Sidebar active={activeModule} onNavigate={navigate} isMobile={false} />
      )}
      {isMobile && (
        <Sidebar
          active={activeModule}
          onNavigate={navigate}
          isMobile={true}
          mobileOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        <TopBar
          title={meta.title}
          sub={meta.sub}
          isMobile={isMobile}
          onMenuToggle={() => setSidebarOpen((v) => !v)}
        />
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            padding: isMobile ? "16px" : "28px 40px 28px 36px",
            paddingBottom: isMobile ? "76px" : undefined,
            background: palette.bg,
          }}
        >
          {/* Título de sección en mobile (debajo del topbar) */}
          {isMobile && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 22, color: palette.textDark, lineHeight: 1.2 }}>
                {meta.title}
              </div>
              <div style={{ fontSize: 11.5, color: palette.textLight, marginTop: 3 }}>
                {meta.sub}
              </div>
            </div>
          )}
          {renderView()}
        </main>
      </div>

      {isMobile && <BottomNav active={activeModule} onNavigate={navigate} />}
    </div>
  );
}
