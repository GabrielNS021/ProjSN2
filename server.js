require('dotenv').config({ path: 'cred.env' });
const express = require('express');
const axios = require('axios');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 8080;

const API_URL = 'https://superheroapi.com/api/eb78f42c1aece237a7276dff8ca900da';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/search', async (req, res) => {
  const name = req.query.name;
  try {
    const response = await axios.get(`${API_URL}/search/${name}`);
    res.json(response.data);
  } catch (err) {
    console.error('Erro ao buscar personagem:', err);
    res.status(500).json({ error: 'Erro ao buscar personagem.' });
  }
});

app.post('/favoritos', async (req, res) => {
  const { id, name, image, biography, appearance, work, powerstats } = req.body;

  if (!id || !name || !image || !biography || !appearance || !work || !powerstats) {
    return res.status(400).json({ error: 'Dados incompletos do herói para favoritar.' });
  }

  const novoFavorito = {
    id,
    name,
    image_url: image.url,
    biography,
    appearance,
    work,
    powerstats,
    apelido: ''
  };

  const query = `
    INSERT INTO favoritos (id, name, image_url, biography, appearance, work, powerstats, apelido)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;
  const values = [
    novoFavorito.id,
    novoFavorito.name,
    novoFavorito.image_url,
    novoFavorito.biography,
    novoFavorito.appearance,
    novoFavorito.work,
    novoFavorito.powerstats,
    novoFavorito.apelido
  ];

  try {
    const result = await pool.query(query, values);
    res.status(201).json({ message: 'Favorito adicionado com sucesso.', favorito: result.rows[0] });
  } catch (err) {
    console.error('Erro ao adicionar favorito:', err);
    if (err.code === '23505') {
        return res.status(409).json({ message: 'Herói já está nos favoritos.' });
    }
    res.status(500).json({ error: 'Erro ao adicionar favorito no banco de dados.' });
  }
});

app.get('/favoritos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM favoritos ORDER BY name;');
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar favoritos:', err);
    res.status(500).json({ error: 'Erro ao buscar favoritos no banco de dados.' });
  }
});

app.get('/favoritos/:id', async (req, res) => {
  const idParam = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM favoritos WHERE id = $1;', [idParam]);
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Favorito não encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err)
 {
    console.error('Erro ao buscar favorito por ID:', err);
    res.status(500).json({ error: 'Erro ao buscar favorito no banco de dados.' });
  }
});

app.put('/favoritos/:id', async (req, res) => {
  const idParam = req.params.id;
  const { apelido } = req.body;

  if (apelido === undefined) {
    return res.status(400).json({ error: 'O campo "apelido" é obrigatório para atualização.' });
  }

  try {
    const result = await pool.query(
      'UPDATE favoritos SET apelido = $1 WHERE id = $2 RETURNING *;',
      [apelido.trim(), idParam]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Favorito não encontrado para atualizar.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao atualizar favorito:', err);
    res.status(500).json({ error: 'Erro ao atualizar favorito no banco de dados.' });
  }
});

app.delete('/favoritos/:id', async (req, res) => {
  const idParam = req.params.id;
  try {
    const result = await pool.query('DELETE FROM favoritos WHERE id = $1 RETURNING id;', [idParam]);
    if (result.rowCount === 0) {
      return res.status(404).json({ erro: 'Favorito não encontrado para deletar.' });
    }
    res.status(204).send();
  } catch (err) {
    console.error('Erro ao deletar favorito:', err);
    res.status(500).json({ error: 'Erro ao deletar favorito no banco de dados.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

pool.on('error', (err, client) => {
  console.error('Erro inesperado no cliente do pool ocioso', err);
  process.exit(-1);
});