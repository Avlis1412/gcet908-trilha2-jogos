-- CreateTable
CREATE TABLE "desenvolvedoras" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "pais" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "desenvolvedoras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "generos" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "generos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plataformas" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "plataformas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jogos" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "ano_lancamento" INTEGER,
    "preco" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "descricao" TEXT,
    "desenvolvedora_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "jogos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jogo_genero" (
    "jogo_id" INTEGER NOT NULL,
    "genero_id" INTEGER NOT NULL,

    CONSTRAINT "jogo_genero_pkey" PRIMARY KEY ("jogo_id","genero_id")
);

-- CreateTable
CREATE TABLE "jogo_plataforma" (
    "jogo_id" INTEGER NOT NULL,
    "plataforma_id" INTEGER NOT NULL,

    CONSTRAINT "jogo_plataforma_pkey" PRIMARY KEY ("jogo_id","plataforma_id")
);

-- CreateTable
CREATE TABLE "bibliotecas" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "jogo_id" INTEGER NOT NULL,
    "horas_jogadas" DECIMAL(6,1) NOT NULL DEFAULT 0.0,
    "data_aquisicao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "bibliotecas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "avaliacoes" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "jogo_id" INTEGER NOT NULL,
    "nota" INTEGER NOT NULL,
    "comentario" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "avaliacoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "desenvolvedoras_nome_key" ON "desenvolvedoras"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "generos_nome_key" ON "generos"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "plataformas_nome_key" ON "plataformas"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "jogos_titulo_idx" ON "jogos"("titulo");

-- CreateIndex
CREATE INDEX "jogos_desenvolvedora_id_idx" ON "jogos"("desenvolvedora_id");

-- CreateIndex
CREATE INDEX "bibliotecas_usuario_id_idx" ON "bibliotecas"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "bibliotecas_usuario_id_jogo_id_key" ON "bibliotecas"("usuario_id", "jogo_id");

-- CreateIndex
CREATE INDEX "avaliacoes_jogo_id_idx" ON "avaliacoes"("jogo_id");

-- CreateIndex
CREATE UNIQUE INDEX "avaliacoes_usuario_id_jogo_id_key" ON "avaliacoes"("usuario_id", "jogo_id");

-- AddForeignKey
ALTER TABLE "jogos" ADD CONSTRAINT "jogos_desenvolvedora_id_fkey" FOREIGN KEY ("desenvolvedora_id") REFERENCES "desenvolvedoras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jogo_genero" ADD CONSTRAINT "jogo_genero_jogo_id_fkey" FOREIGN KEY ("jogo_id") REFERENCES "jogos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jogo_genero" ADD CONSTRAINT "jogo_genero_genero_id_fkey" FOREIGN KEY ("genero_id") REFERENCES "generos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jogo_plataforma" ADD CONSTRAINT "jogo_plataforma_jogo_id_fkey" FOREIGN KEY ("jogo_id") REFERENCES "jogos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jogo_plataforma" ADD CONSTRAINT "jogo_plataforma_plataforma_id_fkey" FOREIGN KEY ("plataforma_id") REFERENCES "plataformas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bibliotecas" ADD CONSTRAINT "bibliotecas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bibliotecas" ADD CONSTRAINT "bibliotecas_jogo_id_fkey" FOREIGN KEY ("jogo_id") REFERENCES "jogos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacoes" ADD CONSTRAINT "avaliacoes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacoes" ADD CONSTRAINT "avaliacoes_jogo_id_fkey" FOREIGN KEY ("jogo_id") REFERENCES "jogos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
