const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.post("/api/test", (req, res) => {
  console.log("✅ Datos recibidos:", req.body);
  res.json({ mensaje: "Datos recibidos correctamente" });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend activo en http://localhost:${PORT}`);
});
