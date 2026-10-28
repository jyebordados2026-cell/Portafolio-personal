// Rutas CRUD de proyectos.
// El modelo y la validacion tipada vienen del modulo TypeScript compilado en ../dist/proyecto.js

const express = require("express");
const db = require("./db");
const { validarProyecto } = require("../dist/proyecto.js");

const router = express.Router();

// Convierte una fila de SQLite al formato de la API.
function filaAProyecto(fila) {
  return {
    id: fila.id,
    nombre: fila.nombre,
    descripcion: fila.descripcion,
    tecnologias: fila.tecnologias
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    imagenUrl: fila.imagen_url,
    enlaceUrl: fila.enlace_url,
    estado: fila.estado,
  };
}

// Normaliza y valida lo que llega desde el frontend.
function normalizarEntrada(body) {
  const tecnologias = Array.isArray(body.tecnologias)
    ? body.tecnologias
    : String(body.tecnologias || "").split(",");

  return {
    nombre: String(body.nombre || "").trim(),
    descripcion: String(body.descripcion || "").trim(),
    tecnologias: tecnologias.map((t) => String(t).trim()).filter(Boolean),
    imagenUrl: body.imagenUrl ? String(body.imagenUrl).trim() : null,
    enlaceUrl: body.enlaceUrl ? String(body.enlaceUrl).trim() : null,
    estado: String(body.estado || "borrador").trim(),
  };
}

// GET /api/proyectos  -> listar (opcional: ?estado=publicado)
router.get("/", (req, res) => {
  const { estado } = req.query;

  const filas = estado
    ? db
        .prepare("SELECT * FROM proyectos WHERE estado = ? ORDER BY id DESC")
        .all(estado)
    : db.prepare("SELECT * FROM proyectos ORDER BY id DESC").all();

  res.json(filas.map(filaAProyecto));
});

// GET /api/proyectos/:id  -> consultar uno
router.get("/:id", (req, res) => {
  const fila = db
    .prepare("SELECT * FROM proyectos WHERE id = ?")
    .get(req.params.id);

  if (!fila) {
    return res.status(404).json({ error: "Proyecto no encontrado" });
  }

  res.json(filaAProyecto(fila));
});

// POST /api/proyectos  -> crear
router.post("/", (req, res) => {
  const datos = normalizarEntrada(req.body);
  const errores = validarProyecto(datos);

  if (errores.length > 0) {
    return res.status(400).json({ errores });
  }

  const resultado = db
    .prepare(
      `INSERT INTO proyectos (nombre, descripcion, tecnologias, imagen_url, enlace_url, estado)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(
      datos.nombre,
      datos.descripcion,
      datos.tecnologias.join(","),
      datos.imagenUrl,
      datos.enlaceUrl,
      datos.estado
    );

  const fila = db
    .prepare("SELECT * FROM proyectos WHERE id = ?")
    .get(resultado.lastInsertRowid);

  res.status(201).json(filaAProyecto(fila));
});

// PUT /api/proyectos/:id  -> modificar
router.put("/:id", (req, res) => {
  const fila = db
    .prepare("SELECT id FROM proyectos WHERE id = ?")
    .get(req.params.id);

  if (!fila) {
    return res.status(404).json({ error: "Proyecto no encontrado" });
  }

  const datos = normalizarEntrada(req.body);
  const errores = validarProyecto(datos);

  if (errores.length > 0) {
    return res.status(400).json({ errores });
  }

  db.prepare(
    `UPDATE proyectos
     SET nombre = ?, descripcion = ?, tecnologias = ?, imagen_url = ?, enlace_url = ?, estado = ?
     WHERE id = ?`
  ).run(
    datos.nombre,
    datos.descripcion,
    datos.tecnologias.join(","),
    datos.imagenUrl,
    datos.enlaceUrl,
    datos.estado,
    req.params.id
  );

  const actualizado = db
    .prepare("SELECT * FROM proyectos WHERE id = ?")
    .get(req.params.id);

  res.json(filaAProyecto(actualizado));
});

// DELETE /api/proyectos/:id  -> eliminar
router.delete("/:id", (req, res) => {
  const resultado = db
    .prepare("DELETE FROM proyectos WHERE id = ?")
    .run(req.params.id);

  if (resultado.changes === 0) {
    return res.status(404).json({ error: "Proyecto no encontrado" });
  }

  res.status(204).send();
});

module.exports = router;
