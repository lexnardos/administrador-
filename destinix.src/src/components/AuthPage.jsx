import React, { useState } from "react";
import LoginForm from "../components/loginform";
import RegisterForm from "../components/registerform";


const AuthPage = () => {
  const [showLogin, setShowLogin] = useState(true); 

  const toggleForm = () => {
    setShowLogin(!showLogin); 
  };

  return (
    <div className="container">
      <div className="container-form">
        <div className={`form-container ${showLogin ? "show-login" : "show-register"}`}>
          <div className="form">
            {showLogin ? (
              <LoginForm />
            ) : (
              <RegisterForm />
            )}
          </div>
          <div className="form">
            {showLogin ? (
              <RegisterForm />
            ) : (
              <LoginForm />
            )}
          </div>
        </div>
      </div>

      <div className="container-welcome">
        <div className="welcome-sign-up welcome">
          <h3>¡Bienvenido!</h3>
          <p>Ingrese sus datos personales para usar todas las funcionalidades del sitio</p>
          <button className="button" onClick={toggleForm}>Registrarse</button>
        </div>
        <div className="welcome-sign-in welcome">
          <h3>¡Hola!</h3>
          <p>Inicia sesión con tus datos personales</p>
          <button className="button" onClick={toggleForm}>Iniciar Sesión</button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
