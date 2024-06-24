const express = require('express');
const db = require('./dbconfig');
const app = express();
app.use(express.json());

app.post('/', async function(req, res) {
    const { descripcion, cantidad, fechaIngreso, categoria, precio } = req.body;
    try {
        const [result] = await db.execute('insert into productos (descripcion, cantidad, fechaIngreso, categoria, precio) values (?, ?, ?, ?, ?)', [descripcion, cantidad, fechaIngreso, categoria, precio]);
        const nuevoProducto = {id: result.insertId,descripcion,cantidad,fechaIngreso,categoria,precio};      
        res.json(nuevoProducto);
    } catch (err) {
        console.error('Error al crear el producto:', err);
        res.send('Error al crear el producto');
    }
});

app.put('/:id', async function(req, res) {
    const id = parseInt(req.params.id);
    const { descripcion, cantidad, fechaIngreso, categoria, precio } = req.body;
    try {
        const [result] = await db.execute('update productos set descripcion = ?, cantidad = ?, fechaIngreso = ?, categoria = ?, precio = ? where id = ?', [descripcion, cantidad, fechaIngreso, categoria, precio, id]);
        
        if (result.affectedRows > 0) {
            res.json({ id, descripcion, cantidad, fechaIngreso, categoria, precio });
        }
    } catch (err) {
        console.error('Error al actualizar el producto:', err);
        res.send('Error al actualizar el producto');
    }
});

app.delete('/:id', async function(req, res) {
    const id = parseInt(req.params.id);
    try {
        const [result] = await db.execute('delete from productos where id = ?', [id]);
        
        if (result.affectedRows > 0) {
            res.send();
        }
    } catch (err) {
        console.error('Error al eliminar el producto:', err);
        res.send('Error al eliminar el producto');
    }
});

app.get('/:id', async function(req, res) {
    const id = parseInt(req.params.id);
    try {
    const [rows] = await db.query('select * from productos where id = ?', [id]);
        res.json(rows);
    } catch (err) {
        console.error('Error al obtener los productos:', err);
        res.send('Error al obtener los productos');
    }
});

app.listen(3000)