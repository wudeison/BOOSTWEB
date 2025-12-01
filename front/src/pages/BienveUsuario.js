import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BienveUsuario.css";

const BienveUsuario = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const usuario = useMemo(() => {
    // Prioridad: estado de navegación → localStorage "usuario" → localStorage "cliente"
    const fromState = location.state?.usuario || location.state?.cliente || null;
    if (fromState) return fromState;
    try {
      const u1 = JSON.parse(localStorage.getItem("usuario") || "null");
      if (u1) return u1;
    } catch {}
    try {
      const u2 = JSON.parse(localStorage.getItem("cliente") || "null");
      if (u2) return u2;
    } catch {}
    return null;
  }, [location.state]);

  return (
    <div className="bienve-container">
      <div className="bienve-card">
        {usuario?.fotoPerfil ? (
          <img className="bienve-avatar" src={usuario.fotoPerfil} alt="avatar" />
        ) : null}

        <h1 className="bienve-titulo">Bienvenido {usuario?.nombre || ""}</h1>

        <div className="bienve-grid">
          {usuario?.correo && (<div><strong>Correo:</strong> {usuario.correo}</div>)}
          {usuario?.tipoUsuario && (<div><strong>Tipo:</strong> {usuario.tipoUsuario}</div>)}
          {usuario?.ciudad && (<div><strong>Ciudad:</strong> {usuario.ciudad}</div>)}
          {usuario?.telefono && (<div><strong>Teléfono:</strong> {usuario.telefono}</div>)}
          {usuario?.direccion && (<div><strong>Dirección:</strong> {usuario.direccion}</div>)}
          {usuario?.ocupacion && (<div><strong>Ocupación:</strong> {usuario.ocupacion}</div>)}
        </div>

        {usuario?.bio && (
          <p className="bienve-texto">{usuario.bio}</p>
        )}

        <div className="bienve-actions">
          <button className="btn-atras" onClick={() => navigate("/")}>Atrás</button>
        </div>
      </div>
    </div>
  );
};

export default BienveUsuario;
