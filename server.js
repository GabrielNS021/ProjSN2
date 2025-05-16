const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = 3000;

const API_URL = 'https://superheroapi.com/api/eb78f42c1aece237a7276dff8ca900da';

app.use(express.static(path.join(__dirname, 'public')));

app.get('/search', async (req, res) => {
  const name = req.query.name;
  try {
    const response = await axios.get(`${API_URL}/search/${name}`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar personagem.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
