const prisma = require('../config/prisma');

const ORDERABLE_FIELDS = ['titulo', 'preco', 'anoLancamento', 'createdAt'];

module.exports = {
  async listar({ titulo, genero, page = 1, limit = 10, ordenar = 'titulo', direcao = 'asc' }) {
    const skip = (page - 1) * limit;
    const orderField = ORDERABLE_FIELDS.includes(ordenar) ? ordenar : 'titulo';
    const orderDir = direcao === 'desc' ? 'desc' : 'asc';

    const where = {
      deletedAt: null,
      ...(titulo && { titulo: { contains: titulo, mode: 'insensitive' } }),
      ...(genero && { generos: { some: { genero: { nome: genero } } } }),
    };

    const [jogos, total] = await prisma.$transaction([
      prisma.jogo.findMany({
        where,
        include: {
          desenvolvedora: true,
          generos: { include: { genero: true } },
        },
        orderBy: { [orderField]: orderDir },
        skip,
        take: limit,
      }),
      prisma.jogo.count({ where }),
    ]);

    return { dados: jogos, total, page, limit };
  },

  async buscarPorId(id) {
    return prisma.jogo.findFirst({
      where: { id: Number(id), deletedAt: null },
      include: {
        desenvolvedora: true,
        generos: { include: { genero: true } },
        plataformas: { include: { plataforma: true } },
        avaliacoes: {
          where: { deletedAt: null },
          include: { usuario: { select: { id: true, nome: true } } },
        },
      },
    });
  },

  async criar({ titulo, ano_lancamento, preco, desenvolvedora_id, descricao }) {
    return prisma.jogo.create({
      data: {
        titulo,
        anoLancamento: ano_lancamento,
        preco,
        descricao,
        desenvolvedoraId: desenvolvedora_id,
      },
    });
  },

  async atualizar(id, { titulo, ano_lancamento, preco, desenvolvedora_id, descricao }) {
    return prisma.jogo.update({
      where: { id: Number(id) },
      data: {
        titulo,
        anoLancamento: ano_lancamento,
        preco,
        descricao,
        desenvolvedoraId: desenvolvedora_id,
      },
    });
  },

  // Soft delete
  async remover(id) {
    return prisma.jogo.update({
      where: { id: Number(id) },
      data: { deletedAt: new Date() },
    });
  },

  // Híbrido: SQL puro via $queryRaw (demonstra maturidade)
  async topAvaliados() {
    return prisma.$queryRaw`
      SELECT j.id, j.titulo,
             ROUND(AVG(a.nota), 2)::float AS media_nota,
             COUNT(a.id)::int AS total_avaliacoes
      FROM jogos j
      JOIN avaliacoes a ON j.id = a.jogo_id
      WHERE j.deleted_at IS NULL AND a.deleted_at IS NULL
      GROUP BY j.id, j.titulo
      HAVING COUNT(a.id) >= 2
      ORDER BY media_nota DESC, total_avaliacoes DESC
      LIMIT 5
    `;
  },
};