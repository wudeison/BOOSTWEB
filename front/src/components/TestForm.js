import React, { useState } from "react";

const TestForm = () => {
  const [nombre, setNombre] = useState("");

  const enviarDatos = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre }),
      });

      const data = await res.json();
      alert("✅ " + data.mensaje);
    } catch (err) {
      alert("❌ Error: " + err.message);
    }
  };

  return (
    <div>
      <h2>Formulario de prueba</h2>
      <input
        type="text"
        placeholder="Tu nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <button onClick={enviarDatos}>Enviar</button>
    </div>
  );
};

export default TestForm;