const jogosRepo = require('../repositories/jogosRepository');
const AppError = require('../errors/AppError');

module.exports = {
  async listar(req, res, next) {
    try {
      const { titulo, genero, page, limit, ordenar, direcao } = req.query;
      const resultado = await jogosRepo.listar({
        titulo: titulo || null,
        genero: genero || null,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        ordenar: ordenar || 'titulo',
        direcao: direcao || 'asc',
      });
      res.json(resultado);
    } catch (err) {
      next(err);
    }
  },

  async buscarPorId(req, res, next) {
    try {
      const jogo = await jogosRepo.buscarPorId(req.params.id);
      if (!jogo) throw new AppError('Jogo não encontrado', 404);
      res.json(jogo);
    } catch (err) {
      next(err);
    }
  },

  async criar(req, res, next) {
    try {
      const jogo = await jogosRepo.criar(req.body);
      res.status(201).json(jogo);
    } catch (err) {
      next(err);
    }
  },

  async atualizar(req, res, next) {
    try {
      const jogo = await jogosRepo.atualizar(req.params.id, req.body);
      res.json(jogo);
    } catch (err) {
      next(err);
    }
  },

  async remover(req, res, next) {
    try {
      const jogo = await jogosRepo.remover(req.params.id);
      res.json({ mensagem: 'Jogo removido com sucesso', jogo });
    } catch (err) {
      next(err);
    }
  },

  async topAvaliados(req, res, next) {
    try {
      const jogos = await jogosRepo.topAvaliados();
      res.json(jogos);
    } catch (err) {
      next(err);
    }
  },
};