# Estrutura do Projeto

```
gcet908-trilha3-jogos/
├── database/
│   ├── queries.sql
│   ├── schema.sql
│   └── seed.sql
├── prisma/
│   ├── migrations/
│   │   ├── 20260928012333_initial_schema/
│   │   │   └── migration.sql
│   │   ├── 20260928014635_add_desconto_jogo/
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   ├── schema.prisma
│   └── seed.js
├── src/
│   ├── config/
│   │   ├── db.js
│   │   └── prisma.js
│   ├── controllers/
│   │   ├── avaliacoesController.js
│   │   ├── jogosController.js
│   │   └── usuariosController.js
│   ├── errors/
│   │   └── AppError.js
│   ├── middlewares/
│   │   └── errorHandler.js
│   ├── repositories/
│   │   ├── avaliacoesRepository.js
│   │   ├── jogosRepository.js
│   │   └── usuariosRepository.js
│   ├── routes/
│   │   ├── avaliacoesRoutes.js
│   │   ├── jogosRoutes.js
│   │   └── usuariosRoutes.js
│   └── server.js
├── .dockerignore
├── .env
├── .env.example
├── .gitignore
├── docker-compose.yml
├── package.json
├── package-lock.json
└── README.md
```

