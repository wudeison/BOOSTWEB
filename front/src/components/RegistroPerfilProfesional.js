import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./RegistroPerfilProfesional.css";
import API_URL from "../config";

const RegistroPerfilProfesional = () => {
  const location = useLocation();
    // Función para parsear la fecha al formato yyyy-MM-dd
    const parseFecha = (fecha) => {
      if (!fecha) return "";
      if (fecha.includes("T")) return fecha.split("T")[0];
      if (fecha.includes("-")) return fecha;
      return "";
    };
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombreCompleto: "",
    profesion: "",
    experiencia: "",
    correo: "",
    telefono: "",
    ciudad: "",
    direccion: "",
    fechaNacimiento: "",
    fotoPerfil: "",
    bio: "",
    idiomas: { espanol: false, ingles: false, otros: "" },
    habilidadesBlandas: {
      liderazgo: false,
      comunicacion: false,
      trabajoEnEquipo: false,
      resolucionProblemas: false,
    },
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
    // Priorizar datos desde location.state
    let fecha = "";
    if (location.state?.profesional && location.state.profesional.fechaNacimiento) {
      fecha = parseFecha(location.state.profesional.fechaNacimiento);
      setFormData({
        ...formData,
        ...location.state.profesional,
        fechaNacimiento: fecha,
        idiomas: location.state.profesional.idiomas || formData.idiomas,
        habilidadesBlandas: location.state.profesional.habilidadesBlandas || formData.habilidadesBlandas,
      });
      return;
    }
    // Si no hay datos en state, intentar desde localStorage
    try {
      const stored = localStorage.getItem("profesional");
      if (stored) {
        const parsed = JSON.parse(stored);
        fecha = parsed.fechaNacimiento ? parseFecha(parsed.fechaNacimiento) : "";
        setFormData({
          ...formData,
          ...parsed,
          fechaNacimiento: fecha,
          idiomas: parsed.idiomas || formData.idiomas,
          habilidadesBlandas: parsed.habilidadesBlandas || formData.habilidadesBlandas,
        });
      }
    } catch (e) {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSelectAvatar = (src) => {
    setFormData((prevData) => ({
      ...prevData,
      fotoPerfil: src
    }));
  };

  const handleIdiomaChange = (idioma, valor) => {
    setFormData((prevData) => ({
      ...prevData,
      idiomas: {
        ...prevData.idiomas,
        [idioma]: valor
      }
    }));
  };

  const handleCheckboxChange = (categoria, habilidad) => {
    setFormData((prevData) => ({
      ...prevData,
      [categoria]: {
        ...prevData[categoria],
        [habilidad]: !prevData[categoria][habilidad]
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        idUsuario: formData.idUsuario || formData.idCliente,
        fechaNacimiento: formData.fechaNacimiento + "T00:00:00"
      };
      const res = await fetch(`${API_URL}/api/registroperfilprofesional`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        alert("❌ " + (data?.mensaje || `Error ${res.status}`));
        return;
      }

      alert("✅ Perfil profesional guardado correctamente");

      // Guardar en localStorage - usar TODOS los datos del backend
      const profesionalActualizado = data.profesional || payload;
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
        <form onSubmit={handleSubmit}>
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
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="nombreCompleto">Nombre completo *</label>
                <input type="text" id="nombreCompleto" name="nombreCompleto" placeholder="Ingresa tu nombre completo" value={formData.nombreCompleto} onChange={handleChange} required />
              </div>
              <div className="form-field">
                <label htmlFor="profesion">Profesión *</label>
                <select id="profesion" name="profesion" value={formData.profesion} onChange={handleChange} required>
                  <option value="">Selecciona tu profesión</option>
                  <option value="Salud Mental">Salud Mental</option>
                  <option value="Asesoría financiera">Asesoría financiera</option>
                  <option value="Orientación académica">Orientación académica</option>
                  <option value="Asesoría Jurídica">Asesoría Jurídica</option>
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="experiencia">Años de experiencia</label>
                <input type="number" id="experiencia" name="experiencia" placeholder="Años" value={formData.experiencia} onChange={handleChange} min="0" />
              </div>
              <div className="form-field">
                <label htmlFor="correo">Correo electrónico</label>
                <input type="email" id="correo" name="correo" placeholder="correo@ejemplo.com" value={formData.correo} onChange={handleChange} />
              </div>
              <div className="form-field">
                <label htmlFor="telefono">Teléfono</label>
                <input type="tel" id="telefono" name="telefono" placeholder="Teléfono de contacto" value={formData.telefono} onChange={handleChange} />
              </div>
              <div className="form-field">
                <label htmlFor="ciudad">Ciudad</label>
                <input type="text" id="ciudad" name="ciudad" placeholder="Ciudad" value={formData.ciudad} onChange={handleChange} />
              </div>
              <div className="form-field">
                <label htmlFor="direccion">Dirección</label>
                <input type="text" id="direccion" name="direccion" placeholder="Dirección" value={formData.direccion} onChange={handleChange} />
              </div>
              <div className="form-field">
                <label htmlFor="fechaNacimiento">Fecha de nacimiento</label>
                <input type="date" id="fechaNacimiento" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} />
              </div>
              {/* Idiomas */}
              <div className="form-field">
                <label>Idiomas</label>
                <div className="checkbox-group">
                  <div className="checkbox-field">
                    <input type="checkbox" checked={formData.idiomas.espanol} onChange={(e) => handleIdiomaChange("espanol", e.target.checked)} />
                    <span>Español</span>
                  </div>
                  <div className="checkbox-field">
                    <input type="checkbox" checked={formData.idiomas.ingles} onChange={(e) => handleIdiomaChange("ingles", e.target.checked)} />
                    <span>Inglés</span>
                  </div>
                </div>
                <input type="text" placeholder="Otros idiomas" value={formData.idiomas.otros} onChange={(e) => handleIdiomaChange("otros", e.target.value)} style={{ marginTop: '10px', maxWidth: '250px' }} />
              </div>
              {/* Habilidades blandas */}
              <div className="form-field habilidades-field">
                <label>Habilidades blandas</label>
                <div className="checkbox-group">
                  <div className="checkbox-field">
                    <input type="checkbox" checked={formData.habilidadesBlandas.liderazgo} onChange={() => handleCheckboxChange("habilidadesBlandas", "liderazgo")} />
                    <span>Liderazgo</span>
                  </div>
                  <div className="checkbox-field">
                    <input type="checkbox" checked={formData.habilidadesBlandas.comunicacion} onChange={() => handleCheckboxChange("habilidadesBlandas", "comunicacion")} />
                    <span>Comunicación</span>
                  </div>
                  <div className="checkbox-field">
                    <input type="checkbox" checked={formData.habilidadesBlandas.trabajoEnEquipo} onChange={() => handleCheckboxChange("habilidadesBlandas", "trabajoEnEquipo")} />
                    <span>Trabajo en equipo</span>
                  </div>
                  <div className="checkbox-field">
                    <input type="checkbox" checked={formData.habilidadesBlandas.resolucionProblemas} onChange={() => handleCheckboxChange("habilidadesBlandas", "resolucionProblemas")} />
                    <span>Resolución de problemas</span>
                  </div>
                </div>
              </div>
              {/* Bio */}
              <div className="form-field full-width">
                <label htmlFor="bio">Biografía / Descripción profesional</label>
                <textarea id="bio" name="bio" placeholder="Cuéntanos sobre tu experiencia, especialización y enfoque profesional..." value={formData.bio} onChange={handleChange} rows={4} />
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

export default RegistroPerfilProfesional;
