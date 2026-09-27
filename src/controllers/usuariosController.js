const usuariosRepo = require('../repositories/usuariosRepository');

module.exports = {
  async listar(req, res) {
    try {
      const usuarios = await usuariosRepo.listar();
      res.json(usuarios);
    } catch (err) {
      res.status(500).json({ erro: err.message });
    }
  },

  async biblioteca(req, res) {
    try {
      const jogos = await usuariosRepo.biblioteca(req.params.id);
      res.json(jogos);
    } catch (err) {
      res.status(500).json({ erro: err.message });
    }
  },
};