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





function crearENDPOINT(tabla, columnas, primaryKey = 'id') {

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
    const { [primaryKey]: pkValue } = req.body;
    connection.query(
      `DELETE FROM ${tabla} WHERE ${primaryKey} = ?`,
      [pkValue],
      (error, resultado) => {
        if (error) return res.status(500).json({ error });
        res.json(resultado);
      }
    );
  });

  app.patch(`/api/${tabla}`, (req, res) => {
      const {[primaryKey]: pkValue, ...campos } = req.body;

      const keys = Object.keys(campos);
      if (keys.length === 0) { 
        return res.status(400).json({ error: 'No se enviaron los campos para actualizar' });
      }

      const setClause = keys.map(k => `${k} = ?`).join(', ');
      const valores = keys.map(k => campos[k]);

      connection.query(
        `UPDATE ${tabla} SET ${setClause} WHERE ${primaryKey} = ?`,
        [...valores, pkValue],
        (error, resultado) => {
          if(error) return res.status(500).json({ error });
          res.json({ actualizado: true, ...req.body });
        }
      );
  });
}


crearENDPOINT('asistencia', ['id_asistencia', 'fecha', 'hr_en', 'hr_sl', 'dni'], 'id_asistencia')
crearENDPOINT('empleado', ['dni', 'mail', 'telefono', 'cargo', 'nombre'], 'dni')
crearENDPOINT('movimiento_stock' ['id_movimiento', 'fecha', 'tipo', 'cantidad', 'id_producto', 'id_usuario'], 'id_movimiento')
crearENDPOINT('producto', ['id_producto', 'nombre', 'codigo', 'categoria', 'stock_act', 'stock_min', 'precio', 'descripcion'], 'id_producto')
crearENDPOINT('usuario', ['id_usuario', 'nombre_usuario', 'rol', 'contraseña'], 'id_usuario')

app.listen(3000);




