const cors = require('cors');
const mysql = require('mysql2');
const express = require('express');
const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'inventario'
});


app.post('/producto', (req, res) => {
    const { nombre, precio, stock } = req.body;
    const query = 'INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)';
    db.query(query, [nombre, precio, stock], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send('Producto creado con ID: ' + result.insertId);
    });
});


app.get('/producto', (req, res) => {
    db.query('SELECT * FROM productos', (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});


app.put('/producto/:id', (req, res) => {
    const { nombre, precio, stock } = req.body;
    const { id } = req.params;
    const query = 'UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id = ?';
    db.query(query, [nombre, precio, stock, id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send('Producto actualizado correctamente');
    });
});


app.delete('/producto/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM productos WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send('Producto eliminado');
    });
});

app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'));