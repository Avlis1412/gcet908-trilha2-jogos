# GCET908 - Refatoração da API em Camadas

API REST de uma **Plataforma de Jogos** refatorada para uma **arquitetura em camadas** com separação clara de responsabilidades, aplicando o padrão **MVC** no ambiente web. Desenvolvida para o **Trabalho 3** da disciplina **GCET908 — Desenvolvimento de Software II**.

O objetivo central é **reduzir o acoplamento** entre as partes do sistema e **aumentar a testabilidade** do código, isolando cada responsabilidade em sua própria camada.

---

## Objetivo

Atender ao requisito: *"Separar rotas, controladores, serviços e repositórios, reduzindo o acoplamento e aumentando a testabilidade do código."*

A API mantém **comportamento externo idêntico** à versão anterior (Trabalho 2) — os endpoints continuam funcionando da mesma forma. O que muda é a **organização interna** do código.

---

## Arquitetura em Camadas

O projeto está organizado em camadas com responsabilidades bem definidas:

```text
HTTP → routes → controllers → services → repositories → PostgreSQL
```

| Camada | Responsabilidade | Não faz |
|---|---|---|
| `routes/` | Define URLs e delega para controllers | Lógica de negócio |
| `controllers/` | Traduz HTTP ↔ domínio (lê `req`, chama service, responde `res`) | Regras de negócio, SQL |
| `services/` | Contém regras de negócio e orquestração | Conhecer HTTP (`req`/`res`) |
| `repositories/` | Isola o acesso ao Prisma | Regras de negócio |
| `middlewares/` | Preocupações transversais (erros) | Lógica de negócio |

### Diagrama das Camadas

```mermaid
flowchart TD
    Cliente([Cliente HTTP])
    Routes[Routes<br/>Definição de URLs]
    Controllers[Controllers<br/>Tradução HTTP ↔ Domínio]
    Services[Services<br/>Regras de Negócio]
    Repositories[Repositories<br/>Acesso a Dados]
    Prisma[(Prisma ORM)]
    DB[(PostgreSQL)]
    Middleware[Middleware de Erros<br/>Preocupação Transversal]

    Cliente -->|requisição| Routes
    Routes --> Controllers
    Controllers --> Services
    Services --> Repositories
    Repositories --> Prisma
    Prisma --> DB
    DB -.resposta.-> Prisma
    Prisma -.resposta.-> Repositories
    Repositories -.resposta.-> Services
    Services -.resposta.-> Controllers
    Controllers -.resposta.-> Routes
    Routes -.resposta.-> Cliente

    Controllers -.erro.-> Middleware
    Services -.erro.-> Middleware
    Repositories -.erro.-> Middleware
    Middleware -.resposta de erro.-> Cliente

    style Cliente fill:#4A90E2,color:#fff
    style Routes fill:#7B68EE,color:#fff
    style Controllers fill:#50C878,color:#fff
    style Services fill:#FFB84D,color:#000
    style Repositories fill:#E85D75,color:#fff
    style Prisma fill:#9B59B6,color:#fff
    style DB fill:#34495E,color:#fff
    style Middleware fill:#95A5A6,color:#fff
```

### Regra fundamental

**Nenhuma camada acessa outra pulando níveis.** O controller não fala com o repository diretamente; o service não conhece `req` nem `res`. Cada camada só conhece a camada imediatamente abaixo.

---

## Estrutura do Projeto

```text
gcet908-trilha3-jogos-API em camadas/
├── database/                     # Scripts SQL de referência
│   ├── schema.sql
│   ├── seed.sql
│   └── queries.sql
├── prisma/
│   ├── migrations/               # Migrations versionadas
│   ├── schema.prisma             # Fonte da verdade do modelo
│   └── seed.js                   # Seed reprodutível
├── src/
│   ├── config/
│   │   ├── db.js                 # Configuração do banco
│   │   └── prisma.js             # Cliente Prisma (Singleton)
│   ├── controllers/              # Tradução HTTP ↔ domínio
│   │   ├── jogosController.js
│   │   ├── usuariosController.js
│   │   └── avaliacoesController.js
│   ├── errors/                   # Erros customizados
│   │   └── AppError.js
│   ├── middlewares/              # Preocupações transversais
│   │   └── errorHandler.js
│   ├── repositories/             # Acesso a dados isolado
│   │   ├── jogosRepository.js
│   │   ├── usuariosRepository.js
│   │   └── avaliacoesRepository.js
│   ├── routes/                   # Definição de rotas HTTP
│   │   ├── jogosRoutes.js
│   │   ├── usuariosRoutes.js
│   │   └── avaliacoesRoutes.js
│   ├── services/                 # Regras de negócio
│   │   ├── jogosService.js
│   │   ├── usuariosService.js
│   │   └── avaliacoesService.js
│   └── server.js                 # Ponto de entrada
├── .dockerignore
├── .env.example
├── .gitignore
├── docker-compose.yml
├── ESTRUTURA.md
├── package.json
├── package-lock.json
└── README.md
```

---

## Fluxo Completo de uma Requisição

Exemplo: `POST /api/jogos` com um JSON no corpo.

```mermaid
sequenceDiagram
    participant C as Cliente
    participant R as Routes
    participant CT as Controller
    participant S as Service
    participant RP as Repository
    participant P as Prisma
    participant D as PostgreSQL

    C->>R: POST /api/jogos {dados}
    R->>CT: jogosController.criar
    CT->>CT: valida req.body
    CT->>S: jogosService.criar(dados)
    S->>S: aplica regras de negócio
    S->>RP: jogosRepository.criar(dados)
    RP->>P: prisma.jogo.create(...)
    P->>D: INSERT INTO jogos
    D-->>P: registro criado
    P-->>RP: objeto Jogo
    RP-->>S: objeto Jogo
    S-->>CT: objeto Jogo
    CT-->>R: res.status(201).json(jogo)
    R-->>C: 201 Created + JSON

    Note over CT,D: Se qualquer etapa lançar erro,<br/>o middleware de erro captura e formata a resposta
```

### Passo a passo

1. **Routes** recebe a URL e chama o controller correspondente
2. **Controller** extrai dados da requisição (`req.body`) e chama o service
3. **Service** aplica regras de negócio e chama o repository
4. **Repository** executa a query via Prisma
5. O caminho se inverte para montar a resposta
6. Se algo falhar, o **middleware de erro** captura, formata e devolve uma resposta consistente

---

## Benefícios da Refatoração

| Benefício | Como é alcançado |
|---|---|
| **Baixo acoplamento** | Cada camada conhece apenas a imediatamente abaixo |
| **Testabilidade** | Services podem ser testados isoladamente, sem HTTP nem banco real |
| **Manutenibilidade** | Mudar o ORM exige alterar apenas os repositories |
| **Reusabilidade** | O mesmo service pode ser chamado por CLI, jobs ou outros controllers |
| **Separação de preocupações** | Cada arquivo tem uma responsabilidade única e clara |

---

## Como Executar

### Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- Git

### 1. Clonar e instalar

```bash
git clone <URL-DO-REPOSITORIO>
cd "gcet908-trilha3-jogos- API em camadas"
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
NODE_ENV=development
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

### 5. Popular o banco (seed)

```bash
npx prisma db seed
```

### 6. Rodar a API

```bash
npm run dev
```

### 7. Testar

```bash
curl.exe http://localhost:3000/api/jogos
curl.exe http://localhost:3000/api/usuarios
curl.exe http://localhost:3000/api/avaliacoes/jogo/1
```

---

## Endpoints

### Jogos

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/jogos` | Lista todos os jogos |
| GET | `/api/jogos/:id` | Detalhes de um jogo |
| POST | `/api/jogos` | Cria um jogo |
| PUT | `/api/jogos/:id` | Atualiza um jogo |
| DELETE | `/api/jogos/:id` | Remove um jogo |

### Usuários

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/usuarios` | Lista todos os usuários |
| GET | `/api/usuarios/:id` | Detalhes de um usuário |
| POST | `/api/usuarios` | Cria um usuário |
| PUT | `/api/usuarios/:id` | Atualiza um usuário |
| DELETE | `/api/usuarios/:id` | Remove um usuário |

### Avaliações

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/avaliacoes` | Registra ou atualiza uma avaliação |
| GET | `/api/avaliacoes/jogo/:jogoId` | Lista avaliações de um jogo |

---

## Padrões de Projeto Aplicados

| Padrão | Onde está | Problema que resolve |
|---|---|---|
| **MVC** | Arquitetura geral | Separa a tradução HTTP do domínio, permitindo evoluir um sem afetar o outro |
| **Repository** | `src/repositories/` | Isola o Prisma. Trocar o ORM não exige mudanças em services/controllers |
| **Singleton** | `src/config/prisma.js` | Uma única instância do PrismaClient evita múltiplas conexões abertas |
| **Middleware chain** | `src/middlewares/errorHandler.js` | Tratamento centralizado de erros sem repetir `try/catch` em cada rota |

---

## Comportamento Preservado

Todos os endpoints do Trabalho 2 continuam funcionando de forma idêntica. A refatoração foi **interna** — a API não mudou para quem a consome.

---

## Autor

**Adriano Rodrigues da Silva**

- Matrícula: 2025133735
- Curso: Licenciatura em Computação (EaD/UAB) — UFRB
- Disciplina: GCET908 — Desenvolvimento de Software II
- Professor: Tássio Valle

---

## Licença

Projeto acadêmico desenvolvido para a disciplina GCET908.