const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

router.get('/', usuariosController.listar);
router.get('/:id/biblioteca', usuariosController.biblioteca);

module.exports = router;