// src/components/Header.jsx
import React from "react";
import "../styles/Dashboard.css";

const Header = () => {
    return (
        <header>
            <h1 className="title">DESTINIX</h1>
            <p className="p-no">
                Bienvenido a destinix, aquí podrás ver hoteles, restaurantes y
                lugares que podrás visitar en Bogotá.
            </p>
            <p className="p-no">¡Sé libre de explorarla!</p>
            <hr />
        </header>
    );
};

export default Header;