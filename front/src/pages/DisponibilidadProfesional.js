import React, { useState, useEffect } from "react";
import "./DisponibilidadProfesional.css";
import API_URL from "../config";

const DisponibilidadProfesional = ({ profesional, onClose }) => {
  const [mesActual, setMesActual] = useState(new Date());
  const [disponibilidad, setDisponibilidad] = useState([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const [horarioForm, setHorarioForm] = useState({
    horaInicio: "09:00",
    horaFin: "10:00",
  });

  useEffect(() => {
    if (profesional?.idProfesional) {
      cargarDisponibilidad(profesional.idProfesional, mesActual);
    }
  }, [mesActual, profesional]);

  const cargarDisponibilidad = async (idProfesional, fecha) => {
    try {
      const mes = fecha.getMonth() + 1;
      const anio = fecha.getFullYear();
      const res = await fetch(`${API_URL}/api/disponibilidad/${idProfesional}?mes=${mes}&anio=${anio}`);
      const data = await res.json();
      setDisponibilidad(data.disponibilidad || []);
    } catch (error) {
      console.error("Error al cargar disponibilidad:", error);
    }
  };

  const getDiasDelMes = () => {
    const year = mesActual.getFullYear();
    const month = mesActual.getMonth();
    const primerDia = new Date(year, month, 1);
    const ultimoDia = new Date(year, month + 1, 0);
    const dias = [];

    // Días vacíos al inicio (para alinear el calendario)
    for (let i = 0; i < primerDia.getDay(); i++) {
      dias.push(null);
    }

    // Días del mes
    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
      dias.push(new Date(year, month, dia));
    }

    return dias;
  };

  const getHorariosDelDia = (fecha) => {
    if (!fecha) return [];
    const fechaStr = fecha.toISOString().split('T')[0];
    return disponibilidad.filter(d => d.fecha.split('T')[0] === fechaStr);
  };

  const handleGuardarHorario = async () => {
    if (!diaSeleccionado || !profesional) return;

    try {
      const fechaStr = diaSeleccionado.toISOString().split('T')[0];
      if (horarioForm.horaInicio >= horarioForm.horaFin) {
        alert("La hora final debe ser mayor a la hora inicial");
        return;
      }

      const res = await fetch(`${API_URL}/api/disponibilidad/franja`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idProfesional: profesional.idProfesional,
          fecha: fechaStr,
          horaInicio: horarioForm.horaInicio,
          horaFin: horarioForm.horaFin
        }),
      });

      if (res.ok) {
        const data = await res.json();
        alert(`✅ Bloques generados: ${data.bloquesCreados}`);
        cargarDisponibilidad(profesional.idProfesional, mesActual);
        setDiaSeleccionado(null);
        setHorarioForm({ horaInicio: "09:00", horaFin: "10:00" });
      } else {
        alert("❌ Error al guardar horario");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Error al guardar horario");
    }
  };

  const handleEliminarHorario = async (id) => {
    if (!window.confirm("¿Eliminar este horario?")) return;

    try {
      const res = await fetch(`${API_URL}/api/disponibilidad/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("✅ Horario eliminado");
        cargarDisponibilidad(profesional.idProfesional, mesActual);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const cambiarMes = (direccion) => {
    const nuevaFecha = new Date(mesActual);
    nuevaFecha.setMonth(nuevaFecha.getMonth() + direccion);
    setMesActual(nuevaFecha);
  };

  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
                 "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  if (!profesional) return null;

  return (
    <aside className="disponibilidad-modal-overlay" onClick={onClose}>
      <article className="disponibilidad-modal-content" onClick={(e) => e.stopPropagation()}>
        <main className="disponibilidad-page-modal">
          <header className="disponibilidad-header">
            <h1>📅 Gestionar Disponibilidad</h1>
            <button onClick={onClose} className="btn-close">
              ← Atrás
            </button>
          </header>

          <section className="disponibilidad-container">
        {/* Calendario */}
        <section className="calendario">
          {/* Controles del mes */}
          <div className="mes-controls">
            <button onClick={() => cambiarMes(-1)} className="btn-mes">←</button>
            <h2>{meses[mesActual.getMonth()]} {mesActual.getFullYear()}</h2>
            <button onClick={() => cambiarMes(1)} className="btn-mes">→</button>
          </div>

          {/* Encabezados de días */}
          <div className="dias-semana">
            {diasSemana.map(dia => (
              <div key={dia} className="dia-semana-header">{dia}</div>
            ))}
          </div>

          {/* Días del mes */}
          <div className="dias-grid">
            {getDiasDelMes().map((fecha, index) => {
              if (!fecha) return <div key={index} className="dia-vacio"></div>;

              const horarios = getHorariosDelDia(fecha);
              const tieneHorarios = horarios.length > 0;
              const esHoy = fecha.toDateString() === new Date().toDateString();
              const esSeleccionado = diaSeleccionado && fecha.toDateString() === diaSeleccionado.toDateString();

              return (
                <div
                  key={index}
                  className={`dia-celda ${tieneHorarios ? "tiene-horarios" : ""} ${esHoy ? "hoy" : ""} ${esSeleccionado ? "seleccionado" : ""}`}
                  onClick={() => setDiaSeleccionado(fecha)}
                >
                  <span className="numero-dia">{fecha.getDate()}</span>
                  {tieneHorarios && <span className="indicador-horarios">{horarios.length}</span>}
                </div>
              );
            })}
          </div>
        </section>

        {/* Panel lateral: detalles del día seleccionado o mensaje instructivo */}
        {diaSeleccionado ? (
          <section className="panel-dia">
            <h3>📅 {diaSeleccionado.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</h3>

            {/* Horarios existentes */}
            <div className="horarios-existentes">
              <h4>Horarios configurados:</h4>
              {getHorariosDelDia(diaSeleccionado).length === 0 ? (
                <p className="sin-horarios">Sin horarios configurados</p>
              ) : (
                getHorariosDelDia(diaSeleccionado).map(horario => (
                  <div key={horario.idDisponibilidad} className="horario-item">
                    <span className="horario-tiempo">{horario.horaInicio} - {horario.horaFin}</span>
                    <span className={`estado-badge ${horario.estado}`}>{horario.estado}</span>
                    {horario.estado === 'disponible' && (
                      <button onClick={() => handleEliminarHorario(horario.idDisponibilidad)} className="btn-eliminar">
                        🗑️
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Formulario para agregar nuevo horario */}
            <div className="form-nuevo-horario">
              <h4>Agregar nuevo horario:</h4>
              <div className="hora-inputs">
                <div className="input-group">
                  <label>Desde:</label>
                  <input
                    type="time"
                    value={horarioForm.horaInicio}
                    onChange={(e) => setHorarioForm({ ...horarioForm, horaInicio: e.target.value })}
                  />
                </div>
                <div className="input-group">
                  <label>Hasta:</label>
                  <input
                    type="time"
                    value={horarioForm.horaFin}
                    onChange={(e) => setHorarioForm({ ...horarioForm, horaFin: e.target.value })}
                  />
                </div>
              </div>
              <button onClick={handleGuardarHorario} className="btn-guardar">
                ✅ Guardar horario
              </button>
            </div>
          </section>
        ) : (
          <section className="panel-instruccion">
            <div className="instruccion-content">
              <span className="instruccion-icon">👆</span>
              <h3>Selecciona un día</h3>
              <p>Haz clic en cualquier día del calendario para agregar o editar tu disponibilidad</p>
            </div>
          </section>
        )}
        </section>
        </main>
      </article>
    </aside>
  );
};

export default DisponibilidadProfesional;
