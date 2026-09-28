const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

router.get('/', usuariosController.listar);
router.post('/', usuariosController.criar);
router.get('/:id', usuariosController.buscarPorId);
router.get('/:id/biblioteca', usuariosController.biblioteca);
router.put('/:id', usuariosController.atualizar);
router.delete('/:id', usuariosController.remover);

module.exports = router;