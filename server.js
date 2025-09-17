// server.js
const express = require('express');
const bodyParser = require('body-parser');
const { sqliteDB } = require('./database');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; // ✅ Puerto dinámico para Railway

// Configurar body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// --- Mostrar formulario y usuarios ---
app.get('/', (req, res) => {
  sqliteDB.all('SELECT * FROM usuarios', [], (err, rows) => {
    if (err) {
      console.error('Error al leer usuarios:', err.message);
      rows = [];
    }
    res.render('index', { usuarios: rows });
  });
});

// --- Agregar usuario ---
app.post('/add', (req, res) => {
  const { nombre, email, comentario } = req.body;

  console.log('Datos recibidos del formulario:', nombre, email, comentario);

  sqliteDB.run(
    `INSERT INTO usuarios (nombre, email, comentario) VALUES (?, ?, ?)`,
    [nombre, email, comentario],
    function (err) {
      if (err) console.error('Error al agregar usuario:', err.message);
      else console.log('Usuario agregado correctamente con ID:', this.lastID);
      res.redirect('/');
    }
  );
});

// --- Actualizar usuario ---
app.post('/update/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, email, comentario } = req.body;

  sqliteDB.run(
    `UPDATE usuarios SET nombre = ?, email = ?, comentario = ? WHERE id = ?`,
    [nombre, email, comentario, id],
    function (err) {
      if (err) console.error('Error al actualizar usuario:', err.message);
      else console.log(`Usuario ID ${id} actualizado`);
      res.redirect('/');
    }
  );
});

// --- Borrar usuario ---
app.post('/delete/:id', (req, res) => {
  const { id } = req.params;

  sqliteDB.run(
    `DELETE FROM usuarios WHERE id = ?`,
    [id],
    function (err) {
      if (err) console.error('Error al eliminar usuario:', err.message);
      else console.log(`Usuario ID ${id} eliminado`);
      res.redirect('/');
    }
  );
});

// --- Iniciar servidor ---
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
