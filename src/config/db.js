const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => console.log('✅ Conectado ao PostgreSQL (jogos_db)'))
  .catch((err) => console.error('❌ Erro ao conectar ao banco:', err.message));

module.exports = {
  query: (text, params) => pool.query(text, params),
};