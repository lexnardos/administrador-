import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import styles from "../styles/Sidebar.module.css"; // CSS Module
import LogoutButton from "../components/logout";
import { fetchUsuario } from "../services/api";

const Sidebar = () => {
    const [usuario, setUsuario] = useState({
        nombre: "",
        foto: "http://localhost/destinix/imagenes/default.png",
        rol: null,
    });

    useEffect(() => {
        const cargarUsuario = async () => {
            try {
                const data = await fetchUsuario();
                if (!data.error) {
                    setUsuario({
                        rol: data.rol_idRol,
                        nombre: data.nombre_usu,
                        foto: data.foto_perfil || "http://localhost/destinix/imagenes/default.png",
                    });
                }
            } catch (error) {
                console.error("Error al cargar el usuario:", error);
            }
        };
        cargarUsuario();
    }, []);

    const menuItems = [
        { path: "/dashboard", label: "Inicio", icon: "home" },
        { path: "/itinerario", label: "Itinerario", icon: "calendar-alt" },
        { path: "/planes", label: "Planes", icon: "map-marked-alt" },
        { path: "/turismo", label: "Turismo", icon: "plane-departure" },
        { path: "/restaurantes", label: "Restaurantes", icon: "utensils" },
        { path: "/hoteleria", label: "Hotelería", icon: "hotel" },
    ];

    return (
        <nav className={styles["barra-lateral"]}>
            <ul className={styles.menuList}>
                <li className={styles.logo}>
                    <NavLink to="/">
                        <img src="/imagenes/LOGODES.png" alt="Logo Destinix" className={styles.logoImg} />
                        <span className={styles["nav-item"]}>Destinix</span>
                    </NavLink>
                </li>

                {menuItems.map(({ path, label, icon }, index) => (
                    <li key={index}>
                        <NavLink to={path} className={({ isActive }) => isActive ? styles.active : ""}>
                            <i className={`fas fa-${icon}`}></i>
                            <span className={styles["nav-item"]}>{label}</span>
                        </NavLink>
                    </li>
                ))}

                <li>
                    <NavLink to="/login" className={({ isActive }) => isActive ? styles.active : ""}>
                        <LogoutButton />
                    </NavLink>
                </li>
            </ul>

            {usuario.rol !== null && (
                <NavLink
                    to={usuario.rol === 3 ? "/perfilanun" : "/perfilusu"}
                    className={styles.profileLink}
                >
                    <img
                        src={usuario.foto || "http://localhost/destinix/imagenes/default.png"}
                        alt="Foto de perfil"
                        className={styles.profileImage}
                    />
                    <span className={styles.profileName}>{usuario.nombre}</span>
                </NavLink>
            )}

        </nav>
    );
};

export default Sidebar;
