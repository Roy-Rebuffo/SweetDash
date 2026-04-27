import { useState } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/Topbar";
import HomeView from "./views/HomeView";
import ClientesView from "./views/ClientesView";
import PedidosView from "./views/PedidosView";
import InventarioView from "./views/InventarioView";
import RecetasView from "./views/RecetasView";
import CalendarioView from "./views/CalendarioView";
import AdminView from "./views/AdminView";
import EstadisticasView from "./views/EstadisticasView";
import palette from "./theme/palette";
import "./index.css";

const views = {
  home:         HomeView,
  clientes:     ClientesView,
  pedidos:      PedidosView,
  productos:    InventarioView,
  recetas:      RecetasView,
  calendario:   CalendarioView,
  admin:        AdminView,
  estadisticas: EstadisticasView,
};

const VIEW_META = {
  home:         { title: 'Bienvenida',     sub: 'Resumen de hoy en tu repostería'       },
  pedidos:      { title: 'Pedidos',        sub: 'Gestiona y supervisa todos los pedidos' },
  clientes:     { title: 'Clientes',       sub: 'Base de clientes activos'              },
  productos:    { title: 'Inventario',     sub: 'Stock y catálogo de productos'         },
  recetas:      { title: 'Recetas',        sub: 'Biblioteca de recetas guardadas'       },
  calendario:   { title: 'Calendario',     sub: 'Entregas y eventos programados'        },
  estadisticas: { title: 'Estadísticas',   sub: 'Analítica y rendimiento'               },
  admin:        { title: 'Administración', sub: 'Configuración de la tienda'            },
};

export default function App() {
  const [activeModule, setActiveModule] = useState("home");

  const ActiveView = views[activeModule] || HomeView;
  const meta = VIEW_META[activeModule] || VIEW_META.home;

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
      <Sidebar active={activeModule} onNavigate={setActiveModule} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        <TopBar title={meta.title} sub={meta.sub} />
        <main
          style={{
            flex: 1,
            overflow: "auto",
            padding: "28px 36px",
            background: palette.bg,
          }}
        >
          <ActiveView onNavigate={setActiveModule} />
        </main>
      </div>
    </div>
  );
}
