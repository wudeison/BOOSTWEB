import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";
import API_URL from "../config"; // Importa la URL general

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
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert("❌ " + data.mensaje);
        return;
      }

      onLoginExitoso && onLoginExitoso(data.cliente);
      onClose && onClose();

      const cliente = data.cliente || {};
      
      // Guardar en localStorage según tipo de usuario
      try {
        if (cliente.tipoUsuario === "profesional") {
          localStorage.setItem('profesional', JSON.stringify(cliente));
          localStorage.setItem('usuario', JSON.stringify(cliente));
        } else {
          localStorage.setItem('cliente', JSON.stringify(cliente));
          localStorage.setItem('usuario', JSON.stringify(cliente));
        }
      } catch (e) {}

      // Validar si el perfil está completo verificando campos clave
      if (cliente.tipoUsuario === "cliente") {
        const perfilCompleto = cliente.nombre && 
                              cliente.correo && 
                              cliente.telefono && 
                              cliente.ciudad;

        if (perfilCompleto) {
          // Cliente con perfil completo -> ir a BienveCliente
          navigate("/bienvecliente", { state: { cliente } });
        } else {
          // Cliente con perfil incompleto -> completar perfil
          navigate("/registroperfilcliente", { state: { cliente } });
        }
      } else if (cliente.tipoUsuario === "profesional") {
        // Validar perfil profesional (necesita nombre, profesión)
        const perfilCompleto = cliente.nombreCompleto && cliente.profesion;

        if (perfilCompleto) {
          // Profesional con perfil completo -> ir a BienveProfesional
          navigate("/bienveprofesional", { state: { profesional: cliente } });
        } else {
          // Profesional con perfil incompleto -> completar perfil
          navigate("/registroperfilprofesional", { state: { profesional: cliente } });
        }
      } else {
        // Tipo de usuario desconocido -> formulario de registro
        navigate("/registroperfilcliente", { state: { cliente } });
      }

    } catch (error) {
      alert("❌ Error al conectar con el servidor");
    }
  };

  return (
    <section className="modal-overlay" onClick={onClose}>
      <article className="modal-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <h2>Acceso al sistema</h2>

          <label>
            ID Cliente:
            <input
              type="text"
              name="idUsuario"
              value={loginData.idUsuario}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Contraseña:
            <input
              type="password"
              name="contrasena"
              value={loginData.contrasena}
              onChange={handleChange}
              required
            />
          </label>

          <div className="form-buttons">
            <button type="submit">Acceder</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </article>
    </section>
  );
}

export default LoginForm;