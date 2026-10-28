// Conexion y creacion de la base de datos SQLite (node:sqlite).
// La base se guarda en backend/database/portfolio.db y persiste entre reinicios.

const { DatabaseSync } = require("node:sqlite");
const fs = require("node:fs");
const path = require("node:path");

const dbDir = path.join(__dirname, "..", "database");
fs.mkdirSync(dbDir, { recursive: true });

const rutaBd = path.join(dbDir, "portfolio.db");
const db = new DatabaseSync(rutaBd);

db.exec(`
  CREATE TABLE IF NOT EXISTS proyectos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    tecnologias TEXT NOT NULL,
    imagen_url TEXT,
    enlace_url TEXT,
    estado TEXT NOT NULL DEFAULT 'borrador'
      CHECK (estado IN ('publicado', 'en-desarrollo', 'borrador')),
    creado_en TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// Si la tabla esta vacia, cargamos los proyectos iniciales del portfolio.
const { total } = db.prepare("SELECT COUNT(*) AS total FROM proyectos").get();

if (total === 0) {
  const insertar = db.prepare(`
    INSERT INTO proyectos (nombre, descripcion, tecnologias, imagen_url, enlace_url, estado)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertar.run(
    "ClinicaDental",
    "Sistema para gestionar pacientes, turnos y usuarios de una clinica dental.",
    "HTML,CSS,JavaScript",
    null,
    "https://github.com/Damian02XD/Grupo_ClinicaDental",
    "publicado"
  );

  insertar.run(
    "Java Practica",
    "Aplicacion desarrollada en Java para poner en practica conceptos aprendidos.",
    "Java",
    null,
    "https://github.com/Damian02XD/JavaPractica",
    "publicado"
  );

  insertar.run(
    "Este portafolio",
    "Sitio personal para mostrar mi formacion, mis habilidades y mis trabajos.",
    "HTML,CSS,JavaScript,Git",
    null,
    "https://github.com/Damian02XD/PortafolioPersonal",
    "en-desarrollo"
  );
}

module.exports = db;
