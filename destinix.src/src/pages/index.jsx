import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

function Index() {
  useEffect(() => {
    // JavaScript para la funcionalidad del navbar y scroll
    let prevScrollPos = window.pageYOffset;
    const navbar = document.querySelector('nav.navbar');

    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      if (prevScrollPos > currentScrollPos) {
        navbar.style.top = "0";
        navbar.style.opacity = "1";
      } else {
        navbar.style.top = "-100px";
        navbar.style.opacity = "0";
      }
      prevScrollPos = currentScrollPos;
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    alert('Formulario enviado con éxito.');
  };

  return (
    <div>
      <header className="banner">
        <div className="banner-content">
          <img src="../imagenes/LOGODES.png" alt="Logo de Turismo en Bogotá" className="logo"/>
          <div className="banner-text">
            <h1>DESTINIX</h1>
            <h4>Don&apos;t stop traveling</h4>
          </div>
        </div>
      </header>

      <nav className="navbar">
        <ul>
          <li><a href="#inicio">Inicio</a></li>
          <li><a href="#sobre-nosotros">Sobre Nosotros</a></li>
          <li><a href="#servicios">Servicios</a></li>
          <li><a href="#contacto">Contáctanos</a></li>
          <li><Link to="./login">Iniciar Sesión</Link></li>
        </ul>
      </nav>

      <main>
        <section id="inicio" className="intro">
          <h2>Bienvenido a Bogotá</h2>
          <p>
            Explora la vibrante cultura, la historia rica y los hermosos paisajes de Bogotá.
            Desde museos fascinantes hasta deliciosa gastronomía, ¡tenemos todo lo que necesitas para una experiencia inolvidable!
          </p>
        </section>

        <section id="sobre-nosotros" className="about">
          <h2>Sobre Nosotros</h2>
          <p>
            Somos una agencia de turismo dedicada a ofrecerte las mejores experiencias en Bogotá.
            Nuestro equipo está compuesto por expertos locales que conocen cada rincón de la ciudad y están comprometidos a hacer que tu visita sea especial.
          </p>
        </section>

        <section id="servicios" className="services">
          <h2>Servicios</h2>
          <div className="card-container">
            {[
              {
                img: "/imagenes/hotel2.jpg",
                title: "Hotelería",
                text: "Ofrecemos una selección de hoteles y alojamientos que se adaptan a todos los presupuestos y preferencias.",
                link: "/login",
              },
              {
                img: "/imagenes/comida.jpg",
                title: "Restaurantes",
                text: "Disfruta de la exquisita gastronomía bogotana en nuestros restaurantes recomendados.",
                link: "/login",
              },
              {
                img: "/imagenes/monserrate222.jpg",
                title: "Turismo",
                text: "Visita los principales atractivos turísticos de Bogotá.",
                link: "/login",
              },
              {
                img: "/imagenes/plan.jpg",
                title: "Crea tu propio plan",
                text: "Personaliza tu viaje con nuestro servicio de planificación.",
                link: "/login",
              },
            ].map((service, index) => (
              <div className="card" key={index}>
                <img src={service.img} alt={service.title} className="card-img" />
                <div className="card-body">
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                  <Link to={service.link} className="btn">Leer Más</Link>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section id="contacto" className="contact">
          <h2>Contáctanos</h2>
          <p>Si tienes alguna pregunta o necesitas más información, no dudes en ponerte en contacto con nosotros.</p>
          <form onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nombre:</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico:</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="message">Mensaje:</label>
              <textarea id="message" name="message" rows="4" required></textarea>
            </div>
            <button type="submit" className="btn">Enviar</button>
          </form>
        </section>
      </main>

      <footer>
        <p>&copy; 2024 Turismo en Bogotá. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default Index;