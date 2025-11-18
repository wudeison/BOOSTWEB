import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";

function LoginForm({ onLoginExitoso, onClose }) {
  const [loginData, setLoginData] = useState({
    idUsuario: "",
    contrasena: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      idUsuario: loginData.idUsuario,
      contrasena: loginData.contrasena,
    };

    try {
      const res = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert("❌ " + data.mensaje);
        return;
      }

      onLoginExitoso && onLoginExitoso(data.usuario);
      onClose && onClose();

      setTimeout(() => {
        navigate("/bienvenido", { state: { usuario: data.usuario } });
      }, 300);

    } catch (error) {
      alert("❌ Error al conectar con el servidor");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div>
            <label>ID Usuario:</label>
            <input
              type="text"
              name="idUsuario"
              value={loginData.idUsuario}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Contraseña:</label>
            <input
              type="password"
              name="contrasena"
              value={loginData.contrasena}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-buttons">
            <button type="submit">Acceder</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
