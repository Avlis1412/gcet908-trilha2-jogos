-- ============================================================
-- CONSULTAS SQL PARA OS ENDPOINTS DA API
-- ============================================================

-- ==========================================
-- ENDPOINT 1: Listar Jogos (com filtro e paginação)
-- Rota: GET /jogos?titulo=...&genero=...&page=1&limit=10
-- ==========================================
SELECT 
    j.id,
    j.titulo,
    j.ano_lancamento,
    j.preco,
    d.nome AS desenvolvedora,
    array_agg(DISTINCT g.nome) AS generos
FROM jogos j
JOIN desenvolvedoras d ON j.desenvolvedora_id = d.id
LEFT JOIN jogo_genero jg ON j.id = jg.jogo_id
LEFT JOIN generos g ON jg.genero_id = g.id
WHERE ($1::text IS NULL OR j.titulo ILIKE '%' || $1 || '%')
  AND ($2::text IS NULL OR g.nome = $2)
GROUP BY j.id, j.titulo, j.ano_lancamento, j.preco, d.nome
ORDER BY j.titulo ASC
LIMIT $3 OFFSET $4;

-- ==========================================
-- ENDPOINT 2: Buscar Jogo por ID (com detalhes)
-- Rota: GET /jogos/:id
-- ==========================================
SELECT 
    j.id,
    j.titulo,
    j.ano_lancamento,
    j.preco,
    d.nome AS desenvolvedora,
    array_agg(DISTINCT g.nome) AS generos,
    array_agg(DISTINCT p.nome) AS plataformas,
    COALESCE(ROUND(AVG(a.nota), 2), 0) AS media_avaliacoes,
    COUNT(DISTINCT a.id) AS total_avaliacoes
FROM jogos j
JOIN desenvolvedoras d ON j.desenvolvedora_id = d.id
LEFT JOIN jogo_genero jg ON j.id = jg.jogo_id
LEFT JOIN generos g ON jg.genero_id = g.id
LEFT JOIN jogo_plataforma jp ON j.id = jp.jogo_id
LEFT JOIN plataformas p ON jp.plataforma_id = p.id
LEFT JOIN avaliacoes a ON j.id = a.jogo_id
WHERE j.id = $1
GROUP BY j.id, j.titulo, j.ano_lancamento, j.preco, d.nome;

-- ==========================================
-- ENDPOINT 3: Criar Jogo
-- Rota: POST /jogos
-- ==========================================
INSERT INTO jogos (titulo, ano_lancamento, preco, desenvolvedora_id)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- ==========================================
-- ENDPOINT 4: Atualizar Jogo
-- Rota: PUT /jogos/:id
-- ==========================================
UPDATE jogos
SET titulo = $1,
    ano_lancamento = $2,
    preco = $3,
    desenvolvedora_id = $4
WHERE id = $5
RETURNING *;

-- ==========================================
-- ENDPOINT 5: Remover Jogo
-- Rota: DELETE /jogos/:id
-- ==========================================
DELETE FROM jogos
WHERE id = $1
RETURNING *;

-- ==========================================
-- ENDPOINT 6: Biblioteca do Usuário
-- Rota: GET /usuarios/:id/biblioteca
-- ==========================================
SELECT 
    j.titulo,
    b.horas_jogadas,
    b.data_aquisicao,
    d.nome AS desenvolvedora
FROM bibliotecas b
JOIN jogos j ON b.jogo_id = j.id
JOIN desenvolvedoras d ON j.desenvolvedora_id = d.id
WHERE b.usuario_id = $1
ORDER BY b.data_aquisicao DESC;

-- ==========================================
-- ENDPOINT 7: Top 5 Jogos Melhores Avaliados
-- Rota: GET /jogos/top-avaliados
-- ==========================================
SELECT 
    j.titulo,
    ROUND(AVG(a.nota), 2) AS media_nota,
    COUNT(a.id) AS total_avaliacoes
FROM jogos j
JOIN avaliacoes a ON j.id = a.jogo_id
GROUP BY j.id, j.titulo
HAVING COUNT(a.id) >= 2
ORDER BY media_nota DESC, total_avaliacoes DESC
LIMIT 5;

-- ==========================================
-- ENDPOINT 8: Registrar Avaliação (com UPSERT)
-- Rota: POST /avaliacoes
-- ==========================================
INSERT INTO avaliacoes (usuario_id, jogo_id, nota, comentario)
VALUES ($1, $2, $3, $4)
ON CONFLICT (usuario_id, jogo_id) 
DO UPDATE SET 
    nota = EXCLUDED.nota,
    comentario = EXCLUDED.comentario,
    criado_em = now()
RETURNING *;