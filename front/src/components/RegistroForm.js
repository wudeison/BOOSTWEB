import React, { useState } from "react";
import "./RegistroForm.css";
import API_URL from "../config"; // Importa la URL general

const RegistroForm = ({ onClose, onRegistroExitoso }) => {
  const [formData, setFormData] = useState({
    idUsuario: "",
    nombre: "",
    correo: "",
    contraseña: "",
    confirmar: "",
    tipoUsuario: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    const soloNumeros = /^[0-9]+$/;
    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!soloNumeros.test(formData.idUsuario)) {
      alert("⚠️ La cédula solo debe contener números.");
      return;
    }
    if (!soloLetras.test(formData.nombre)) {
      alert("⚠️ El nombre solo debe contener letras y espacios.");
      return;
    }
    if (!correoValido.test(formData.correo)) {
      alert("⚠️ Ingresa un correo electrónico válido.");
      return;
    }
    if (formData.contraseña.length < 6) {
      alert("⚠️ La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (formData.contraseña !== formData.confirmar) {
      alert("⚠️ Las contraseñas no coinciden.");
      return;
    }

    const payload = {
      idUsuario: formData.idUsuario,
      nombre: formData.nombre,
      correo: formData.correo,
      contrasena: formData.contraseña,
      tipoUsuario: formData.tipoUsuario,
    };

    try {
      const res = await fetch(`${API_URL}/api/registro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const msg = data?.mensaje || `Error ${res.status}: ${res.statusText}`;
        alert("❌ " + msg);
        console.error("Error backend:", msg);
        return;
      }

      alert("✅ Registro exitoso");
      onRegistroExitoso && onRegistroExitoso();
    } catch (err) {
      console.error("Fetch error:", err);
      alert("❌ Error al conectar con el servidor: " + err.message);
    }
  };

  return (
    <section className="modal-overlay" role="dialog" aria-labelledby="registro-title">
      <article className="modal-content">
        <form onSubmit={handleSubmit}>
          <fieldset className="form-scroll">
            <label htmlFor="idUsuario">Número de cédula:</label>
            <input
              type="text"
              id="idUsuario"
              name="idUsuario"
              placeholder="Ingresa tu número de cédula"
              value={formData.idUsuario}
              onChange={handleChange}
              required
            />

            <label htmlFor="nombre">Nombre completo:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              placeholder="Ingresa tu nombre completo"
              value={formData.nombre}
              onChange={handleChange}
              required
            />

            <label htmlFor="correo">Correo electrónico:</label>
            <input
              type="email"
              id="correo"
              name="correo"
              placeholder="Ingresa tu correo electrónico"
              value={formData.correo}
              onChange={handleChange}
              required
            />

            <label htmlFor="contraseña">Contraseña:</label>
            <input
              type="password"
              id="contraseña"
              name="contraseña"
              placeholder="Crea una contraseña"
              value={formData.contraseña}
              onChange={handleChange}
              required
            />

            <label htmlFor="confirmar">Confirmar contraseña:</label>
            <input
              type="password"
              id="confirmar"
              name="confirmar"
              placeholder="Repite tu contraseña"
              value={formData.confirmar}
              onChange={handleChange}
              required
            />

            <label htmlFor="tipoUsuario">Tipo de usuario:</label>
            <select
              id="tipoUsuario"
              name="tipoUsuario"
              value={formData.tipoUsuario}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione tipo de usuario...</option>
              <option value="profesional">Profesional</option>
              <option value="cliente">Cliente</option>
            </select>
          </fieldset>

          <div className="form-buttons">
            <button type="submit" className="btn-submit">
              Registrarse
            </button>
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </article>
    </section>
  );
};

export default RegistroForm;