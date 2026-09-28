const usuariosRepo = require('../repositories/usuariosRepository');
const AppError = require('../errors/AppError');

module.exports = {
  async listar(req, res, next) {
    try {
      const usuarios = await usuariosRepo.listar();
      res.json(usuarios);
    } catch (err) {
      next(err);
    }
  },

  async buscarPorId(req, res, next) {
    try {
      const usuario = await usuariosRepo.buscarPorId(req.params.id);
      if (!usuario) throw new AppError('Usuário não encontrado', 404);
      res.json(usuario);
    } catch (err) {
      next(err);
    }
  },

  async biblioteca(req, res, next) {
    try {
      const usuario = await usuariosRepo.buscarPorId(req.params.id);
      if (!usuario) throw new AppError('Usuário não encontrado', 404);
      const jogos = await usuariosRepo.biblioteca(req.params.id);
      res.json(jogos);
    } catch (err) {
      next(err);
    }
  },

  async criar(req, res, next) {
    try {
      const usuario = await usuariosRepo.criar(req.body);
      res.status(201).json(usuario);
    } catch (err) {
      next(err);
    }
  },

  async atualizar(req, res, next) {
    try {
      const usuario = await usuariosRepo.atualizar(req.params.id, req.body);
      res.json(usuario);
    } catch (err) {
      next(err);
    }
  },

  async remover(req, res, next) {
    try {
      await usuariosRepo.remover(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};