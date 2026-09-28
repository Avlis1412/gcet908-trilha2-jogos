const avaliacoesRepo = require('../repositories/avaliacoesRepository');

module.exports = {
  async registrar(req, res, next) {
    try {
      const avaliacao = await avaliacoesRepo.registrar(req.body);
      res.status(201).json(avaliacao);
    } catch (err) {
      next(err);
    }
  },

  async listarPorJogo(req, res, next) {
    try {
      const avaliacoes = await avaliacoesRepo.listarPorJogo(req.params.jogoId);
      res.json(avaliacoes);
    } catch (err) {
      next(err);
    }
  },
};