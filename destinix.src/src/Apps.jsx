import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar";
import Inicio from "./pages/dashboard";
import Itinerario from "./pages/Itinerario";
import Planes from "./pages/planes";
import Turismo from "./pages/turismo";
import Restaurantes from "./pages/restaurante";
import Hoteleria from "./pages/hoteleria";
import ProtectedRoute from "./components/Protectedroute";
import Perfilusu from "./pages/perfilusu";
import PerfilAnunciante from "./pages/perfilanun"

import "../src/styles/Apps.css";

const Layout = ({ children }) => (
    <div className="app-container">
        <Sidebar />
        <div className="content">{children}</div>
    </div>
);

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout><Inicio /></Layout>} />
            <Route path="/itinerario" element={<ProtectedRoute><Layout><Itinerario /></Layout></ProtectedRoute>} />
            <Route path="/planes" element={<ProtectedRoute><Layout><Planes /></Layout></ProtectedRoute>} />
            <Route path="/turismo" element={<ProtectedRoute><Layout><Turismo /></Layout></ProtectedRoute>} />
            <Route path="/restaurantes" element={<ProtectedRoute><Layout><Restaurantes /></Layout></ProtectedRoute>} />
            <Route path="/hoteleria" element={<ProtectedRoute><Layout><Hoteleria /></Layout></ProtectedRoute>} />
            <Route path="/perfilusu" element={<ProtectedRoute><Layout><Perfilusu /></Layout></ProtectedRoute>} />
            <Route path="/perfilanun" element={<ProtectedRoute><PerfilAnunciante /></ProtectedRoute>} />
        </Routes>
    );
}

export default App;
