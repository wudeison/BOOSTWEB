import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./RegistroPerfilProfesional.css";
import API_URL from "../config";

const RegistroPerfilProfesional = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    idUsuario: "",
    nombreCompleto: "",
    profesion: "",
    experiencia: "",
    habilidadesBlandas: {
      liderazgo: false,
      comunicacion: false,
      trabajoEnEquipo: false,
      resolucionProblemas: false,
    },
    idiomas: {
      espanol: false,
      ingles: false,
      otros: "",
    },
    fotoPerfil: "",
    bio: "",
    correo: "",
    telefono: "",
    ciudad: "",
    direccion: "",
    fechaNacimiento: "",
  });

  useEffect(() => {
    // Prefill con datos del profesional si vienen
    const stateProfesional = location.state?.profesional || location.state?.usuario;
    if (stateProfesional) {
      setFormData((f) => ({
        ...f,
        idUsuario: stateProfesional.idUsuario || "",
        nombreCompleto: stateProfesional.nombreCompleto || stateProfesional.nombre || "",
        profesion: stateProfesional.profesion || "",
        experiencia: stateProfesional.experiencia || "",
        habilidadesBlandas: stateProfesional.habilidadesBlandas || f.habilidadesBlandas,
        idiomas: stateProfesional.idiomas || f.idiomas,
        fotoPerfil: stateProfesional.fotoPerfil || "",
        bio: stateProfesional.bio || "",
        correo: stateProfesional.correo || "",
        telefono: stateProfesional.telefono || "",
        ciudad: stateProfesional.ciudad || "",
        direccion: stateProfesional.direccion || "",
        fechaNacimiento: stateProfesional.fechaNacimiento ? stateProfesional.fechaNacimiento.split('T')[0] : "",
      }));
      return;
    }

    const storedRaw = localStorage.getItem("profesional") || localStorage.getItem("usuario");
    if (storedRaw) {
      try {
        const u = JSON.parse(storedRaw);
        setFormData((f) => ({
          ...f,
          idUsuario: u.idUsuario || "",
          nombreCompleto: u.nombreCompleto || u.nombre || "",
          profesion: u.profesion || "",
          experiencia: u.experiencia || "",
          habilidadesBlandas: u.habilidadesBlandas || f.habilidadesBlandas,
          idiomas: u.idiomas || f.idiomas,
          fotoPerfil: u.fotoPerfil || "",
          bio: u.bio || "",
          correo: u.correo || "",
          telefono: u.telefono || "",
          ciudad: u.ciudad || "",
          direccion: u.direccion || "",
          fechaNacimiento: u.fechaNacimiento ? u.fechaNacimiento.split('T')[0] : "",
        }));
      } catch (e) {}
    }
  }, [location.state]);

  // Avatars: cargar todos los avatares disponibles desde profesionalavatar
  const avatars = [
    require("../assets/profesionalavatar/avatar1.png"),
    require("../assets/profesionalavatar/avatar2.png"),
    require("../assets/profesionalavatar/avatar3.avif"),
    require("../assets/profesionalavatar/avatar4.avif"),
  ];

  const handleSelectAvatar = (src) => {
    // Convertir a string si es objeto de webpack
    const avatarPath = typeof src === 'string' ? src : src.default || src;
    setFormData((f) => ({ ...f, fotoPerfil: avatarPath }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (group, name) => {
    setFormData((f) => ({
      ...f,
      [group]: {
        ...f[group],
        [name]: !f[group][name],
      },
    }));
  };

  const handleIdiomaChange = (name, value) => {
    setFormData((f) => ({
      ...f,
      idiomas: {
        ...f.idiomas,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.idUsuario) return alert("ID de usuario faltante");
    if (!formData.nombreCompleto) return alert("El nombre completo es obligatorio");
    if (!formData.profesion) return alert("La profesión es obligatoria");

    const payload = {
      idUsuario: formData.idUsuario,
      nombreCompleto: formData.nombreCompleto,
      profesion: formData.profesion,
      experiencia: parseInt(formData.experiencia) || 0,
      habilidadesBlandas: formData.habilidadesBlandas,
      idiomas: formData.idiomas,
      fotoPerfil: formData.fotoPerfil || null,
      bio: formData.bio || null,
      correo: formData.correo || null,
      telefono: formData.telefono || null,
      ciudad: formData.ciudad || null,
      direccion: formData.direccion || null,
      fechaNacimiento: formData.fechaNacimiento || null,
    };

    try {
      const res = await fetch(`${API_URL}/api/registroperfilprofesional`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        alert("❌ " + (data?.mensaje || `Error ${res.status}`));
        return;
      }

      alert("✅ Perfil profesional guardado correctamente");

      // Guardar en localStorage - usar TODOS los datos del backend
      const profesionalActualizado = data.profesional;
      
      try {
        localStorage.setItem("profesional", JSON.stringify(profesionalActualizado));
        localStorage.setItem("usuario", JSON.stringify(profesionalActualizado));
      } catch (e) {
        console.error("❌ Error guardando en localStorage:", e);
      }

      // Navegar con timestamp para forzar actualización
      navigate("/bienveprofesional", { 
        state: { 
          profesional: profesionalActualizado,
          timestamp: Date.now()
        },
        replace: true
      });
    } catch (err) {
      console.error("Fetch error:", err);
      alert("❌ Error al conectar con el servidor: " + err.message);
    }
  };

  return (
    <section className="perfil-overlay">
      <article className="perfil-container">
        <div className="perfil-header">
          <h2>Completa tu Perfil Profesional</h2>
          <p>Ingresa tu información para destacar tus servicios</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Selección de avatar */}
          <div className="avatar-section">
            <label className="avatar-title">Elige tu foto de perfil</label>
            <div className="avatar-gallery">
              {avatars.map((avatar, index) => {
                const src = typeof avatar === "string" ? avatar : avatar.default || avatar;
                const isSelected = formData.fotoPerfil === src;
                return (
                  <img
                    key={index}
                    src={src}
                    alt={`Avatar ${index + 1}`}
                    onClick={() => handleSelectAvatar(src)}
                    className={`avatar-item ${isSelected ? "selected" : ""}`}
                  />
                );
              })}
            </div>
          </div>

          <div className="perfil-form">
            {/* Grid de campos */}
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="nombreCompleto">Nombre completo *</label>
                <input
                  type="text"
                  id="nombreCompleto"
                  name="nombreCompleto"
                  placeholder="Ingresa tu nombre completo"
                  value={formData.nombreCompleto}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="profesion">Profesión *</label>
                <select
                  id="profesion"
                  name="profesion"
                  value={formData.profesion}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona tu profesión</option>
                  <option value="Salud Mental">Salud Mental</option>
                  <option value="Asesoría financiera">Asesoría financiera</option>
                  <option value="Orientación académica">Orientación académica</option>
                  <option value="Asesoría Jurídica">Asesoría Jurídica</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="experiencia">Años de experiencia</label>
                <input
                  type="number"
                  id="experiencia"
                  name="experiencia"
                  placeholder="Años"
                  value={formData.experiencia}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              <div className="form-field">
                <label htmlFor="correo">Correo electrónico</label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  placeholder="correo@ejemplo.com"
                  value={formData.correo}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label htmlFor="telefono">Teléfono</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  placeholder="Teléfono de contacto"
                  value={formData.telefono}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label htmlFor="ciudad">Ciudad</label>
                <input
                  type="text"
                  id="ciudad"
                  name="ciudad"
                  placeholder="Ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label htmlFor="direccion">Dirección</label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  placeholder="Dirección"
                  value={formData.direccion}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label htmlFor="fechaNacimiento">Fecha de nacimiento</label>
                <input
                  type="date"
                  id="fechaNacimiento"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                />
              </div>

              {/* Idiomas */}
              <div className="form-field">
                <label>Idiomas</label>
                <div className="checkbox-group">
                  <div className="checkbox-field">
                    <input
                      type="checkbox"
                      checked={formData.idiomas.espanol}
                      onChange={(e) => handleIdiomaChange("espanol", e.target.checked)}
                    />
                    <span>Español</span>
                  </div>
                  <div className="checkbox-field">
                    <input
                      type="checkbox"
                      checked={formData.idiomas.ingles}
                      onChange={(e) => handleIdiomaChange("ingles", e.target.checked)}
                    />
                    <span>Inglés</span>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Otros idiomas"
                  value={formData.idiomas.otros}
                  onChange={(e) => handleIdiomaChange("otros", e.target.value)}
                  style={{ marginTop: '10px', maxWidth: '250px' }}
                />
              </div>

              {/* Habilidades blandas */}
              <div className="form-field habilidades-field">
                <label>Habilidades blandas</label>
                <div className="checkbox-group">
                  <div className="checkbox-field">
                    <input
                      type="checkbox"
                      checked={formData.habilidadesBlandas.liderazgo}
                      onChange={() => handleCheckboxChange("habilidadesBlandas", "liderazgo")}
                    />
                    <span>Liderazgo</span>
                  </div>
                  <div className="checkbox-field">
                    <input
                      type="checkbox"
                      checked={formData.habilidadesBlandas.comunicacion}
                      onChange={() => handleCheckboxChange("habilidadesBlandas", "comunicacion")}
                    />
                    <span>Comunicación</span>
                  </div>
                  <div className="checkbox-field">
                    <input
                      type="checkbox"
                      checked={formData.habilidadesBlandas.trabajoEnEquipo}
                      onChange={() => handleCheckboxChange("habilidadesBlandas", "trabajoEnEquipo")}
                    />
                    <span>Trabajo en equipo</span>
                  </div>
                  <div className="checkbox-field">
                    <input
                      type="checkbox"
                      checked={formData.habilidadesBlandas.resolucionProblemas}
                      onChange={() => handleCheckboxChange("habilidadesBlandas", "resolucionProblemas")}
                    />
                    <span>Resolución de problemas</span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="form-field full-width">
                <label htmlFor="bio">Biografía / Descripción profesional</label>
                <textarea
                  id="bio"
                  name="bio"
                  placeholder="Cuéntanos sobre tu experiencia, especialización y enfoque profesional..."
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              Guardar perfil
            </button>
            <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
              Cancelar
            </button>
          </div>
        </form>
      </article>
    </section>
  );
};

export default RegistroPerfilProfesional;
