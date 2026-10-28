// Servidor Express: API de proyectos + archivos del frontend.

const path = require("node:path");
const express = require("express");
const proyectosRouter = require("./proyectos.routes");

const app = express();
const PUERTO = process.env.PORT || 3000;

app.use(express.json());

// CORS basico para poder probar el frontend con Live Server u otro puerto.
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// API
app.use("/api/proyectos", proyectosRouter);

// Frontend (HTML, CSS, JS e imagenes)
const carpetaFrontend = path.join(__dirname, "..", "..", "frontend");
app.use(express.static(carpetaFrontend));

// 404 para rutas de API inexistentes
app.use("/api", (req, res) => {
  res.status(404).json({ error: "Recurso no encontrado" });
});

// Manejador de errores
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
});

app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en http://localhost:${PUERTO}`);
});
