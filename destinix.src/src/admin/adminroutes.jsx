// src/adminRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/Protectedroute";
import AdminLayout from "./Adminlayout";

import Calificacion from "./calificacion";
import Categoria from "./categoria";
import Comentarios from "./comentarios";
import Empresa from "./empresa";
import Estado from "./estado";
import Hoteles from "./hoteles";
import Itinerario from "./itinerario";
import Persona from "./persona";
import Reserva from "./reserva";
import Restaurantes from "./restaurantes";
import Rol from "./rol";
import Seguridad from "./seguridad";
import SitioTuristico from "./sitio_turistico";

const AdminRoutes = () => {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <ProtectedRoute allowedRoles={[2]}>
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="calificacion" element={<Calificacion />} />
                <Route path="categoria" element={<Categoria />} />
                <Route path="comentarios" element={<Comentarios />} />
                <Route path="empresa" element={<Empresa />} />
                <Route path="estado" element={<Estado />} />
                <Route path="hoteles" element={<Hoteles />} />
                <Route path="itinerario" element={<Itinerario />} />
                <Route path="persona" element={<Persona />} />
                <Route path="reserva" element={<Reserva />} />
                <Route path="restaurantes" element={<Restaurantes />} />
                <Route path="rol" element={<Rol />} />
                <Route path="seguridad" element={<Seguridad />} />
                <Route path="sitio_turistico" element={<SitioTuristico />} />
            </Route>
        </Routes>
    );
};

export default AdminRoutes;
