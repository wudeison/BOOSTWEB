const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "tarrao",        // la contraseña de mi MySQL
  database: "boost"
});

db.connect((err) => {
  if (err) {
    console.log("❌ Error al conectar a MySQL:", err);
  } else {
    console.log("📌 Conectado a MySQL (BD: boost)");
  }
});

module.exports = db;
