import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Servicios from "./pages/Servicios";
import Especialidades from "./pages/Especialidades";
import Contacto from "./pages/Contacto";
import BienveCliente from "./pages/BienveCliente";
import BienveUsuario from "./pages/BienveUsuario";
import BienveProfesional from "./pages/BienveProfesional";
import RegistroPerfilCliente from "./components/RegistroPerfilCliente";
import RegistroPerfilProfesional from "./components/RegistroPerfilProfesional";
import DisponibilidadProfesional from "./pages/DisponibilidadProfesional";
import Profesionales from "./pages/Profesionales";
import PerfilProfesionalPublico from "./pages/PerfilProfesionalPublico";

function AppContent() {
  const location = useLocation();
  
  // Rutas que NO deben mostrar el Navbar
  const rutasSinNavbar = ['/bienvecliente', '/bienveusuario', '/bienveprofesional', '/registroperfilcliente', '/registroperfilprofesional', '/disponibilidad-profesional', '/profesionales'];
  const mostrarNavbar = !rutasSinNavbar.includes(location.pathname) && !location.pathname.startsWith('/profesional/');

  return (
    <>
      {mostrarNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/especialidades" element={<Especialidades />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/bienvenido" element={<BienveCliente />} />
        <Route path="/bienvecliente" element={<BienveCliente />} />
        <Route path="/bienveusuario" element={<BienveUsuario />} />
        <Route path="/bienveprofesional" element={<BienveProfesional />} />
        <Route path="/registroperfilcliente" element={<RegistroPerfilCliente />} />
        <Route path="/registroperfilprofesional" element={<RegistroPerfilProfesional />} />
        <Route path="/disponibilidad-profesional" element={<DisponibilidadProfesional />} />
        <Route path="/profesionales" element={<Profesionales />} />
        <Route path="/profesional/:id" element={<PerfilProfesionalPublico />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
