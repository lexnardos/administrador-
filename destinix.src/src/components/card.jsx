// src/components/Card.jsx
import React from "react";
import "../styles/Dashboard.css";

const Card = ({ image, title, description, link }) => {
    return (
        <div className="card">
            {image && <img src={image} alt={title} className="card-img" />}
            <div className="card-body">
                <h3>{title}</h3>
                <p>{description}</p>
                <a href={link} className="btn">
                    Ver Más
                </a>
            </div>
        </div>
    );
};

export default Card;