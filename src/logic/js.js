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



// Endpoint para obtener usuarios
app.get('/api/usuarios', (req, res) => {
  connection.query('SELECT * FROM usuario', (error, results) => {
    if (error) return res.status(500).json({ error });
    res.json(results);
  });
});


app.get('/api/empleados', (req, res) => {
  connection.query('SELECT * FROM empleado', (error, results) => {
    if (error) return res.status(500).json({ error });
    res.json(results);
  });
});

// Endpoint POST para agregar empleado
app.post('/api/empleados', (req, res) => {
  const { dni, mail, telefono, cargo, nombre } = req.body;
  connection.query(
    'INSERT INTO empleado (dni, mail, telefono, cargo, nombre) VALUES (?, ?, ?, ?, ?)',
    [dni, mail, telefono, cargo, nombre],
    (error, results) => {
      if (error) return res.status(500).json({ error });
      res.json({ id: results.insertId, dni, mail, telefono, cargo, nombre });
    }
  );
});

app.listen(3000, () => console.log('API corriendo en http://localhost:3000'));



fetch('http://localhost:3000/api/empleados', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    dni: '12345678',
    mail: 'juan@example.com',
    telefono: '123456789',
    cargo: 'admin',
    nombre: 'Juan'
  })
})
  .then(response => response.json())
  .then(data => {
    console.log('Empleado agregado:', data);
  });