const express = require('express');
const bodyParser = require('body-parser');
const { sqliteDB, pgPool } = require('./database');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// --- Mostrar formulario y usuarios ---
app.get('/', (req, res) => {
  sqliteDB.all('SELECT * FROM usuarios', [], (err, rows) => {
    if (err) throw err;
    res.render('index', { usuarios: rows });
  });
});

// --- Crear usuario ---
app.post('/add', (req, res) => {
  const { nombre, email, comentario } = req.body;

  sqliteDB.run(`INSERT INTO usuarios (nombre, email, comentario) VALUES (?, ?, ?)`,
    [nombre, email, comentario], function(err) {
      if(err) console.error(err.message);
  });

  pgPool.query('INSERT INTO usuarios (nombre, email, comentario) VALUES ($1, $2, $3)',
    [nombre, email, comentario], (err) => { if(err) console.error(err.message); });

  res.redirect('/');
});

// --- Actualizar usuario ---
app.post('/update/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, email, comentario } = req.body;

  sqliteDB.run(`UPDATE usuarios SET nombre=?, email=?, comentario=? WHERE id=?`,
    [nombre, email, comentario, id], (err) => { if(err) console.error(err); });

  pgPool.query('UPDATE usuarios SET nombre=$1, email=$2, comentario=$3 WHERE id=$4',
    [nombre, email, comentario, id], (err) => { if(err) console.error(err); });

  res.redirect('/');
});

// --- Borrar usuario ---
app.post('/delete/:id', (req, res) => {
  const { id } = req.params;

  sqliteDB.run('DELETE FROM usuarios WHERE id=?', [id], (err) => { if(err) console.error(err); });
  pgPool.query('DELETE FROM usuarios WHERE id=$1', [id], (err) => { if(err) console.error(err); });

  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
