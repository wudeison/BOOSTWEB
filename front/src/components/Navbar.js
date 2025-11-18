import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/logo.PNG";
import RegistroForm from "./RegistroForm";
import LoginForm from "./LoginForm";

const Navbar = () => {
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [mostrarLogin, setMostrarLogin] = useState(false);

  // Cuando el registro sea exitoso
  const handleRegistroExitoso = () => {
    alert("✅ Registro exitoso. Ahora puedes iniciar sesión.");
    setMostrarRegistro(false);
    setMostrarLogin(true);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Boost logo" className="logo-img" />
      </div>

      <ul className="navbar-links">
        <li>
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active-link" : "")}>
            Inicio
          </NavLink>
        </li>
        <li>
          <NavLink to="/servicios" className={({ isActive }) => (isActive ? "active-link" : "")}>
            Servicios
          </NavLink>
        </li>
        <li>
          <NavLink to="/especialidades" className={({ isActive }) => (isActive ? "active-link" : "")}>
            Especialidades
          </NavLink>
        </li>
        <li>
          <NavLink to="/contacto" className={({ isActive }) => (isActive ? "active-link" : "")}>
            Contacto
          </NavLink>
        </li>
      </ul>

      <div className="navbar-buttons">
        <button className="btn" onClick={() => setMostrarLogin(true)}>Acceder</button>
        <button className="btn" onClick={() => setMostrarRegistro(true)}>Registrarse</button>
      </div>

      {mostrarRegistro && (
        <RegistroForm
          onClose={() => setMostrarRegistro(false)}
          onRegistroExitoso={handleRegistroExitoso}
        />
      )}

      {mostrarLogin && (
        <LoginForm onClose={() => setMostrarLogin(false)} />
      )}
    </nav>
  );
};

export default Navbar;
