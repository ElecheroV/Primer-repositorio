const express = require('express')
const app = express()
const persons = [
    {
        name: 'Juan',
        age: 25
    },
    {
        name: 'Ana',
        age: 23
    },
    
    {
        name: 'Luis',
        age: 34
    },
    {
        name: 'Maria',
        age: 36
    },
    {
        name: 'Marisol',
        age: 38
    },
    {
        name: 'Juana',
        age: 21
    },
    {
        name: 'Pedro',
        age: 40
    },
    {
        name: 'Julio',
        age: 60
    },
    {
        name: 'Walter',
        age: 42
    },
    {
        name: 'Andres',
        age: 47
    },

]
app.use(express.json());
app.post('/', function (req, res){
    const initial = req.body.initial;
    const filtroinicial = persons.filter(person => person.name.charAt(0)===initial);
    res.json(filtroinicial);
})
app.listen(3000)