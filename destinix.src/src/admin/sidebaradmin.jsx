// src/admin/AdminSidebar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "../styles/Sidebar.module.css";
import { useAuth } from "../Authcontext";

const LogoutButton = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <button onClick={handleLogout} className={styles.logoutButton}>
            Cerrar sesión
        </button>
    );
};

const AdminSidebar = () => {
    const { user } = useAuth();

    // Opcional: Si quieres que solo el admin vea este sidebar
    if (!user || user.rol !== 2) return null;

    const adminMenuItems = [
        { path: "/admin/calificacion", label: "Calificaciones", icon: "star" },
        { path: "/admin/categoria", label: "categoria", icon: "star" },
        { path: "/admin/empresa", label: "empresa", icon: "star" },
        { path: "/admin/comentarios", label: "Comentarios", icon: "comments" },
        { path: "/admin/estado", label: "Estados", icon: "toggle-on" },
        { path: "/admin/hoteles", label: "Hoteles", icon: "hotel" },
        { path: "/admin/reserva", label: "Reserva", icon: "map" },
        { path: "/admin/restaurantes", label: "Restaurantes", icon: "utensils" },
        { path: "/admin/rol", label: "Roles", icon: "user-tag" },
        { path: "/admin/seguridad", label: "Seguridad", icon: "shield-alt" },
        { path: "/admin/persona", label: "Persona", icon: "list-alt" },
        { path: "/admin/sitio_turistico", label: "Sitio Turístico", icon: "users" },
    ];

    return (
        <nav className={styles["barra-lateral"]}>
            <ul className={styles.menuList}>
                <li className={styles.logo}>
                    <NavLink to="/">
                        <img
                            src="/imagenes/LOGODES.png"
                            alt="Logo Destinix"
                            className={styles.logoImg}
                        />
                        <span className={styles["nav-item"]}>Destinix</span>
                    </NavLink>
                </li>

                {adminMenuItems.map(({ path, label, icon }, index) => (
                    <li key={index}>
                        <NavLink
                            to={path}
                            className={({ isActive }) => (isActive ? styles.active : "")}
                        >
                            <i className={`fas fa-${icon}`}></i>
                            <span className={styles["nav-item"]}>{label}</span>
                        </NavLink>
                    </li>
                ))}

                <li>
                    <LogoutButton />
                </li>
            </ul>
        </nav>
    );
};

export default AdminSidebar;
