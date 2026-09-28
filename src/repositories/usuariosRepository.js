const prisma = require('../config/prisma');

module.exports = {
  async listar() {
    return prisma.usuario.findMany({
      where: { deletedAt: null },
      select: { id: true, nome: true, email: true, createdAt: true },
      orderBy: { nome: 'asc' },
    });
  },

  async buscarPorId(id) {
    return prisma.usuario.findFirst({
      where: { id: Number(id), deletedAt: null },
    });
  },

  async biblioteca(usuarioId) {
    return prisma.biblioteca.findMany({
      where: { usuarioId: Number(usuarioId), deletedAt: null },
      include: {
        jogo: {
          include: { desenvolvedora: true },
        },
      },
      orderBy: { dataAquisicao: 'desc' },
    });
  },

  async criar({ nome, email }) {
    return prisma.usuario.create({ data: { nome, email } });
  },

  async atualizar(id, { nome, email }) {
    return prisma.usuario.update({
      where: { id: Number(id) },
      data: { nome, email },
    });
  },

  async remover(id) {
    return prisma.usuario.update({
      where: { id: Number(id) },
      data: { deletedAt: new Date() },
    });
  },
};