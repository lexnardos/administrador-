import React from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Authcontext";

const LoginForm = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLoginSubmit = async (event) => {
        event.preventDefault();

        const email = event.target.email.value.trim();
        const password = event.target.password.value.trim();

        if (!email || !password) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Por favor ingrese el correo y la contraseña.",
            });
            return;
        }

        try {
            const result = await login(email, password);

            if (!result.success) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: result.message || "Credenciales incorrectas.",
                });
                return;
            }

            Swal.fire({
                title: "¡Éxito!",
                text: "Inicio de sesión exitoso.",
                icon: "success",
                showConfirmButton: false,
                timer: 800,
                timerProgressBar: true,
            }).then(() => {
                switch (result.rol_idRol) {
                    case 1:
                        navigate("/dashboard"); // Usuario normal
                        break;
                    case 2:
                        navigate("/admin/calificacion"); // Administrador
                        break;
                    default:
                        Swal.fire({
                            icon: "error",
                            title: "Acceso denegado",
                            text: "Rol de usuario no autorizado.",
                        });
                }
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo conectar al servidor.",
            });
            console.error("Error:", error);
        }
    };

    return (
        <form className="form form-login" onSubmit={handleLoginSubmit}>
            <h2>INICIAR SESIÓN</h2>
            <span>Use su correo y contraseña</span>

            <div className="container-input">
                <input type="email" name="email" placeholder="Gmail" required />
            </div>

            <div className="container-input">
                <input type="password" name="password" placeholder="Contraseña" required />
            </div>

            <a href="/restored">¿Olvidaste tu contraseña?</a>
            <a href="/loginempresa">Soy una empresa</a>

            <button className="button">Iniciar Sesión</button>
        </form>
    );
};

export default LoginForm;
