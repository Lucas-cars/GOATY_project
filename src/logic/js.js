const express = require('express');
const mysql = require('mysql');
const app = express();
app.use(express.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'TU_USUARIO',
  password: 'TU_CONTRASEÑA',
  database: 'TU_BASE'
});

connection.connect();

// Endpoint para obtener usuarios
app.get('/api/usuarios', (req, res) => {
  connection.query('SELECT * FROM usuarios', (error, results) => {
    if (error) return res.status(500).json({ error });
    res.json(results);
  });
});

// Endpoint para agregar usuario
app.post('/api/usuarios', (req, res) => {
  const { nombre } = req.body;
  connection.query('INSERT INTO usuarios (nombre) VALUES (?)', [nombre], (error, results) => {
    if (error) return res.status(500).json({ error });
    res.json({ id: results.insertId, nombre });
  });
});

app.listen(3000, () => console.log('API corriendo en http://localhost:3000'));

