import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BienveCliente.css";
import logo from "../assets/logo.PNG";
import API_URL from "../config";

const BienveCliente = () => {
    // Alternar sesiones por fecha: más próxima a la izquierda, siguiente a la derecha
    const getSesionesAlternadas = () => {
      const visibles = sesiones.filter(s => s.estado !== 'cancelada' || s.notificacionPendiente === 1);
      visibles.sort((a, b) => {
        const fechaA = new Date(a.fecha + 'T' + (a.horaInicio || '00:00'));
        const fechaB = new Date(b.fecha + 'T' + (b.horaInicio || '00:00'));
        return fechaA - fechaB;
      });
      const izquierda = [];
      const derecha = [];
      visibles.forEach((sesion, i) => {
        if (i % 2 === 0) izquierda.push(sesion);
        else derecha.push(sesion);
      });
      return { izquierda, derecha };
    };
  const location = useLocation();
  const navigate = useNavigate();

  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sesiones, setSesiones] = useState([]);
  const [loadingSesiones, setLoadingSesiones] = useState(false);

  const cargarSesiones = async () => {
    setLoadingSesiones(true);
    try {
      const response = await fetch(`http://localhost:4000/api/reservas/cliente/${cliente.idUsuario}`);
      const data = await response.json();
      if (response.ok) {
        setSesiones(data.sesiones || []);
      }
    } catch (error) {
      console.error("Error al cargar sesiones:", error);
    } finally {
      setLoadingSesiones(false);
    }
  };

  // Cargar datos del cliente
  useEffect(() => {
    setLoading(true);
    
    // Priorizar state de navegación
    if (location.state?.cliente) {
      setCliente(location.state.cliente);
      setLoading(false);
      return;
    }
    
    // Intentar desde localStorage
    try {
      const stored = localStorage.getItem("cliente");
      if (stored) {
        const parsed = JSON.parse(stored);
        setCliente(parsed);
        setLoading(false);
        return;
      }
    } catch (e) {
      console.error("Error al cargar cliente:", e);
    }
    
    // Si no hay datos, no hay cliente
    setCliente(null);
    setLoading(false);
  }, [location.state]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Cargar sesiones reservadas y refresco automático
  useEffect(() => {
    if (cliente?.idUsuario) {
      cargarSesiones();
      // Refresco automático cada 10 segundos
      const interval = setInterval(() => {
        cargarSesiones();
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [cliente]);

  const formatearFecha = (fecha) => {
    try {
      if (!fecha) return "Fecha no disponible";
      const partes = fecha.split('T')[0].split('-');
      const [year, month, day] = partes;
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      if (isNaN(date.getTime())) return "Fecha inválida";
      return date.toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Fecha inválida";
    }
  };

  const formatearHora = (hora) => {
    return hora?.substring(0, 5) || "";
  };

  const cancelarSesion = async (idSesion) => {
    if (window.confirm("¿Estás seguro de que deseas cancelar esta sesión?")) {
      try {
        const response = await fetch(
          `${API_URL}/api/reservas/cancelar/${idSesion}?canceladoPor=cliente`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          alert("Sesión cancelada exitosamente");
          cargarSesiones();
        } else {
          const data = await response.json();
          alert(`Error: ${data.error}`);
        }
      } catch (error) {
        console.error("Error al cancelar sesión:", error);
        alert("Error al conectar con el servidor");
      }
    }
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  const handleLogout = () => {
    localStorage.removeItem("cliente");
    navigate("/");
  };

  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return null;
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  // Función para aceptar y ocultar la notificación
  const aceptarNotificacion = async (idSesion) => {
    try {
      await fetch(`${API_URL}/api/reservas/notificacion/${idSesion}`, {
        method: "PUT",
      });
      cargarSesiones();
    } catch (error) {
      alert("Error al actualizar la notificación");
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="error-card">
          <h2>Cargando perfil...</h2>
        </div>
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="profile-page">
        <div className="error-card">
          <h2>No hay sesión activa</h2>
          <button onClick={() => navigate("/")} className="btn-home">Ir al inicio</button>
        </div>
      </div>
    );
  }

  return (

    <main className="profile-page">
      {/* Header con gradiente */}
      <header className="profile-header">
        <div className="header-overlay"></div>
        <nav className="header-content">
          <div className="header-main">
            <img src={logo} alt="BOOST Logo" className="header-logo" />
            <div className="welcome-text-left">
              <h1>{getGreeting()}</h1>
              <p className="user-name">{cliente.nombre?.split(' ')[0] || 'Usuario'}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            <span>🚪</span> Cerrar sesión
          </button>
        </nav>

        {/* Sesiones del cliente - Lado izquierdo */}
        <div className="sesiones-lateral sesiones-izquierda">
          <h3 className="sesiones-lateral-titulo">📅 Próximas Sesiones</h3>
          {loadingSesiones ? (
            <div className="loading-sesiones-lateral">
              <p>Cargando...</p>
            </div>
          ) : sesiones.length === 0 ? (
            <div className="sin-sesiones-lateral">
              <p>📭 Sin sesiones</p>
            </div>
          ) : (
            <div className="sesiones-lista">
              {getSesionesAlternadas().izquierda.map((sesion) => (
                <div key={sesion.idSesion} className="sesion-card-lateral">
                  <div className="sesion-fecha-hora">
                    <p className="fecha-texto">{formatearFecha(sesion.fecha)}</p>
                    <p className="hora-texto">{formatearHora(sesion.horaInicio)} - {formatearHora(sesion.horaFin)}</p>
                  </div>
                  <div className="sesion-detalles">
                    <p className="cliente-nombre">👨‍⚕️ {sesion.nombreProfesional}</p>
                    <p className="monto-texto">💰 ${parseFloat(sesion.monto).toLocaleString('es-CO')}</p>
                  </div>
                  <span className={`estado-badge-lateral estado-${sesion.estado}`}>
                    {sesion.estado}
                  </span>
                  {/* Notificación de penalidad en la tarjeta */}
                  {sesion.notificacionPendiente === 1 && (
                    <div className="notificacion-cancelacion">
                      <p>
                        {sesion.canceladoPor === 'cliente' &&
                          `Has cancelado esta sesión. Se devolverá el 70% del valor pagado: $${parseFloat(sesion.montoReembolso).toLocaleString('es-CO')}`}
                        {sesion.canceladoPor === 'profesional' &&
                          `El profesional canceló la sesión. Puedes reagendar con 30% de descuento.`}
                      </p>
                      <button className="btn-aceptar-notificacion" onClick={() => aceptarNotificacion(sesion.idSesion)}>
                        Ocultar notificación
                      </button>
                    </div>
                  )}
                  {sesion.estado !== 'cancelada' && (
                    <button 
                      className="btn-cancelar-sesion btn-cancelar-sesion-bottom" 
                      onClick={() => cancelarSesion(sesion.idSesion)}
                      title="Cancelar sesión"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sesiones del cliente - Lado derecho */}
        <div className="sesiones-lateral sesiones-derecha">
          <h3 className="sesiones-lateral-titulo">📅 Próximas Sesiones</h3>
          {loadingSesiones ? (
            <div className="loading-sesiones-lateral">
              <p>Cargando...</p>
            </div>
          ) : sesiones.length === 0 ? (
            <div className="sin-sesiones-lateral">
              <p>📭 Sin sesiones</p>
            </div>
          ) : (
            <div className="sesiones-lista">
              {getSesionesAlternadas().derecha.map((sesion) => (
                <div key={sesion.idSesion} className="sesion-card-lateral">
                  <div className="sesion-fecha-hora">
                    <p className="fecha-texto">{formatearFecha(sesion.fecha)}</p>
                    <p className="hora-texto">{formatearHora(sesion.horaInicio)} - {formatearHora(sesion.horaFin)}</p>
                  </div>
                  <div className="sesion-detalles">
                    <p className="cliente-nombre">👨‍⚕️ {sesion.nombreProfesional}</p>
                    <p className="monto-texto">💰 ${parseFloat(sesion.monto).toLocaleString('es-CO')}</p>
                  </div>
                  <span className={`estado-badge-lateral estado-${sesion.estado}`}>
                    {sesion.estado}
                  </span>
                  {/* Notificación de penalidad en la tarjeta */}
                  {sesion.notificacionPendiente === 1 && (
                    <div className="notificacion-cancelacion">
                      <p>
                        {sesion.canceladoPor === 'cliente' &&
                          `Has cancelado esta sesión. Se devolverá el 70% del valor pagado: $${parseFloat(sesion.montoReembolso).toLocaleString('es-CO')}`}
                        {sesion.canceladoPor === 'profesional' &&
                          `El profesional canceló la sesión. Puedes reagendar con 30% de descuento.`}
                      </p>
                      <button className="btn-aceptar-notificacion" onClick={() => aceptarNotificacion(sesion.idSesion)}>
                        Ocultar notificación
                      </button>
                    </div>
                  )}
                  {sesion.estado !== 'cancelada' && (
                    <button 
                      className="btn-cancelar-sesion btn-cancelar-sesion-bottom" 
                      onClick={() => cancelarSesion(sesion.idSesion)}
                      title="Cancelar sesión"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Contenedor principal del perfil */}
      <section className="profile-content">
        {/* Card del perfil */}
        <article className="profile-card">
          {/* Avatar */}
          <div className="avatar-container">
            {cliente.fotoPerfil ? (
              <img src={cliente.fotoPerfil} alt="Avatar" className="profile-avatar" />
            ) : (
              <div className="avatar-placeholder">
                <span>{cliente.nombre?.charAt(0) || "U"}</span>
              </div>
            )}
            <div className="status-badge">Activo</div>
          </div>

          {/* Información principal */}
          <div className="profile-main-info">
            <h2 className="profile-name">{cliente.nombre || "Usuario"}</h2>
            <p className="profile-type">{cliente.tipoUsuario === "cliente" ? "👤 Cliente" : "⭐ Profesional"}</p>
          </div>

          {/* Grid de información */}
          <div className="info-grid">
            {cliente.correo && (
              <div className="info-item">
                <span className="info-icon">📧</span>
                <div className="info-text">
                  <label>Correo</label>
                  <p>{cliente.correo}</p>
                </div>
              </div>
            )}

            {cliente.telefono && (
              <div className="info-item">
                <span className="info-icon">📱</span>
                <div className="info-text">
                  <label>Teléfono</label>
                  <p>{cliente.telefono}</p>
                </div>
              </div>
            )}

            {cliente.ciudad && (
              <div className="info-item">
                <span className="info-icon">📍</span>
                <div className="info-text">
                  <label>Ciudad</label>
                  <p>{cliente.ciudad}</p>
                </div>
              </div>
            )}

            {cliente.direccion && (
              <div className="info-item">
                <span className="info-icon">🏠</span>
                <div className="info-text">
                  <label>Dirección</label>
                  <p>{cliente.direccion}</p>
                </div>
              </div>
            )}

            {cliente.ocupacion && (
              <div className="info-item">
                <span className="info-icon">💼</span>
                <div className="info-text">
                  <label>Ocupación</label>
                  <p>{cliente.ocupacion}</p>
                </div>
              </div>
            )}

            {cliente.fechaNacimiento && (() => {
              const edad = calcularEdad(cliente.fechaNacimiento);
              return edad !== null && (
                <div className="info-item">
                  <span className="info-icon">🎂</span>
                  <div className="info-text">
                    <label>Edad</label>
                    <p>{edad} años</p>
                  </div>
                </div>
              );
            })()}

            {cliente.preferencias && (
              <div className="info-item">
                <span className="info-icon">🕐</span>
                <div className="info-text">
                  <label>Horario preferido</label>
                  <p style={{textTransform: 'capitalize'}}>
                    {typeof cliente.preferencias === 'object' 
                      ? cliente.preferencias.value || JSON.stringify(cliente.preferencias)
                      : cliente.preferencias}
                  </p>
                </div>
              </div>
            )}

            {cliente.metodoPagoPreferido && (
              <div className="info-item">
                <span className="info-icon">💳</span>
                <div className="info-text">
                  <label>Método de pago</label>
                  <p style={{textTransform: 'capitalize'}}>{cliente.metodoPagoPreferido}</p>
                </div>
              </div>
            )}
          </div>

          {/* Bio */}
          {cliente.bio && (
            <div className="profile-bio">
              <h3>📝 Sobre mí</h3>
              <p>{cliente.bio}</p>
            </div>
          )}

          {/* Botones de acción */}
          <nav className="profile-actions">
            <button onClick={() => navigate("/registroperfilcliente", { state: { cliente } })} className="btn-edit">
              ✏️ Editar perfil
            </button>
            <button onClick={() => navigate("/profesionales")} className="btn-services">
              🔍 Explorar profesionales
            </button>
          </nav>
        </article>
      </section>
    </main>
  );
};

export default BienveCliente;
