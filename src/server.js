const express = require('express');
const cors = require('cors');
require('dotenv').config();

const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    mensagem: '🎮 API da Plataforma de Jogos está rodando!',
    orm: 'Prisma',
    endpoints: {
      jogos: '/api/jogos',
      usuarios: '/api/usuarios',
      avaliacoes: '/api/avaliacoes',
    },
  });
});

app.use('/api/jogos', require('./routes/jogosRoutes'));
app.use('/api/usuarios', require('./routes/usuariosRoutes'));
app.use('/api/avaliacoes', require('./routes/avaliacoesRoutes'));

// Middleware de erro (SEMPRE por último)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});