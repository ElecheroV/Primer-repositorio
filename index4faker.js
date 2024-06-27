const express = require('express');
const db = require('./dbconfig');
const faker = require('faker');
const morgan = require('morgan');
const app = express();
app.use(express.json());
app.use(morgan('method :url :status :res[content-length] - :response-time ms'));

app.post('/', async function(req, res) {
    try {
        let numdatos = 100;
        const nuevosProductos = [];

        for (let i = 0; i < numdatos; i++) {
            const descripcion = faker.commerce.productName();
            const cantidad = faker.datatype.number({ min: 1, max: 100 });
            const fechaIngreso = faker.date.past(1);
            const categoria = faker.random.arrayElement(['Electrónica', 'Ropa', 'Hogar', 'Juguetes']);
            const precio = faker.datatype.number({ min: 10, max: 1000 });

            const [result] = await db.execute('INSERT INTO productos (descripcion, cantidad, fechaIngreso, categoria, precio) VALUES (?, ?, ?, ?, ?)', [descripcion, cantidad, fechaIngreso, categoria, precio]);

            const nuevoProducto = {
                id: result.insertId,descripcion,cantidad,fechaIngreso,categoria,precio};
            nuevosProductos.push(nuevoProducto);
        }

        res.json(nuevosProductos);

    } catch (err) {
        console.error('Error al crear los productos:', err);
        res.status(500).send('Error al crear los productos');
    }
});


app.put('/:id', async function(req, res) {
    const id = parseInt(req.params.id);
    const { descripcion, cantidad, fechaIngreso, categoria, precio } = req.body;
    try {
        const [result] = await db.execute('UPDATE productos SET descripcion = ?, cantidad = ?, fechaIngreso = ?, categoria = ?, precio = ? WHERE id = ?', [descripcion, cantidad, fechaIngreso, categoria, precio, id]);
        
        if (result.affectedRows > 0) {
            res.json({ id, descripcion, cantidad, fechaIngreso, categoria, precio });
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (err) {
        console.error('Error al actualizar el producto:', err);
        res.status(500).send('Error al actualizar el producto');
    }
});


app.delete('/:id', async function(req, res) {
    const id = parseInt(req.params.id);
    try {
        const [result] = await db.execute('DELETE FROM productos WHERE id = ?', [id]);
        
        if (result.affectedRows > 0) {
            res.send();
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (err) {
        console.error('Error al eliminar el producto:', err);
        res.status(500).send('Error al eliminar el producto');
    }
});


app.get('/:mostrar', async function(req, res) {
    try {
        const [rows] = await db.query('SELECT * FROM productos');
        if (rows.length > 0) {
            res.json(rows);
        } else {
            res.status(404).send('No se encontraron productos');
        }
    } catch (err) {
        console.error('Error al obtener los productos:', err);
        res.status(500).send('Error al obtener los productos');
    }
});


app.get('/:id', async function(req, res) {
    const id = parseInt(req.params.id);
    try {
        const [rows] = await db.query('SELECT * FROM productos WHERE id = ?', [id]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (err) {
        console.error('Error al obtener el producto:', err);
        res.status(500).send('Error al obtener el producto');
    }
});



app.get('/fecha/:fechaIngreso', async function(req, res) {
    const fechaIngreso = req.params.fechaIngreso;
    try {
        const [rows] = await db.query('SELECT * FROM productos WHERE fechaIngreso = ?', [fechaIngreso]);
        res.json(rows);
    } catch (err) {
        console.error('Error al obtener los productos por fecha de ingreso:', err);
        res.status(500).send('Error al obtener los productos por fecha de ingreso');
    }
});


app.post('/cotizacion', async function(req, res) {
    const productosCotizados = req.body.productos;
    
    try {
        const idsProductos = productosCotizados.map(producto => producto.id);
        const [rows] = await db.query('SELECT * FROM productos WHERE id IN (?)', [idsProductos]);

        let precioTotal = 0;
        const productosCotizadosConDetalle = productosCotizados.map(producto => {
            const productoBD = rows.find(row => row.id === producto.id);
            if (productoBD) {
                const precioUnitario = parseFloat(productoBD.precio);
                const cantidad = parseInt(producto.cantidad);
                const subtotal = cantidad * precioUnitario;
                precioTotal += subtotal;
                return {
                    id: producto.id, descripcion: productoBD.descripcion, cantidad: cantidad, precioUnitario: precioUnitario, subtotal: subtotal};
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
