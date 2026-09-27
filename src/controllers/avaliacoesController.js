const avaliacoesRepo = require('../repositories/avaliacoesRepository');

module.exports = {
  async registrar(req, res) {
    try {
      const avaliacao = await avaliacoesRepo.registrar(req.body);
      res.status(201).json(avaliacao);
    } catch (err) {
      res.status(400).json({ erro: err.message });
    }
  },

  async listarPorJogo(req, res) {
    try {
      const avaliacoes = await avaliacoesRepo.listarPorJogo(req.params.jogoId);
      res.json(avaliacoes);
    } catch (err) {
      res.status(500).json({ erro: err.message });
    }
  },
};