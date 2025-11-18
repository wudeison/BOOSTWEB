import React, { useState } from "react";
import "./RegistroForm.css";

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
      const res = await fetch("http://localhost:4000/api/registro", {
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
    <div className="modal-overlay">
      <div className="modal-content">
        <form onSubmit={handleSubmit}>
          <div className="form-scroll">
            <label>Número de cédula:</label>
            <input
              type="text"
              name="idUsuario"
              placeholder="Ingresa tu número de cédula"
              value={formData.idUsuario}
              onChange={handleChange}
              required
            />

            <label>Nombre completo:</label>
            <input
              type="text"
              name="nombre"
              placeholder="Ingresa tu nombre completo"
              value={formData.nombre}
              onChange={handleChange}
              required
            />

            <label>Correo electrónico:</label>
            <input
              type="email"
              name="correo"
              placeholder="Ingresa tu correo electrónico"
              value={formData.correo}
              onChange={handleChange}
              required
            />

            <label>Contraseña:</label>
            <input
              type="password"
              name="contraseña"
              placeholder="Crea una contraseña"
              value={formData.contraseña}
              onChange={handleChange}
              required
            />

            <label>Confirmar contraseña:</label>
            <input
              type="password"
              name="confirmar"
              placeholder="Repite tu contraseña"
              value={formData.confirmar}
              onChange={handleChange}
              required
            />

            <label>Tipo de usuario:</label>
            <select
              name="tipoUsuario"
              value={formData.tipoUsuario}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione tipo de usuario...</option>
              <option value="profesional">Profesional</option>
              <option value="cliente">Cliente</option>
            </select>
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-submit">
              Registrarse
            </button>
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistroForm;

