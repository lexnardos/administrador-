// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/index";
import Login from "./pages/login";
import LoginEmpresa from "./pages/loginempresa";
import Dashboard from "./pages/dashboard";
import Apps from "./Apps"; // Usuario
import AdminRoutes from "../src/admin/adminroutes"; 

import '@fortawesome/fontawesome-free/css/all.min.css';

const App = () => {
  return (
    <Routes>
      {/* Vistas públicas */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/loginempresa" element={<LoginEmpresa />} />
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Usuario */}
      <Route path="/*" element={<Apps />} />

      {/* Admin */}
      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
  );
};

export default App;
