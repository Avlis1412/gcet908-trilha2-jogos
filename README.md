# 🎮 GCET908 - Trilha 02: Plataforma de Jogos (Prisma ORM)

API REST completa para uma **Plataforma de Jogos** (estilo Steam), com modelagem relacional, migrations versionadas via **Prisma ORM** e persistência em **PostgreSQL**. Desenvolvida para o **Trabalho 2** da disciplina **GCET908 — Desenvolvimento de Software II**.

---

## 🎯 Objetivo

Evoluir a API do Trabalho 1 (SQL puro) para utilizar **Prisma ORM**, com schema versionado por migrations, seed reprodutível e tratamento adequado de erros de integridade.

---

## 🗂️ Estrutura do Projeto

```
gcet908-trilha2-jogos/
├── database/                    # Scripts SQL do Trabalho 1 (referência histórica)
│   ├── schema.sql
│   ├── seed.sql
│   └── queries.sql
├── prisma/
│   ├── migrations/              # Migrations versionadas
│   │   ├── ..._initial_schema/
│   │   └── ..._add_desconto_jogo/
│   ├── schema.prisma            # Fonte da verdade do modelo
│   └── seed.js                  # Seed com 10+ registros por tabela
├── src/
│   ├── config/
│   │   └── prisma.js            # Cliente Prisma com log de queries
│   ├── errors/
│   │   └── AppError.js          # Erro customizado
│   ├── middlewares/
│   │   └── errorHandler.js      # Tradução de erros do Prisma → HTTP
│   ├── repositories/            # Acesso a dados via Prisma Client
│   ├── controllers/             # Lógica dos endpoints
│   ├── routes/                  # Rotas da API
│   └── server.js                # Express configurado
├── docker-compose.yml           # Bônus: banco executável em container
├── .env.example
├── package.json
└── README.md
```

---

## 🗺️ Diagrama Entidade-Relacionamento (DER)

```mermaid
erDiagram
    DESENVOLVEDORA ||--o{ JOGO : desenvolve
    JOGO ||--o{ JOGO_GENERO : pertence
    GENERO ||--o{ JOGO_GENERO : classifica
    JOGO ||--o{ JOGO_PLATAFORMA : disponivel
    PLATAFORMA ||--o{ JOGO_PLATAFORMA : hospeda
    USUARIO ||--o{ BIBLIOTECA : possui
    JOGO ||--o{ BIBLIOTECA : esta_em
    USUARIO ||--o{ AVALIACAO : avalia
    JOGO ||--o{ AVALIACAO : recebe

    DESENVOLVEDORA {
        int id PK
        string nome UK
        string pais
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }
    JOGO {
        int id PK
        string titulo
        int ano_lancamento
        decimal preco
        decimal desconto
        string descricao
        int desenvolvedora_id FK
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }
    GENERO {
        int id PK
        string nome UK
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }
    PLATAFORMA {
        int id PK
        string nome UK
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }
    JOGO_GENERO {
        int jogo_id PK,FK
        int genero_id PK,FK
    }
    JOGO_PLATAFORMA {
        int jogo_id PK,FK
        int plataforma_id PK,FK
    }
    USUARIO {
        int id PK
        string nome
        string email UK
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }
    BIBLIOTECA {
        int id PK
        int usuario_id FK
        int jogo_id FK
        decimal horas_jogadas
        datetime data_aquisicao
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }
    AVALIACAO {
        int id PK
        int usuario_id FK
        int jogo_id FK
        int nota
        string comentario
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }
```

---

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- Git

### 1. Clonar e instalar

```bash
git clone https://github.com/Avlis1412/gcet908-trilha2-jogos.git
cd gcet908-trilha2-jogos
npm install
```

### 2. Configurar o `.env`

Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

Edite com suas credenciais:

```env
PORT=3000
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/jogos_db?schema=public"
```

### 3. Criar o banco

```sql
CREATE DATABASE jogos_db;
```

### 4. Rodar as migrations

```bash
npx prisma migrate dev
```

Isso aplica **todas as migrations versionadas** e gera o Prisma Client.

### 5. Popular o banco (seed)

```bash
npx prisma db seed
```

Saída esperada:

```
🌱 Iniciando seed...
✅ Seed concluído: {
  desenvolvedoras: 10,
  generos: 10,
  plataformas: 10,
  usuarios: 10,
  jogos: 12,
  bibliotecas: 15,
  avaliacoes: 19
}
```

### 6. Rodar a API

```bash
npm run dev
```

Saída esperada:

```
🚀 Servidor rodando em http://localhost:3000
prisma:info Starting a postgresql pool with 9 connections.
```

---

## 🐳 Alternativa com Docker (bônus)

Se preferir, suba o banco via Docker Compose:

```bash
docker compose up -d
```

Isso cria um PostgreSQL 16 na porta 5432 com usuário `postgres`, senha `postgres` e banco `jogos_db`.

---

## 📡 Endpoints

### 🎮 Jogos

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/jogos` | Lista com paginação, filtro e ordenação |
| GET | `/api/jogos/:id` | Detalhes com relacionamentos |
| GET | `/api/jogos/top-avaliados` | Top 5 (via SQL puro) |
| POST | `/api/jogos` | Cria jogo |
| PUT | `/api/jogos/:id` | Atualiza jogo |
| DELETE | `/api/jogos/:id` | Soft delete (deleted_at) |

**Filtros e ordenação:**

```
GET /api/jogos?titulo=zelda&genero=Aventura&page=1&limit=5&ordenar=preco&direcao=desc
```

**Body de criação:**

```json
{
  "titulo": "Hollow Knight",
  "ano_lancamento": 2017,
  "preco": 46.99,
  "desenvolvedora_id": 9,
  "descricao": "Metroidvania indie"
}
```

### 👤 Usuários

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/usuarios` | Lista usuários |
| GET | `/api/usuarios/:id` | Busca por ID |
| GET | `/api/usuarios/:id/biblioteca` | Biblioteca do usuário |
| POST | `/api/usuarios` | Cria usuário |
| PUT | `/api/usuarios/:id` | Atualiza |
| DELETE | `/api/usuarios/:id` | Soft delete |

### ⭐ Avaliações

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/avaliacoes` | Registra/atualiza avaliação (UPSERT transacional) |
| GET | `/api/avaliacoes/jogo/:jogoId` | Avaliações de um jogo |

---

## ⚙️ Boas Práticas Aplicadas

### ORM e Migrations
- **Schema declarativo** (`schema.prisma`) como fonte da verdade
- **2 migrations versionadas**: `initial_schema` e `add_desconto_jogo`
- **Seed generoso** com 10+ registros por tabela principal
- **Prisma Client** gerado automaticamente

### Integridade e Transações
- **Validação de FK** antes de criar avaliações (transação)
- **UPSERT** com `ON CONFLICT` para avaliações idempotentes
- **Soft delete** via `deletedAt` — bonificação
- **Erros do Prisma traduzidos**: P2002 → 409, P2003 → 409, P2025 → 404

### Performance
- **Log de SQL ativado** (`log: ['query']`) — todas as queries visíveis
- **Batching automático** do Prisma (evita N+1)
- **Índices** em `titulo`, `desenvolvedora_id`, `usuario_id`, `jogo_id`
- **Paginação real** no banco (`skip`/`take`)
- **Filtros dinâmicos** aplicados no SQL (não em memória)

### Arquitetura
- **Separação em camadas**: routes → controllers → repositories
- **Controllers enxutos** (não contêm SQL)
- **Middleware de erro** centralizado
- **AppError** para erros de negócio

### Auditoria
- `created_at`, `updated_at` (com `@updatedAt`) e `deleted_at` em todas as tabelas principais

---

## 🧪 Testando Erros de Integridade

**UNIQUE violation (409):**
```bash
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste","email":"ana@email.com"}'
```
→ `{"erro":"Valor duplicado no campo: email","tipo":"unique_violation"}`

**FK violation (409):**
```bash
curl -X POST http://localhost:3000/api/jogos \
  -H "Content-Type: application/json" \
  -d '{"titulo":"X","ano_lancamento":2024,"preco":10,"desenvolvedora_id":99999}'
```
→ `{"erro":"Operação viola integridade referencial","tipo":"foreign_key_violation"}`

**404:**
```bash
curl http://localhost:3000/api/jogos/99999
```
→ `{"erro":"Jogo não encontrado","tipo":"app_error"}`

---

## 🛠️ Tecnologias

| Camada | Tecnologia |
|--------|------------|
| Banco | PostgreSQL 16 |
| ORM | **Prisma 6.19.3** |
| Runtime | Node.js 18+ |
| Framework | Express |
| Dev | nodemon |
| Container | Docker Compose |

---

## 👤 Autor

**Adriano Rodrigues da Silva**
- Matrícula: 2025133735
- Curso: Licenciatura em Computação (EaD/UAB) — UFRB
- Disciplina: GCET908 — Desenvolvimento de Software II
- Professor: Tássio Valle

---

## 📄 Licença

Projeto acadêmico desenvolvido para a disciplina GCET908.