const jogosRepo = require('../repositories/jogosRepository');

module.exports = {
  async listar(req, res) {
    try {
      const { titulo, genero, page, limit } = req.query;
      const jogos = await jogosRepo.listar({
        titulo: titulo || null,
        genero: genero || null,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
      });
      res.json(jogos);
    } catch (err) {
      res.status(500).json({ erro: err.message });
    }
  },

  async buscarPorId(req, res) {
    try {
      const jogo = await jogosRepo.buscarPorId(req.params.id);
      if (!jogo) return res.status(404).json({ erro: 'Jogo não encontrado' });
      res.json(jogo);
    } catch (err) {
      res.status(500).json({ erro: err.message });
    }
  },

  async criar(req, res) {
    try {
      const jogo = await jogosRepo.criar(req.body);
      res.status(201).json(jogo);
    } catch (err) {
      res.status(400).json({ erro: err.message });
    }
  },

  async atualizar(req, res) {
    try {
      const jogo = await jogosRepo.atualizar(req.params.id, req.body);
      if (!jogo) return res.status(404).json({ erro: 'Jogo não encontrado' });
      res.json(jogo);
    } catch (err) {
      res.status(400).json({ erro: err.message });
    }
  },

  async remover(req, res) {
    try {
      const jogo = await jogosRepo.remover(req.params.id);
      if (!jogo) return res.status(404).json({ erro: 'Jogo não encontrado' });
      res.json({ mensagem: 'Jogo removido com sucesso', jogo });
    } catch (err) {
      res.status(500).json({ erro: err.message });
    }
  },

  async topAvaliados(req, res) {
    try {
      const jogos = await jogosRepo.topAvaliados();
      res.json(jogos);
    } catch (err) {
      res.status(500).json({ erro: err.message });
    }
  },
};