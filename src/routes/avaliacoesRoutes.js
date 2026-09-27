const express = require('express');
const router = express.Router();
const avaliacoesController = require('../controllers/avaliacoesController');

router.post('/', avaliacoesController.registrar);
router.get('/jogo/:jogoId', avaliacoesController.listarPorJogo);

module.exports = router;