import React, { useState } from "react";
import "../styles/login.css";
import Swal from "sweetalert2";
import { registerUser } from "../services/api"; // Importa la función desde tu archivo API

function Register() {
    const [registerData, setRegisterData] = useState({
        nombre: "",
        apellidos: "",
        telefono: "",
        email: "",
        documento: "",
        localidad: "",
        genero: "",
        fecha: "",
        contraseña: "",
    });

    const handleRegisterChange = (e) => {
        setRegisterData({
            ...registerData,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await registerUser(registerData);
            Swal.fire({
                title: "¡Registro Exitoso!",
                text: result.message || "Te has registrado correctamente.",
                icon: "success",
            }).then(() => {
                setRegisterData({
                    nombre: "",
                    apellidos: "",
                    telefono: "",
                    email: "",
                    documento: "",
                    localidad: "",
                    genero: "",
                    fecha: "",
                    contraseña: "",
                });
            });
            
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message || "Hubo un error al registrar.",
            });
        }
    };

    return (
        <div className="container-form">
            <form className="sign-up" onSubmit={handleRegisterSubmit}>
                <h2>REGISTRARSE</h2>
                <div className="social-networks">
                    <ion-icon name="logo-instagram"></ion-icon>
                    <ion-icon name="logo-facebook"></ion-icon>
                    <ion-icon name="logo-twitter"></ion-icon>
                    <ion-icon name="logo-tiktok"></ion-icon>
                </div>
                <span>Digite los siguientes datos</span>

                <div className="container-input">
                    <ion-icon name="person-circle-outline"></ion-icon>
                    <input
                        type="text"
                        placeholder="Nombres"
                        name="nombre"
                        value={registerData.nombre}
                        onChange={handleRegisterChange}
                    />
                    <input
                        type="text"
                        placeholder="Apellidos"
                        name="apellidos"
                        value={registerData.apellidos}
                        onChange={handleRegisterChange}
                    />
                </div>

                <div className="container-input">
                    <ion-icon name="call-outline"></ion-icon>
                    <input
                        type="tel"
                        placeholder="Telefono"
                        name="telefono"
                        value={registerData.telefono}
                        onChange={handleRegisterChange}
                    />
                </div>

                <div className="container-input">
                    <ion-icon name="mail-outline"></ion-icon>
                    <input
                        type="email"
                        placeholder="Gmail"
                        name="email"
                        value={registerData.email}
                        onChange={handleRegisterChange}
                    />
                </div>

                <div className="container-input">
                    <ion-icon name="id-card-outline"></ion-icon>
                    <input
                        type="text"
                        placeholder="Numero de Documento"
                        name="documento"
                        value={registerData.documento}
                        onChange={handleRegisterChange}
                    />
                </div>

                <div className="container-input">
                    <ion-icon name="map-outline"></ion-icon>
                    <select
                        name="localidad"
                        value={registerData.localidad}
                        onChange={handleRegisterChange}
                    >
                        <option value="0">Seleccione una localidad</option>
                        <option value="Usaquen">Usaquen</option>
                        <option value="Chapinero">Chapinero</option>
                        <option value="Santa Fe">Santa Fe</option>
                        <option value="San Cristobal">San Cristobal</option>
                        <option value="Usme">Usme</option>
                        <option value="Tunjuelito">Tunjuelito</option>
                        <option value="Bosa">Bosa</option>
                        <option value="Kennedy">Kennedy</option>
                        <option value="Fontibon">Fontibon</option>
                        <option value="Engativa">Engativa</option>
                        <option value="Suba">Suba</option>
                        <option value="Barrios Unidos">Barrios Unidos</option>
                        <option value="Teusaquillo">Teusaquillo</option>
                        <option value="Los Martires">Los Martires</option>
                        <option value="Antonio Nariño">Antonio Nariño</option>
                        <option value="Puente Aranda">Puente Aranda</option>
                        <option value="Candelaria">Candelaria</option>
                        <option value="Rafael Uribe Uribe">Rafael Uribe Uribe</option>
                        <option value="Ciudad Bolivar">Ciudad Bolivar</option>
                        <option value="Sumapaz">Sumapaz</option>
                    </select>
                </div>

                <div className="container-input">
                    <ion-icon name="male-female-outline"></ion-icon>
                    <select
                        name="genero"
                        value={registerData.genero}
                        onChange={handleRegisterChange}
                    >
                        <option value="">Seleccione</option>
                        <option value="masculino">Masculino</option>
                        <option value="femenino">Femenino</option>
                        <option value="otro">Otro</option>
                    </select>
                </div>

                <div className="container-input">
                    <p className="fechan">Fecha de Nacimiento</p>
                    <ion-icon name="calendar-number-outline"></ion-icon>
                    <input
                        type="date"
                        name="fecha"
                        value={registerData.fecha}
                        onChange={handleRegisterChange}
                    />
                </div>

                <div className="container-input">
                    <ion-icon name="lock-closed-outline"></ion-icon>
                    <input
                        type="password"
                        placeholder="Contraseña"
                        name="contraseña"
                        value={registerData.contraseña}
                        onChange={handleRegisterChange}
                    />
                </div>

                <button className="button" type="submit">
                    Registrarse
                </button>
            </form>
        </div>
    );
}

export default Register;
