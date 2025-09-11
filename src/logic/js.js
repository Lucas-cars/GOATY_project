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

app.listen(3000, () => console.log('API corriendo en http://localhost:3000'));



async function postData(url = '', data = {}) {
  // Opciones por defecto estan marcadas con un *
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(data)
  });
  return response.json(); // parses JSON response into native JavaScript objects
  
}

postData('http://localhost:3000/api/usuarios', { answer: 1 })
  .then(data => {
    console.log(data); // JSON data parsed by data.json() call
  });