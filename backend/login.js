const express = require("express");
const router = express.Router();
const db = require("./database");

router.post("/login", (req, res) => {
  const { idUsuario, contrasena } = req.body;

  if (!idUsuario || !contrasena) {
    return res.status(400).json({ mensaje: "Faltan datos" });
  }

  const query = "SELECT * FROM usuario WHERE idUsuario = ?";

  db.query(query, [idUsuario], (err, result) => {
    if (err) return res.status(500).json({ mensaje: "Error en el servidor" });

    if (result.length === 0) {
      return res.status(400).json({ mensaje: "El usuario no existe" });
    }

    const usuario = result[0];

    if (usuario.contrasena !== contrasena) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    res.json({
      mensaje: "Inicio de sesión exitoso",
      usuario: {
        idUsuario: usuario.idUsuario,
        nombre: usuario.nombre,
        tipoUsuario: usuario.tipoUsuario,
      },
    });
  });
});

module.exports = router;
