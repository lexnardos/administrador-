
import React from "react";
import LoginForm from "../components/loginform";
import RegisterForm from "../components/registerform";

function Login() {
  return (
    <div className="container">
      <LoginForm />
      <RegisterForm />
    </div>
  );
}

export default Login;
