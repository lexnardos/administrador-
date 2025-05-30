import React from "react";
import { useAuth } from "../Authcontext";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Sidebar.module.css"; // los estilos base del botón

const LogoutButton = ({ className = "" }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/", { replace: true });
    };

    return (
        <button
            onClick={handleLogout}
            className={`${styles.enlace} ${styles.logout} ${className}`} 
        >
            <i className="fas fa-sign-out-alt"></i>
            <span className={styles["item-menu"]}>Cerrar sesión</span>
        </button>
    );
};

export default LogoutButton;
