import React, { useState } from 'react';
import styles from '../styles/LoginEmpresa.module.css';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Authcontext';
import logo from '../styles/imagenes/LOGOD.png';

const LoginEmpresa = () => {
    const [usuario, setUsuario] = useState('');
    const [contraseña, setContraseña] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!usuario || !contraseña) {
            return Swal.fire('Campos vacíos', 'Por favor llena todos los campos', 'warning');
        }

        try {
            const result = await login(usuario, contraseña);

            if (result.success) {
                if (result.rol_idRol === 3) {
                    Swal.fire('Éxito', 'Inicio de sesión correcto', 'success');
                    navigate('/perfilanun');
                } else {
                    Swal.fire('Acceso denegado', 'Este portal es solo para anunciantes.', 'error');
                }
            } else {
                Swal.fire('Error', result.message || 'Credenciales inválidas', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'Ocurrió un problema al iniciar sesión', 'error');
        }
    };

    return (
        <div className={styles.loginPageContainer}>
            <form className={styles.loginWrapper} onSubmit={handleSubmit}>
                <img src={logo} alt="Destinix Logo" className={styles.loginLogo} />
                <h2>Bienvenido de nuevo</h2>
                <p>Inicia sesión con tu cuenta</p>

                <div className={styles.input}>
                    <label htmlFor="usuario">Usuario *</label>
                    <input
                        type="text"
                        id="usuario"
                        placeholder="Enter your Username"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                    />
                </div>

                <div className={styles.input}>
                    <label htmlFor="contraseña">Contraseña *</label>
                    <input
                        type="password"
                        id="contraseña"
                        placeholder="Enter your Password"
                        value={contraseña}
                        onChange={(e) => setContraseña(e.target.value)}
                    />
                </div>

                <button type="submit" className={styles.loginButton}>Acceso</button>

                <div className={styles.loginLinks}>
                    <a href="/restored">¿Se te olvidó tu contraseña?</a>
                    <a href="/login">¿No tienes una cuenta?</a>
                </div>
            </form>
        </div>
    );
};

export default LoginEmpresa;
