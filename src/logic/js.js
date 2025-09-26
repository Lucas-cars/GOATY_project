require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());


const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

connection.connect();




// postear, deletear, buscar endpoints (empleados)
function crearENDPOINT(tabla, columnas) {

  app.get(`/api/${tabla}`, (req, res) => {
    connection.query(`SELECT * FROM ${tabla}`, (error, resultado) => {
      if (error) return res.status(500).json({ error });
      res.json(resultado);
    });
  });

  app.post(`/api/${tabla}`, (req, res) => {
    const valores = columnas.map(col => req.body[col]);
    const placeholders = columnas.map(() => '?').join(', ');
    connection.query(
      `INSERT INTO ${tabla} (${columnas.join(', ')}) VALUES (${placeholders})`,
      valores,
      (error, resultado) => {
        if (error) return res.status(500).json({ error });
        res.json({ id: resultado.insertId, ...req.body });
      }
    );
  });

  app.delete(`/api/${tabla}`, (req, res) => {
    const { dni } = req.body;
    connection.query(
      `DELETE FROM ${tabla} WHERE dni = ?`,
      [dni],
      (error, resultado) => {
        if (error) return res.status(500).json({ error });
        res.json(resultado);
      }
    );
  });
}
// postear, deletear, buscar endpoints (empleados)

crearENDPOINT('asistencia', ['id_asistencia', 'fecha', 'hr_en', 'hr_sl', 'dni'])
crearENDPOINT('empleado', ['dni', 'mail', 'telefono', 'cargo', 'nombre'])
crearENDPOINT('movimiento_stock' ['id_movimiento', 'fecha', 'tipo', 'cantidad', 'id_producto', 'id_usuario'])
crearENDPOINT('producto', ['id_producto', 'nombre', 'codigo', 'categoria', 'stock_act', 'stock_min', 'precio', 'descripcion'])
crearENDPOINT('usuario', ['id_usuario', 'nombre_usuario', 'rol', 'contraseña'])

app.listen(3000);



fetch('http://localhost:3000/api/empleados', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
})
  .then(response => response.json())
  .then(data => {
    console.log('Empleados encontrados:', data);
  }); 