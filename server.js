const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = 3000;

const API_URL = 'https://superheroapi.com/api/eb78f42c1aece237a7276dff8ca900da';

app.use(express.json());
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

let favoritos = [];


app.post('/favoritos', (req, res) => {
  const { id, name, image, biography, appearance, work, powerstats } = req.body;

  if (!id || !name || !image || !biography || !appearance || !work || !powerstats) {
    return res.status(400).json({ error: 'Dados incompletos do herói para favoritar.' });
  }

  if (favoritos.some(f => f.id === id)) {
    return res.status(409).json({ message: 'Herói já está nos favoritos.' });
  }

  const novoFavorito = {
    id,
    name,
    image: image.url,
    biography,
    appearance,
    work,
    powerstats,
    apelido: ''
  };

  favoritos.push(novoFavorito);
  res.status(201).json({ message: 'Favorito adicionado com sucesso.', favorito: novoFavorito });
});


app.get('/favoritos', (req, res) => {
  res.json(favoritos);
});

app.get('/favoritos/:id', (req, res) => {
  const idParam = req.params.id;
  const favorito = favoritos.find(f => f.id === idParam);
  if (!favorito) {
    return res.status(404).json({ erro: 'Favorito não encontrado' });
  }
  res.json(favorito);
});

app.put('/favoritos/:id', (req, res) => {
  const idParam = req.params.id;
  const favoritoIndex = favoritos.findIndex(f => f.id === idParam);

  if (favoritoIndex === -1) {
    return res.status(404).json({ erro: 'Favorito não encontrado' });
  }

  const { apelido } = req.body;

  if (apelido !== undefined) {
    favoritos[favoritoIndex].apelido = apelido.trim();
  }

  res.json(favoritos[favoritoIndex]);
});


app.delete('/favoritos/:id', (req, res) => {
  const idParam = req.params.id;
  const index = favoritos.findIndex(f => f.id === idParam);
  if (index === -1) {
    return res.status(404).json({ erro: 'Favorito não encontrado' });
  }

  favoritos.splice(index, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Servidor rodando`);
});