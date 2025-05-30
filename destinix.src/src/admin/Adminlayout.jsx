// src/admin/AdminLayout.jsx
import React from "react";
import SidebarAdmin from "./sidebaradmin";
import { Outlet } from "react-router-dom";

const AdminLayout = () => (
    <div className="admin-layout">
        <SidebarAdmin />
        <div className="admin-content">
            <Outlet />
        </div>
    </div>
);

export default AdminLayout;
