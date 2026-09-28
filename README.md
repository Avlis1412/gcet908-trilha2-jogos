# 🎮 GCET908 - Trilha 02: Plataforma de Jogos

API REST completa para uma Plataforma de Jogos (estilo Steam), com modelagem relacional e persistência em PostgreSQL, desenvolvida como parte da disciplina GCET908 — Desenvolvimento de Software II.

---

## 🎯 Objetivo

Projetar um modelo relacional adequado ao domínio de jogos, escrever consultas SQL corretas e eficientes, e implementar uma API Node.js/Express que se conecta ao banco de dados para executar operações de persistência (CRUD).

---

## 🗂️ Estrutura do Projeto

gcet908-trilha2-jogos/
│
├── database/                     # Scripts SQL
│   ├── schema.sql               # DDL: tabelas, índices, constraints
│   ├── seed.sql                 # DML: dados iniciais para testes
│   └── queries.sql              # Consultas de referência
│
├── src/                          # Código da API
│   ├── config/
│   │   └── db.js                # Conexão com PostgreSQL (Pool)
│   ├── repositories/            # SQL puro parametrizado
│   │   ├── jogosRepository.js
│   │   ├── usuariosRepository.js
│   │   └── avaliacoesRepository.js
│   ├── controllers/             # Lógica dos endpoints
│   │   ├── jogosController.js
│   │   ├── usuariosController.js
│   │   └── avaliacoesController.js
│   ├── routes/                  # Definição das rotas
│   │   ├── jogosRoutes.js
│   │   ├── usuariosRoutes.js
│   │   └── avaliacoesRoutes.js
│   └── server.js                # Ponto de entrada Express
│
├── .env.example                  # Exemplo de variáveis de ambiente
├── .gitignore
├── package.json
└── README.md

---

## 🗺️ Modelo Relacional (DER)

O domínio é composto pelas seguintes entidades e relacionamentos:

- Desenvolvedora (1:N) Jogo
- Jogo (N:N) Gênero — tabela associativa jogo_genero
- Jogo (N:N) Plataforma — tabela associativa jogo_plataforma
- Usuário (1:N) Biblioteca (N:N com Jogo, com atributos horas_jogadas e data_aquisicao)
- Usuário (1:N) Avaliação (N:N com Jogo, com nota e comentario)

---

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- Git

### 1. Clonar o repositório

git clone https://github.com/Avlis1412/gcet908-trilha2-jogos.git
cd gcet908-trilha2-jogos

### 2. Configurar o banco de dados

Crie o banco no PostgreSQL:

CREATE DATABASE jogos_db;

Abra o Query Tool do pgAdmin conectado ao banco jogos_db e execute, na ordem:

1. database/schema.sql — cria as tabelas, índices e constraints
2. database/seed.sql — popula o banco com dados de teste

### 3. Configurar variáveis de ambiente

Copie o arquivo de exemplo:

cp .env.example .env

Edite o .env com suas credenciais:

PORT=3000
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/jogos_db"

### 4. Instalar dependências

npm install

### 5. Rodar a API

npm run dev

Saída esperada:

✅ Conectado ao PostgreSQL (jogos_db)
🚀 Servidor rodando em http://localhost:3000

---

## 📡 Endpoints da API

### 🎮 Jogos

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/jogos | Lista jogos (com filtro titulo, genero e paginação page, limit) |
| GET | /api/jogos/:id | Detalhes de um jogo (com gêneros, plataformas e média de avaliações) |
| GET | /api/jogos/top-avaliados | Top 5 jogos mais bem avaliados |
| POST | /api/jogos | Cria novo jogo |
| PUT | /api/jogos/:id | Atualiza jogo |
| DELETE | /api/jogos/:id | Remove jogo |

Exemplo de body (POST/PUT):

{
  "titulo": "Hollow Knight",
  "ano_lancamento": 2017,
  "preco": 46.99,
  "desenvolvedora_id": 1
}

### 👤 Usuários

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/usuarios | Lista usuários |
| GET | /api/usuarios/:id/biblioteca | Lista jogos da biblioteca do usuário |

### ⭐ Avaliações

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /api/avaliacoes | Registra ou atualiza avaliação (UPSERT via ON CONFLICT) |
| GET | /api/avaliacoes/jogo/:jogoId | Lista avaliações de um jogo |

Exemplo de body (POST):

{
  "usuario_id": 1,
  "jogo_id": 3,
  "nota": 5,
  "comentario": "Excelente RPG!"
}

---

## ⚙️ Boas Práticas Aplicadas

### 🔒 Segurança

- Consultas parametrizadas ($1, $2, ...) — proteção contra SQL Injection
- Variáveis de ambiente — credenciais fora do código-fonte
- .env no .gitignore — senha nunca vai para o repositório

### 🚀 Performance

- Pool de conexões (pg.Pool) — reutilização de conexões
- Índices em colunas de busca (titulo) e chaves estrangeiras
- Paginação com LIMIT/OFFSET (evita carregar tudo de uma vez)
- Filtros dinâmicos com WHERE ($1::text IS NULL OR ...) — um único SQL serve para várias combinações

### 🏗️ Arquitetura

- Separação em camadas: routes → controllers → repositories
- Tratamento de erros centralizado no server.js
- Repository pattern — isola o SQL do restante do código
- UPSERT com ON CONFLICT para operações idempotentes

### 🗄️ Banco de Dados

- Constraints: CHECK, UNIQUE, NOT NULL, FOREIGN KEY
- ON DELETE CASCADE em tabelas dependentes
- TIMESTAMPTZ para auditoria (criado_em, data_aquisicao)
- NUMERIC(10,2) para valores monetários (precisão exata)

---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologia |
|--------|------------|
| Banco de Dados | PostgreSQL 14 |
| Linguagem SQL | DDL, DML, DQL |
| Runtime | Node.js 18+ |
| Framework Web | Express |
| Driver PostgreSQL | pg |
| Variáveis de Ambiente | dotenv |
| CORS | cors |
| Dev | nodemon |
| Versionamento | Git & GitHub |

---

## 📸 Evidências de Execução

- ✅ Conexão com jogos_db estabelecida
- ✅ Endpoints testados no navegador (listagem, busca por ID, top avaliados, biblioteca)
- ✅ Push realizado para o GitHub

---

## 📌 Próximos Passos (Trabalho 2)

- Refatorar a API para utilizar Prisma ORM (Videoaula 4)
- Comparar as abordagens: SQL puro vs ORM
- Analisar trade-offs de produtividade e desempenho

---

## 👤 Autor

Adriano Rodrigues da Silva

- Matrícula: 2025133735
- Curso: Licenciatura em Computação (EaD/UAB)
- Instituição: UFRB — Universidade Federal do Recôncavo da Bahia
- Disciplina: GCET908 — Desenvolvimento de Software II
- Professor: Tássio Valle

---

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos na disciplina GCET908.