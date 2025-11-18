import React from "react";

const Especialidades = () => {
  return (
    <div style={{ padding: "50px 20px", textAlign: "center", minHeight: "80vh", backgroundColor: "#eef7ff" }}>
      <h1>Especialidades</h1>
      <p>
        Contamos con diversas especialidades para cubrir las necesidades de nuestros clientes:
      </p>
      <ul style={{ textAlign: "left", display: "inline-block", marginTop: "20px" }}>
        <li><strong>Psicología:</strong> Asesoría y acompañamiento profesional para mejorar el bienestar emocional.</li>
        <li><strong>Finanzas personales:</strong> Orientación para administrar tu dinero y planificar tu futuro económico.</li>
        <li><strong>Desarrollo profesional:</strong> Capacitación y mentoría para potenciar tus habilidades laborales.</li>
        <li><strong>Salud y bienestar:</strong> Talleres y consejos para mantener un estilo de vida equilibrado y saludable.</li>
      </ul>
    </div>
  );
};

export default Especialidades;
