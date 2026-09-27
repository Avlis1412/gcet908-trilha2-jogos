const db = require('../config/db');

module.exports = {
  async registrar({ usuario_id, jogo_id, nota, comentario }) {
    const sql = `
      INSERT INTO avaliacoes (usuario_id, jogo_id, nota, comentario)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (usuario_id, jogo_id) 
      DO UPDATE SET 
        nota = EXCLUDED.nota,
        comentario = EXCLUDED.comentario,
        criado_em = now()
      RETURNING *;
    `;
    const { rows } = await db.query(sql, [usuario_id, jogo_id, nota, comentario]);
    return rows[0];
  },

  async listarPorJogo(jogoId) {
    const sql = `
      SELECT a.id, a.nota, a.comentario, a.criado_em, u.nome AS usuario
      FROM avaliacoes a
      JOIN usuarios u ON a.usuario_id = u.id
      WHERE a.jogo_id = $1
      ORDER BY a.criado_em DESC;
    `;
    const { rows } = await db.query(sql, [jogoId]);
    return rows;
  },
};