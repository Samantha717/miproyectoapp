const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');

// Conexión SQLite local
const sqliteDB = new sqlite3.Database('./database.db', (err) => {
  if (err) console.error(err.message);
  else console.log('Conectado a SQLite local');
});

// Crear tabla si no existe
sqliteDB.run(`CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT,
  email TEXT,
  comentario TEXT
)`);

// Conexión PostgreSQL en la nube
const pgPool = new Pool({
  user: 'TU_USUARIO',
  host: 'TU_HOST',
  database: 'TU_DB',
  password: 'TU_CONTRASEÑA',
  port: 5432,
});

pgPool.query(`CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100),
  email VARCHAR(100),
  comentario TEXT
)`, (err) => {
  if (err) console.error('Error PostgreSQL:', err.message);
  else console.log('Conectado a PostgreSQL');
});

module.exports = { sqliteDB, pgPool };
