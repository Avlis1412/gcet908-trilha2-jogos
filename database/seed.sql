-- ============================================================
-- SEED: Dados iniciais para testes
-- ============================================================

-- Desenvolvedoras
INSERT INTO desenvolvedoras (nome, pais) VALUES
('Nintendo', 'Japão'),
('Rockstar Games', 'EUA'),
('CD Projekt Red', 'Polônia'),
('FromSoftware', 'Japão');

-- Gêneros
INSERT INTO generos (nome) VALUES
('Ação'), ('RPG'), ('Aventura'), ('Esporte'), ('Soulslike');

-- Plataformas
INSERT INTO plataformas (nome) VALUES
('PC'), ('PlayStation 5'), ('Xbox Series X'), ('Nintendo Switch');

-- Usuários
INSERT INTO usuarios (nome, email) VALUES
('Ana Silva', 'ana@email.com'),
('Bruno Costa', 'bruno@email.com'),
('Carlos Souza', 'carlos@email.com');

-- Jogos
INSERT INTO jogos (titulo, ano_lancamento, preco, desenvolvedora_id) VALUES
('The Legend of Zelda: Breath of the Wild', 2017, 299.90, 1),
('Red Dead Redemption 2', 2018, 249.90, 2),
('The Witcher 3: Wild Hunt', 2015, 129.90, 3),
('Elden Ring', 2022, 249.90, 4),
('Cyberpunk 2077', 2020, 199.90, 3);

-- Relacionamentos N:N (Jogo x Gênero)
INSERT INTO jogo_genero (jogo_id, genero_id) VALUES
(1, 3), (1, 2), -- Zelda: Aventura, RPG
(2, 1), (2, 3), -- RDR2: Ação, Aventura
(3, 2), (3, 3), -- Witcher: RPG, Aventura
(4, 2), (4, 5), -- Elden Ring: RPG, Soulslike
(5, 1), (5, 2); -- Cyberpunk: Ação, RPG

-- Relacionamentos N:N (Jogo x Plataforma)
INSERT INTO jogo_plataforma (jogo_id, plataforma_id) VALUES
(1, 4), -- Zelda: Switch
(2, 2), (2, 3), -- RDR2: PS5, Xbox
(3, 1), (3, 2), -- Witcher: PC, PS5
(4, 1), (4, 2), (4, 3), -- Elden Ring: PC, PS5, Xbox
(5, 1), (5, 2); -- Cyberpunk: PC, PS5

-- Biblioteca (Jogos adquiridos pelos usuários)
INSERT INTO bibliotecas (usuario_id, jogo_id, horas_jogadas) VALUES
(1, 1, 120.5),
(1, 3, 80.0),
(2, 2, 45.0),
(2, 4, 150.0),
(3, 5, 30.0);

-- Avaliações
INSERT INTO avaliacoes (usuario_id, jogo_id, nota, comentario) VALUES
(1, 1, 5, 'Obra-prima!'),
(1, 3, 4, 'Excelente RPG'),
(2, 2, 5, 'Melhor jogo de mundo aberto'),
(2, 4, 5, 'Desafiador e recompensador'),
(3, 5, 3, 'Bom, mas precisa de patches');