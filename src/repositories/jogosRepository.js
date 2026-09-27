const db = require('../config/db');

module.exports = {
  async listar({ titulo, genero, page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;
    const sql = `
      SELECT 
        j.id, j.titulo, j.ano_lancamento, j.preco,
        d.nome AS desenvolvedora,
        array_agg(DISTINCT g.nome) AS generos
      FROM jogos j
      JOIN desenvolvedoras d ON j.desenvolvedora_id = d.id
      LEFT JOIN jogo_genero jg ON j.id = jg.jogo_id
      LEFT JOIN generos g ON jg.genero_id = g.id
      WHERE ($1::text IS NULL OR j.titulo ILIKE '%' || $1 || '%')
        AND ($2::text IS NULL OR g.nome = $2)
      GROUP BY j.id, j.titulo, j.ano_lancamento, j.preco, d.nome
      ORDER BY j.titulo ASC
      LIMIT $3 OFFSET $4;
    `;
    const { rows } = await db.query(sql, [titulo, genero, limit, offset]);
    return rows;
  },

  async buscarPorId(id) {
    const sql = `
      SELECT 
        j.id, j.titulo, j.ano_lancamento, j.preco,
        d.nome AS desenvolvedora,
        array_agg(DISTINCT g.nome) AS generos,
        array_agg(DISTINCT p.nome) AS plataformas,
        COALESCE(ROUND(AVG(a.nota), 2), 0) AS media_avaliacoes,
        COUNT(DISTINCT a.id) AS total_avaliacoes
      FROM jogos j
      JOIN desenvolvedoras d ON j.desenvolvedora_id = d.id
      LEFT JOIN jogo_genero jg ON j.id = jg.jogo_id
      LEFT JOIN generos g ON jg.genero_id = g.id
      LEFT JOIN jogo_plataforma jp ON j.id = jp.jogo_id
      LEFT JOIN plataformas p ON jp.plataforma_id = p.id
      LEFT JOIN avaliacoes a ON j.id = a.jogo_id
      WHERE j.id = $1
      GROUP BY j.id, j.titulo, j.ano_lancamento, j.preco, d.nome;
    `;
    const { rows } = await db.query(sql, [id]);
    return rows[0];
  },

  async criar({ titulo, ano_lancamento, preco, desenvolvedora_id }) {
    const sql = `
      INSERT INTO jogos (titulo, ano_lancamento, preco, desenvolvedora_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const { rows } = await db.query(sql, [titulo, ano_lancamento, preco, desenvolvedora_id]);
    return rows[0];
  },

  async atualizar(id, { titulo, ano_lancamento, preco, desenvolvedora_id }) {
    const sql = `
      UPDATE jogos
      SET titulo = $1, ano_lancamento = $2, preco = $3, desenvolvedora_id = $4
      WHERE id = $5
      RETURNING *;
    `;
    const { rows } = await db.query(sql, [titulo, ano_lancamento, preco, desenvolvedora_id, id]);
    return rows[0];
  },

  async remover(id) {
    const sql = `DELETE FROM jogos WHERE id = $1 RETURNING *;`;
    const { rows } = await db.query(sql, [id]);
    return rows[0];
  },

  async topAvaliados() {
    const sql = `
      SELECT 
        j.titulo,
        ROUND(AVG(a.nota), 2) AS media_nota,
        COUNT(a.id) AS total_avaliacoes
      FROM jogos j
      JOIN avaliacoes a ON j.id = a.jogo_id
      GROUP BY j.id, j.titulo
      HAVING COUNT(a.id) >= 2
      ORDER BY media_nota DESC, total_avaliacoes DESC
      LIMIT 5;
    `;
    const { rows } = await db.query(sql);
    return rows;
  },
};