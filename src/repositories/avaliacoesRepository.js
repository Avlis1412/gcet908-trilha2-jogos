const prisma = require('../config/prisma');

module.exports = {
  async registrar({ usuario_id, jogo_id, nota, comentario }) {
    // Transação: verifica usuário, verifica jogo e faz UPSERT
    return prisma.$transaction(async (tx) => {
      const usuario = await tx.usuario.findFirst({
        where: { id: usuario_id, deletedAt: null },
      });
      if (!usuario) {
        const err = new Error('Usuário não encontrado');
        err.statusCode = 404;
        throw err;
      }

      const jogo = await tx.jogo.findFirst({
        where: { id: jogo_id, deletedAt: null },
      });
      if (!jogo) {
        const err = new Error('Jogo não encontrado');
        err.statusCode = 404;
        throw err;
      }

      return tx.avaliacao.upsert({
        where: {
          usuarioId_jogoId: { usuarioId: usuario_id, jogoId: jogo_id },
        },
        update: { nota, comentario, deletedAt: null },
        create: { usuarioId: usuario_id, jogoId: jogo_id, nota, comentario },
      });
    });
  },

  async listarPorJogo(jogoId) {
    return prisma.avaliacao.findMany({
      where: { jogoId: Number(jogoId), deletedAt: null },
      include: {
        usuario: { select: { id: true, nome: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  },
};