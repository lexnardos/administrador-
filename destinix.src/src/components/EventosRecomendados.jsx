import React from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import "../styles/EventosRecomendados.css";

const eventos = [
  {
    imagen: "/img/chorro.jpg",
    titulo: "Sitios Turísticos",
    descripcion: "Gestión de sitios turísticos",
    enlace: "/sitios"
  },
  {
    imagen: "/img/chorro.jpg",
    titulo: "Hoteles",
    descripcion: "Gestión de hoteles",
    enlace: "/hoteles"
  },
  {
    imagen: "/img/chorro.jpg",
    titulo: "Restaurantes",
    descripcion: "Gestión de restaurantes",
    enlace: "/restaurantes"
  },
  {
    imagen: "/img/chorro.jpg",
    titulo: "Calificación",
    descripcion: "Gestión de calificaciones",
    enlace: "/calificacion"
  },
  {
    imagen: "/img/chorro.jpg",
    titulo: "Categoría",
    descripcion: "Gestión de categorías",
    enlace: "/categoria"
  },
  {
    imagen: "/img/chorro.jpg",
    titulo: "Empresa",
    descripcion: "Gestión de empresas",
    enlace: "/empresa"
  },
  {
    imagen: "/img/chorro.jpg",
    titulo: "Estado",
    descripcion: "Gestión de estados",
    enlace: "/estado"
  },
  {
    imagen: "/img/chorro.jpg",
    titulo: "Persona",
    descripcion: "Gestión de personas",
    enlace: "/persona"
  },
  {
    imagen: "/img/chorro.jpg",
    titulo: "Rol",
    descripcion: "Gestión de roles",
    enlace: "/rol"
  }
];

const EventosRecomendados = () => {
  return (
    <section className="main-course">
      <h1>EVENTOS RECOMENDADOS</h1>
      <p className="p-no">Aquí podrás ver los eventos recomendados que te estaremos ofreciendo.</p>
      <hr />
      <div className="course-box">
        <div className="card-container">
          {eventos.map((evento, index) => (
            <Link key={index} to={evento.enlace} style={{ textDecoration: "none", color: "inherit" }}>
              <Card {...evento} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventosRecomendados;
