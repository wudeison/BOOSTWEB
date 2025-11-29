import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./RegistroPerfilCliente.css";
import API_URL from "../config";

const RegistroPerfilCliente = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    idCliente: "",
    nombre: "",
    correo: "",
    contrasena: "",
    tipoUsuario: "cliente",
    fotoPerfil: "",
    telefono: "",
    ciudad: "",
    direccion: "",
    fechaNacimiento: "",
    ocupacion: "",
    bio: "",
    preferencias: "",
    metodoPagoPreferido: "",
    recibeNewsletter: false,
  });

  

  useEffect(() => {
    // Prefill con datos del login si vienen (compatibilidad con 'cliente' y 'usuario')
    const stateCliente = location.state?.cliente || location.state?.usuario;
    if (stateCliente) {
      // Convertir fecha ISO a formato YYYY-MM-DD para input date
      let fechaFormateada = "";
      if (stateCliente.fechaNacimiento) {
        fechaFormateada = stateCliente.fechaNacimiento.split('T')[0];
      }
      
      // Manejar preferencias: si es objeto JSON, extraer el valor
      let preferenciasVal = "";
      if (stateCliente.preferencias) {
        if (typeof stateCliente.preferencias === 'object') {
          preferenciasVal = stateCliente.preferencias.value || "";
        } else {
          preferenciasVal = stateCliente.preferencias;
        }
      }
      
      setFormData((f) => ({
        ...f,
        idCliente: stateCliente.idUsuario || stateCliente.id || "",
        tipoUsuario: stateCliente.tipoUsuario || "cliente",
        nombre: stateCliente.nombre || "",
        correo: stateCliente.correo || "",
        fotoPerfil: stateCliente.fotoPerfil || "",
        telefono: stateCliente.telefono || "",
        ciudad: stateCliente.ciudad || "",
        direccion: stateCliente.direccion || "",
        fechaNacimiento: fechaFormateada,
        ocupacion: stateCliente.ocupacion || "",
        bio: stateCliente.bio || "",
        preferencias: preferenciasVal,
        metodoPagoPreferido: stateCliente.metodoPagoPreferido || "",
        recibeNewsletter: stateCliente.recibeNewsletter || false,
      }));
      return;
    }

    const storedRaw = localStorage.getItem("cliente") || localStorage.getItem("usuario");
    if (storedRaw) {
      try {
        const u = JSON.parse(storedRaw);
        
        // Convertir fecha ISO a formato YYYY-MM-DD
        let fechaFormateada = "";
        if (u.fechaNacimiento) {
          fechaFormateada = u.fechaNacimiento.split('T')[0];
        }
        
        // Manejar preferencias: si es objeto JSON, extraer el valor
        let preferenciasVal = "";
        if (u.preferencias) {
          if (typeof u.preferencias === 'object') {
            preferenciasVal = u.preferencias.value || "";
          } else {
            preferenciasVal = u.preferencias;
          }
        }
        
        setFormData((f) => ({ 
          ...f, 
          idCliente: u.idUsuario || u.id || "", 
          tipoUsuario: u.tipoUsuario || "cliente", 
          nombre: u.nombre || "",
          correo: u.correo || "",
          fotoPerfil: u.fotoPerfil || "",
          telefono: u.telefono || "",
          ciudad: u.ciudad || "",
          direccion: u.direccion || "",
          fechaNacimiento: fechaFormateada,
          ocupacion: u.ocupacion || "",
          bio: u.bio || "",
          preferencias: preferenciasVal,
          metodoPagoPreferido: u.metodoPagoPreferido || "",
          recibeNewsletter: u.recibeNewsletter || false,
        }));
      } catch (e) {}
    }
  }, [location.state]);

  // Avatars: cargar todos los avatares disponibles
  const [avatars, setAvatars] = useState([]);

  useEffect(() => {
    // Cargar avatares disponibles directamente
    const avatarFiles = [
      { name: 'avatar1.jpg', path: require('../assets/clienteavatar/avatar1.jpg') },
      { name: 'avatar2.jpg', path: require('../assets/clienteavatar/avatar2.jpg') },
      { name: 'avatar3.avif', path: require('../assets/clienteavatar/avatar3.avif') },
      { name: 'avatar4.jpg', path: require('../assets/clienteavatar/avatar4.jpg') },
      { name: 'avatar5.png', path: require('../assets/clienteavatar/avatar5.png') },
      { name: 'avatar6.avif', path: require('../assets/clienteavatar/avatar6.avif') },
    ];
    setAvatars(avatarFiles.map(a => a.path));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') return setFormData({ ...formData, [name]: !!checked });
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectAvatar = (src) => {
    setFormData(f => ({ ...f, fotoPerfil: src }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.idCliente) return alert("ID de cliente faltante");
    if (!formData.nombre || !formData.correo) return alert("Completa los campos obligatorios (nombre, correo)");

    // preparar preferencias: si es JSON válido, enviar como objeto; si no, enviar como string
    let preferenciasToSend = null;
    if (formData.preferencias) {
      try { preferenciasToSend = JSON.parse(formData.preferencias); } catch (e) { preferenciasToSend = formData.preferencias; }
    }

    const payload = {
      idUsuario: formData.idCliente,
      nombre: formData.nombre,
      correo: formData.correo,
      contrasena: null, // no manejamos contraseña en este flujo
      tipoUsuario: formData.tipoUsuario,
      telefono: formData.telefono || null,
      ciudad: formData.ciudad || null,
      direccion: formData.direccion || null,
      fechaNacimiento: formData.fechaNacimiento || null,
      ocupacion: formData.ocupacion || null,
      fotoPerfil: formData.fotoPerfil || null,
      bio: formData.bio || null,
      preferencias: preferenciasToSend,
      metodoPagoPreferido: formData.metodoPagoPreferido || null,
      recibeNewsletter: formData.recibeNewsletter ? 1 : 0,
    };

    try {
      const res = await fetch(`${API_URL}/api/registroperfilcliente`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        alert("❌ " + (data?.mensaje || `Error ${res.status}`));
        return;
      }

      alert("✅ Perfil guardado correctamente");

      const clienteActualizado = data.cliente || { 
        idUsuario: formData.idCliente, 
        nombre: formData.nombre, 
        tipoUsuario: formData.tipoUsuario,
        correo: formData.correo,
        telefono: formData.telefono,
        ciudad: formData.ciudad,
        direccion: formData.direccion,
        ocupacion: formData.ocupacion,
        fotoPerfil: formData.fotoPerfil,
        bio: formData.bio,
        fechaNacimiento: formData.fechaNacimiento
      };
      localStorage.setItem("cliente", JSON.stringify(clienteActualizado));

      // Navegar a la vista de bienvenida del cliente
      navigate("/bienvecliente", { state: { cliente: clienteActualizado } });
    } catch (err) {
      console.error("Fetch error:", err);
      alert("❌ Error al conectar con el servidor: " + err.message);
    }
  };

  return (
    <section className="perfil-overlay" role="dialog" aria-labelledby="registro-title">
      <article className="perfil-container">
        <div className="perfil-header">
          <h2>Completa tu Perfil de Cliente</h2>
          <p>Ingresa tu información para personalizar tu experiencia</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="avatar-section">
            <label className="avatar-title">Elige tu avatar (opcional)</label>
            <div className="avatar-gallery">
              {avatars.map((avatarSrc, index) => {
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
                <label htmlFor="nombre">Nombre completo *</label>
                <input type="text" id="nombre" name="nombre" placeholder="Tu nombre completo" value={formData.nombre} onChange={handleChange} required />
              </div>

              <div className="form-field">
                <label htmlFor="correo">Correo electrónico *</label>
                <input type="email" id="correo" name="correo" placeholder="tu@email.com" value={formData.correo} onChange={handleChange} required />
              </div>

              <div className="form-field">
                <label htmlFor="telefono">Teléfono</label>
                <input type="tel" id="telefono" name="telefono" placeholder="Ej: 3001234567" value={formData.telefono} onChange={handleChange} />
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
};

export default RegistroPerfilCliente;
