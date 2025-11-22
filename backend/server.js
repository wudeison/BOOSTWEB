const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Importar rutas
const registroRutas = require("./registro");
const loginRutas = require("./login");

// Usar rutas
app.use("/api", registroRutas);
app.use("/api", loginRutas);

app.listen(PORT, () => {
  console.log(`🚀 Backend activo en http://localhost:${PORT}`);
});


