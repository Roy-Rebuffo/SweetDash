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
  home: HomeView,
  clientes: ClientesView,
  pedidos: PedidosView,
  productos: InventarioView,
  recetas: RecetasView,
  calendario: CalendarioView,
  admin: AdminView,
  estadisticas: EstadisticasView,
};

export default function App() {
  const [activeModule, setActiveModule] = useState("home");

  const ActiveView = views[activeModule] || HomeView;

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        background: palette.background,
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      <Sidebar active={activeModule} onNavigate={setActiveModule} />

      {/* Columna derecha: TopBar fija + contenido scrollable */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <TopBar />
        <main
          style={{
            flex: 1,
            overflow: "auto",
            padding: "32px 40px",
            background: palette.background,
          }}
        >
          <ActiveView onNavigate={setActiveModule} />
        </main>
      </div>
    </div>
  );
}