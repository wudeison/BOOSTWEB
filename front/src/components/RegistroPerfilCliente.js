import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./RegistroPerfilCliente.css";
import API_URL from "../config";

const RegistroPerfilCliente = () => {
  // const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    idCliente: "",
    nombre: "",
    correo: "",
    telefono: "",
    ciudad: "",
    direccion: "",
    fechaNacimiento: "",
    ocupacion: "",
    preferencias: "",
    metodoPagoPreferido: "",
    bio: "",
    tipoUsuario: "Cliente",
    fotoPerfil: "",
    recibeNewsletter: false,
  });

  const avatars = [
    require("../assets/clienteavatar/avatar1.jpg"),
    require("../assets/clienteavatar/avatar2.jpg"),
    require("../assets/clienteavatar/avatar3.avif"),
    require("../assets/clienteavatar/avatar4.jpg"),
    require("../assets/clienteavatar/avatar5.png"),
    require("../assets/clienteavatar/avatar6.avif")
  ];

  useEffect(() => {
    const clienteGuardado = JSON.parse(localStorage.getItem("cliente"));
    if (clienteGuardado) {
      setFormData(clienteGuardado);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectAvatar = (src) => {
    setFormData((prevData) => ({
      ...prevData,
      fotoPerfil: src,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Adaptar el objeto para enviar idUsuario
      const payload = {
        ...formData,
        idUsuario: formData.idCliente || formData.idUsuario,
      };
      const response = await fetch(`${API_URL}/api/registroperfilcliente`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el perfil");
      }

      const resData = await response.json();
      const clienteActualizado = resData.cliente || payload;
      localStorage.setItem("cliente", JSON.stringify(clienteActualizado));

      navigate("/bienvecliente", { state: { cliente: clienteActualizado } });
    } catch (err) {
      console.error("Fetch error:", err);
      alert("❌ Error al conectar con el servidor: " + err.message);
    }
  };

  return (
    <section className="perfil-overlay" role="dialog" aria-labelledby="registro-title">
      <article className="perfil-container">
        <form onSubmit={handleSubmit}>
          <div className="avatar-section">
            <label className="avatar-title">Elige tu avatar (opcional)</label>
            <div className="avatar-gallery">
              {avatars && avatars.map((avatarSrc, index) => {
                const src = typeof avatarSrc === 'string' ? avatarSrc : avatarSrc?.default || avatarSrc;
                const isSelected = formData.fotoPerfil === src;
                return (
                  <img
                    key={index}
                    src={src}
                    alt={`avatar ${index + 1}`}
                    onClick={() => handleSelectAvatar(src)}
                    className={`avatar-item ${isSelected ? 'selected' : ''}`}
                  />
                );
              })}
            </div>
          </div>
          <div className="perfil-form">
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="nombre">Nombre</label>
                <input type="text" id="nombre" name="nombre" placeholder="Tu nombre" value={formData.nombre} onChange={handleChange} required />
              </div>
              <div className="form-field">
                <label htmlFor="correo">Correo</label>
                <input type="email" id="correo" name="correo" placeholder="Tu correo" value={formData.correo} onChange={handleChange} required />
              </div>
              <div className="form-field">
                <label htmlFor="telefono">Teléfono</label>
                <input type="tel" id="telefono" name="telefono" placeholder="Tu teléfono" value={formData.telefono} onChange={handleChange} />
              </div>
              <div className="form-field">
                <label htmlFor="ciudad">Ciudad</label>
                <input type="text" id="ciudad" name="ciudad" placeholder="Tu ciudad" value={formData.ciudad} onChange={handleChange} />
              </div>
              <div className="form-field">
                <label htmlFor="direccion">Dirección</label>
                <input type="text" id="direccion" name="direccion" placeholder="Tu dirección" value={formData.direccion} onChange={handleChange} />
              </div>
              <div className="form-field">
                <label htmlFor="fechaNacimiento">Fecha de nacimiento</label>
                <input type="date" id="fechaNacimiento" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} />
              </div>
              <div className="form-field">
                <label htmlFor="ocupacion">Ocupación</label>
                <input type="text" id="ocupacion" name="ocupacion" placeholder="Tu ocupación" value={formData.ocupacion} onChange={handleChange} />
              </div>
              <div className="form-field">
                <label htmlFor="preferencias">Horario preferido</label>
                <select id="preferencias" name="preferencias" value={formData.preferencias} onChange={handleChange}>
                  <option value="">Selecciona un horario</option>
                  <option value="mañana">Mañana</option>
                  <option value="tarde">Tarde</option>
                  <option value="noche">Noche</option>
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="metodoPagoPreferido">Método de pago preferido</label>
                <select id="metodoPagoPreferido" name="metodoPagoPreferido" value={formData.metodoPagoPreferido} onChange={handleChange}>
                  <option value="">Selecciona método</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="efectivo">Efectivo</option>
                  <option value="transferencia">Transferencia</option>
                </select>
              </div>
              <div className="form-field full-width">
                <label htmlFor="bio">Observaciones / Bio</label>
                <textarea id="bio" name="bio" placeholder="Información adicional que quieras compartir..." value={formData.bio} onChange={handleChange} rows={3} />
              </div>
              <div className="form-field">
                <label htmlFor="tipoUsuario">Tipo de usuario</label>
                <input type="text" id="tipoUsuario" name="tipoUsuario" value={formData.tipoUsuario} readOnly />
              </div>
              <div className="form-field checkbox-field">
                <input type="checkbox" id="recibeNewsletter" name="recibeNewsletter" checked={!!formData.recibeNewsletter} onChange={handleChange} />
                <label htmlFor="recibeNewsletter">Deseo recibir publicidad</label>
              </div>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">Guardar perfil</button>
            <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>Cancelar</button>
          </div>
        </form>
      </article>
    </section>
  );
}

export default RegistroPerfilCliente;
