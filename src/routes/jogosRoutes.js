const express = require('express');
const router = express.Router();
const jogosController = require('../controllers/jogosController');

router.get('/', jogosController.listar);
router.get('/top-avaliados', jogosController.topAvaliados);
router.get('/:id', jogosController.buscarPorId);
router.post('/', jogosController.criar);
router.put('/:id', jogosController.atualizar);
router.delete('/:id', jogosController.remover);

module.exports = router;