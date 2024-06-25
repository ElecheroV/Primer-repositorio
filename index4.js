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

app.get('/fecha/:fechaIngreso', async function(req, res) {
    const fechaIngreso = req.params.fechaIngreso;
    try {
    const [rows] = await db.query('select * from productos where fechaIngreso = ?', [fechaIngreso]);
        res.json(rows);
    } catch (err) {
        console.error('Error al obtener los productos:', err);
        res.send('Error al obtener los productos');
    }
});

app.post('/cotizacion', async function(req, res) {
    const productosCotizados = req.body.productos;
    
    try {
        const idsProductos = productosCotizados.map(producto => producto.id);
        const [rows] = await db.query('select * from productos where id in (?)', [idsProductos]);

        let precioTotal = 0;
        const productosCotizadosConDetalle = productosCotizados.map(producto => {
            const productoBD = rows.find(row => row.id === producto.id);
            if (productoBD) {
                const precioUnitario = parseFloat(productoBD.precio);
                const cantidad = parseInt(producto.cantidad);
                const subtotal = cantidad * precioUnitario;
                precioTotal += subtotal;
                return {
                    id: producto.id,
                    descripcion: productoBD.descripcion,
                    cantidad: cantidad,
                    precioUnitario: precioUnitario,
                    subtotal: subtotal
                };
            }
            return null;
        }).filter(producto => producto !== null);
        
        const fechaActual = new Date().toISOString().slice(0, 10);
        
        const [result] = await db.execute('INSERT INTO cotizacion (fecha, precioTotal) VALUES (?, ?)', [fechaActual, precioTotal]);
        const idCotizacion = result.insertId;

        for (const producto of productosCotizadosConDetalle) {
            await db.execute('INSERT INTO cotizacion_detalles (idCot, id, cantidad, precioUnitario, subtotal) VALUES (?, ?, ?, ?, ?)', [idCotizacion, producto.id, producto.cantidad, producto.precioUnitario, producto.subtotal]);
        }
        
        res.json({
            productos: productosCotizadosConDetalle,
            precioTotal: precioTotal
        });
    } catch (err) {
        console.error('Error al simular la cotización:', err);
        res.status(500).send('Error al simular la cotización');
    }
});


app.listen(3000)