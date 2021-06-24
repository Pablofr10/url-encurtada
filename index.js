const express = require('express');
const app = express();
const pool = require('./db');

app.use(express.json())

// ROTAS
// Todas as URL
// Busca URL por Id
// Busca URLs por Data
// Encurta a URL e adiciona

app.listen(3000, () => {
    console.log('servidor sendo ouvido na porta 3000')
})