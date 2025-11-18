import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Servicios from "./pages/Servicios";
import Especialidades from "./pages/Especialidades";
import Contacto from "./pages/Contacto";
import BienveUsuario from "./pages/BienveUsuario";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/especialidades" element={<Especialidades />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/bienvenido" element={<BienveUsuario />} />
      </Routes>
    </Router>
  );
}

export default App;
