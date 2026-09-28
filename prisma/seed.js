const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  await prisma.avaliacao.deleteMany();
  await prisma.biblioteca.deleteMany();
  await prisma.jogoGenero.deleteMany();
  await prisma.jogoPlataforma.deleteMany();
  await prisma.jogo.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.plataforma.deleteMany();
  await prisma.genero.deleteMany();
  await prisma.desenvolvedora.deleteMany();

  // DESENVOLVEDORAS (10)
  const devs = [];
  for (const d of [
    { nome: 'Nintendo', pais: 'Japão' },
    { nome: 'Rockstar Games', pais: 'EUA' },
    { nome: 'CD Projekt Red', pais: 'Polônia' },
    { nome: 'FromSoftware', pais: 'Japão' },
    { nome: 'Santa Monica Studio', pais: 'EUA' },
    { nome: 'Naughty Dog', pais: 'EUA' },
    { nome: 'Ubisoft', pais: 'França' },
    { nome: 'Electronic Arts', pais: 'EUA' },
    { nome: 'Valve', pais: 'EUA' },
    { nome: 'Square Enix', pais: 'Japão' },
  ]) devs.push(await prisma.desenvolvedora.create({ data: d }));

  // GÊNEROS (10)
  const generos = [];
  for (const g of [
    'Ação', 'RPG', 'Aventura', 'Soulslike', 'Mundo Aberto',
    'Estratégia', 'Esporte', 'Corrida', 'Terror', 'Puzzle',
  ]) generos.push(await prisma.genero.create({ data: { nome: g } }));

  // PLATAFORMAS (10)
  const plats = [];
  for (const p of [
    'PC', 'PlayStation 5', 'Xbox Series X', 'Nintendo Switch',
    'PlayStation 4', 'Xbox One', 'Steam Deck', 'Nintendo Switch 2',
    'PlayStation 5 Pro', 'Mobile',
  ]) plats.push(await prisma.plataforma.create({ data: { nome: p } }));

  // USUÁRIOS (10)
  const users = [];
  for (const u of [
    { nome: 'Ana Silva', email: 'ana@email.com' },
    { nome: 'Bruno Costa', email: 'bruno@email.com' },
    { nome: 'Carlos Souza', email: 'carlos@email.com' },
    { nome: 'Diana Lima', email: 'diana@email.com' },
    { nome: 'Eduardo Reis', email: 'eduardo@email.com' },
    { nome: 'Fernanda Alves', email: 'fernanda@email.com' },
    { nome: 'Gabriel Rocha', email: 'gabriel@email.com' },
    { nome: 'Helena Martins', email: 'helena@email.com' },
    { nome: 'Igor Pereira', email: 'igor@email.com' },
    { nome: 'Julia Nunes', email: 'julia@email.com' },
  ]) users.push(await prisma.usuario.create({ data: u }));

  // JOGOS (12)
  const jogosData = [
    { titulo: 'The Legend of Zelda: Breath of the Wild', ano: 2017, preco: 299.90, dev: 0, gens: [2, 4], plats: [3], desc: 'Aventura em mundo aberto' },
    { titulo: 'Red Dead Redemption 2', ano: 2018, preco: 249.90, dev: 1, gens: [0, 4], plats: [1, 2, 5], desc: 'Velho oeste realista' },
    { titulo: 'The Witcher 3: Wild Hunt', ano: 2015, preco: 129.90, dev: 2, gens: [1, 4], plats: [0, 1], desc: 'RPG de fantasia' },
    { titulo: 'Elden Ring', ano: 2022, preco: 249.90, dev: 3, gens: [1, 3, 4], plats: [0, 1, 2], desc: 'Soulslike desafiador' },
    { titulo: 'God of War Ragnarök', ano: 2022, preco: 299.90, dev: 4, gens: [0, 2], plats: [1, 4], desc: 'Mitologia nórdica' },
    { titulo: 'The Last of Us Part II', ano: 2020, preco: 199.90, dev: 5, gens: [0, 2, 8], plats: [4], desc: 'Drama pós-apocalíptico' },
    { titulo: "Assassin's Creed Valhalla", ano: 2020, preco: 199.90, dev: 6, gens: [0, 2, 4], plats: [1, 2, 5], desc: 'Vikings em mundo aberto' },
    { titulo: 'FIFA 23', ano: 2022, preco: 299.90, dev: 7, gens: [6], plats: [0, 1, 2], desc: 'Futebol realista' },
    { titulo: 'Half-Life: Alyx', ano: 2020, preco: 149.90, dev: 8, gens: [0, 2], plats: [0], desc: 'VR imersivo' },
    { titulo: 'Final Fantasy XVI', ano: 2023, preco: 349.90, dev: 9, gens: [0, 1], plats: [1], desc: 'RPG de ação épico' },
    { titulo: 'Cyberpunk 2077', ano: 2020, preco: 199.90, dev: 2, gens: [0, 1, 4], plats: [0, 1, 2], desc: 'Futurista distópico' },
    { titulo: 'Hollow Knight', ano: 2017, preco: 46.99, dev: 8, gens: [2, 9], plats: [0, 3], desc: 'Metroidvania indie' },
  ];

  const jogos = [];
  for (const j of jogosData) {
    const jogo = await prisma.jogo.create({
      data: {
        titulo: j.titulo,
        anoLancamento: j.ano,
        preco: j.preco,
        descricao: j.desc,
        desenvolvedoraId: devs[j.dev].id,
        generos: { create: j.gens.map((g) => ({ generoId: generos[g].id })) },
        plataformas: { create: j.plats.map((p) => ({ plataformaId: plats[p].id })) },
      },
    });
    jogos.push(jogo);
  }

  // BIBLIOTECAS (15)
  const bibliotecasData = [
    [0, 0, 120.5], [0, 2, 80.0], [0, 10, 45.0],
    [1, 1, 45.0], [1, 3, 150.0], [1, 8, 30.0],
    [2, 4, 60.0], [2, 5, 25.0],
    [3, 6, 40.0], [3, 7, 100.0], [3, 11, 15.0],
    [4, 9, 55.0], [4, 0, 70.0],
    [5, 3, 200.0], [6, 10, 90.0],
  ];
  for (const [u, j, h] of bibliotecasData) {
    await prisma.biblioteca.create({
      data: { usuarioId: users[u].id, jogoId: jogos[j].id, horasJogadas: h },
    });
  }

  // AVALIAÇÕES (19)
  const avaliacoesData = [
    [0, 0, 5, 'Obra-prima!'], [0, 2, 4, 'Excelente RPG'],
    [0, 10, 5, 'Futurista e imersivo'], [1, 1, 5, 'Melhor mundo aberto'],
    [1, 3, 5, 'Desafiador'], [1, 8, 4, 'VR revolucionário'],
    [2, 4, 5, 'Épico nórdico'], [2, 5, 4, 'Emocionante'],
    [3, 6, 3, 'Bom, mas repetitivo'], [3, 7, 4, 'Futebol realista'],
    [3, 11, 5, 'Indie maravilhoso'], [4, 9, 4, 'RPG de ação'],
    [4, 0, 5, 'Aventura perfeita'], [5, 3, 5, 'Soulslike top'],
    [6, 10, 4, 'Melhorou muito'], [7, 1, 5, 'Imersivo'],
    [8, 4, 5, 'Ação impecável'], [9, 2, 5, 'Clássico moderno'],
    [9, 5, 4, 'Intenso'],
  ];
  for (const [u, j, n, c] of avaliacoesData) {
    await prisma.avaliacao.create({
      data: { usuarioId: users[u].id, jogoId: jogos[j].id, nota: n, comentario: c },
    });
  }

  const counts = {
    desenvolvedoras: await prisma.desenvolvedora.count(),
    generos: await prisma.genero.count(),
    plataformas: await prisma.plataforma.count(),
    usuarios: await prisma.usuario.count(),
    jogos: await prisma.jogo.count(),
    bibliotecas: await prisma.biblioteca.count(),
    avaliacoes: await prisma.avaliacao.count(),
  };

  console.log('✅ Seed concluído:', counts);
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });