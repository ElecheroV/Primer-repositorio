const express = require('express');
const app = express();
app.use(express.json());

let productos=[];

app.post('/', function(req, res) {
    const { descripcion, cantidad, fechaIngreso, categoria, precio } = req.body;
    const nuevoProducto = {id: productos.length+1, descripcion, cantidad, fechaIngreso, categoria, precio};
    
    productos.push(nuevoProducto);
    res.json(nuevoProducto);
});

app.put('/:id', function(req, res) {
    const id = parseInt(req.params.id);
    const { descripcion, cantidad, fechaIngreso, categoria, precio } = req.body;
    const index = productos.findIndex(producto => producto.id === id);

    if (index !== -1) {
        productos[index] = {id,descripcion,cantidad,fechaIngreso,categoria,precio};
        res.json(productos[index]);
    }
});

app.delete('/:id', function(req, res) {
    const id = parseInt(req.params.id);
    const index = productos.findIndex(producto => producto.id === id);

    if (index !== -1) {
        productos.splice(index, 1);
        res.send();
    }
});

app.get('/', function(req, res) {
    res.json(productos);
});

app.listen(3000)