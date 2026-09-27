const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    mensagem: '🎮 API da Plataforma de Jogos está rodando!',
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

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});