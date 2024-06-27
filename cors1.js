const express = require('express');
const cors = require('cors');
const app = express();

const config = {
  origin: ['http://localhost:5000', 'http://localhost:4000']
};
app.use(cors(config));

app.get('/data', function (req, res) {
  res.json({ message: 'Este es un mensaje desde el servidor!' });
});

app.listen(3000)