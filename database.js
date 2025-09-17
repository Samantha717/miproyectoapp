// database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Ruta absoluta al archivo database.db dentro de tu proyecto
const dbPath = path.resolve(__dirname, 'database.db');
const sqliteDB = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Error SQLite:', err.message);
  else console.log('Conectado a SQLite local en', dbPath);
});

// Crear tabla usuarios si no existe
sqliteDB.run(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL,
    comentario TEXT
  )
`, (err) => {
  if(err) console.error('Error creando tabla:', err.message);
  else console.log('Tabla "usuarios" lista');
});

module.exports = { sqliteDB };
