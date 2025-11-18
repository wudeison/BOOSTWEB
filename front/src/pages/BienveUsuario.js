import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BienveUsuario.css"; // Importar el diseño separado

const BienveUsuario = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const usuario = location.state?.usuario;

  return (
    <div className="bienve-container">
      <h1 className="bienve-titulo">
        Bienvenido {usuario?.nombre || ""}
      </h1>

      <p className="bienve-texto">
        En el momento estamos trabajando en este sitio, ¡gracias por visitarnos!
      </p>

      <button className="btn-atras" onClick={() => navigate("/")}>
        Atrás
      </button>
    </div>
  );
};

export default BienveUsuario;
