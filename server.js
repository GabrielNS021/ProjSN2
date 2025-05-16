const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = 3000;

const API_URL = 'https://superheroapi.com/api/eb78f42c1aece237a7276dff8ca900da';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ==============================
// ROTA PARA BUSCAR PERSONAGENS
// ==============================
app.get('/search', async (req, res) => {
  const name = req.query.name;
  try {
    const response = await axios.get(`${API_URL}/search/${name}`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar personagem.' });
  }
});

// ==============================
// CRUD DE FAVORITOS
// ==============================
let favoritos = [];
let proximoId = 1;

app.post('/favoritos', (req, res) => {
  const { id, name, image } = req.body;

  if (!id || !name || !image) {
    return res.status(400).json({ error: 'Dados incompletos.' });
  }

  favoritos.push({ id, name, image });
  res.status(201).json({ message: 'Favorito adicionado com sucesso.' });
});


// Listar todos
app.get('/favoritos', (req, res) => {
  res.json(favoritos);
});

// Buscar um favorito
app.get('/favoritos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const favorito = favoritos.find(f => f.id === id);
  if (!favorito) {
    return res.status(404).json({ erro: 'Favorito não encontrado' });
  }
  res.json(favorito);
});

// Atualizar
app.put('/favoritos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const favorito = favoritos.find(f => f.id === id);
  if (!favorito) {
    return res.status(404).json({ erro: 'Favorito não encontrado' });
  }

  const { nome, imagem, comentario } = req.body;
  if (nome) favorito.nome = nome;
  if (imagem) favorito.imagem = imagem;
  if (comentario !== undefined) favorito.comentario = comentario;

  res.json(favorito);
});

// Deletar
app.delete('/favoritos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = favoritos.findIndex(f => f.id === id);
  if (index === -1) {
    return res.status(404).json({ erro: 'Favorito não encontrado' });
  }

  favoritos.splice(index, 1);
  res.status(204).send();
});

// ==============================
// INICIAR SERVIDOR
// ==============================
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
