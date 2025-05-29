require('dotenv').config({ path: 'cred.env' });
const { Pool } = require('pg');

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

const createTableQuery = `
CREATE TABLE IF NOT EXISTS favoritos (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image_url TEXT,
    biography JSONB,
    appearance JSONB,
    work JSONB,
    powerstats JSONB,
    apelido TEXT
);
`;

async function initializeDatabase() {
  let client;
  try {
    client = await pool.connect();
    await client.query(createTableQuery);
    console.log('Tabela "favoritos" verificada/criada com sucesso!');
  } catch (err) {
    console.error('Erro ao inicializar o banco de dados e criar a tabela "favoritos":', err);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
    console.log('Conexão com o banco de dados encerrada.');
  }
}

initializeDatabase();