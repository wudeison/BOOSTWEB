const express = require("express");
const router = express.Router();
const db = require("../database");

router.post("/registro", async (req, res) => {
  const { idUsuario, nombre, correo, contrasena, tipoUsuario } = req.body;

  if (!idUsuario || !nombre || !correo || !contrasena || !tipoUsuario) {
    return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
  }

  const query = `
    INSERT INTO usuario (idUsuario, nombre, correo, contrasena, fechaRegistro, tipoUsuario)
    VALUES (?, ?, ?, ?, NOW(), ?)
  `;

  const values = [idUsuario, nombre, correo, contrasena, tipoUsuario];

  try {
    await db.query(query, values);
    res.json({ mensaje: "Usuario registrado correctamente" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ mensaje: "El usuario ya existe" });
    }
    return res.status(500).json({ mensaje: "Error en el servidor" });
  }
});

module.exports = router;
