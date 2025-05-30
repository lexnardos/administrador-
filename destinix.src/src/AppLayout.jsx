import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar";
import Header from "./components/Header";
import Slider from "./components/Slider";
import Itinerario from "./pages/Itinerario";
import Planes from "./pages/planes";
import Turismo from "./pages/turismo";
import Restaurantes from "./pages/restaurante";
import Hoteleria from "./pages/hoteleria";
import Mensaje from "./pages/mensajes";
import Notificaciones from "./pages/notificaciones";
import Ajustes from "./pages/ajustes";
import Perfilusu from "./pages/perfilusu";
import PerfilAnunciante from "./pages/perfilanun"

import "./App.css";

const Layout = ({ children, showHeader }) => {

    return (
        <div className="app-container">
            <Sidebar />
            <div className="content">
                {showHeader && <Header />}
                {showHeader && <Slider />}
                {children}
            </div>
        </div>
    );
};


function AppLayout() {
    return (

        <Routes>
            <Route path="/itinerario" element={<Layout showHeader={false}><Itinerario /></Layout>} />
            <Route path="/planes" element={<Layout showHeader={false}><Planes /></Layout>} />
            <Route path="/turismo" element={<Layout showHeader={false}><Turismo /></Layout>} />
            <Route path="/restaurantes" element={<Layout showHeader={false}><Restaurantes /></Layout>} />
            <Route path="/hoteleria" element={<Layout showHeader={false}><Hoteleria /></Layout>} />
            <Route path="/mensajes" element={<Layout showHeader={false}><Mensaje /></Layout>} />
            <Route path="/notificaciones" element={<Layout showHeader={false}><Notificaciones /></Layout>} />
            <Route path="/ajustes" element={<Layout showHeader={false}><Ajustes /></Layout>} />
            <Route path="/perfilusu" element={<Layout showHeader={false}><Perfilusu /></Layout>} />
            <Route path="/perfilanun" element={<PerfilAnunciante />} />

        </Routes>
    );
}

export default AppLayout;
