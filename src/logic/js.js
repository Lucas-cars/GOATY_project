require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const app = express();
app.use(express.json());

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

connection.connect();

app.get('/', (req, res) => {
  res.send('API GOATY funcionando');
});

// Endpoint para obtener usuarios
app.get('/api/usuario', (req, res) => {
  connection.query('SELECT * FROM usuario', (error, results) => {
    if (error) return res.status(500).json({ error });
    res.json(results);
  });
});

app.listen(3000, () => console.log('API corriendo en http://localhost:3000'));

