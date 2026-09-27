const db = require('../config/db');

module.exports = {
  async listar() {
    const { rows } = await db.query('SELECT id, nome, email FROM usuarios ORDER BY nome;');
    return rows;
  },

  async biblioteca(usuarioId) {
    const sql = `
      SELECT 
        j.titulo,
        b.horas_jogadas,
        b.data_aquisicao,
        d.nome AS desenvolvedora
      FROM bibliotecas b
      JOIN jogos j ON b.jogo_id = j.id
      JOIN desenvolvedoras d ON j.desenvolvedora_id = d.id
      WHERE b.usuario_id = $1
      ORDER BY b.data_aquisicao DESC;
    `;
    const { rows } = await db.query(sql, [usuarioId]);
    return rows;
  },
};