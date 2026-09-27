# GCET908 - Trilha 02: Plataforma de Jogos

Este repositório contém a modelagem relacional e as consultas SQL para a API de uma Plataforma de Jogos (estilo Steam), desenvolvido como parte da disciplina GCET908 (Desenvolvimento de Software II).

## 🎯 Objetivo
Projetar um modelo relacional adequado ao domínio de jogos e escrever consultas SQL corretas e eficientes para os endpoints da API, seguindo boas práticas de banco de dados.

## 🗂️ Estrutura do Repositório
- `database/schema.sql`: Script DDL para criação das tabelas, índices e constraints.
- `database/seed.sql`: Script DML com dados iniciais para testes.
- `database/queries.sql`: Consultas SQL que serão utilizadas pelos endpoints da API.

## 🗺️ Modelo Relacional (DER)
O domínio é composto pelas seguintes entidades e relacionamentos:
- **Desenvolvedora** (1:N) **Jogo**
- **Jogo** (N:N) **Gênero**
- **Jogo** (N:N) **Plataforma**
- **Usuário** (1:N) **Biblioteca** (N:N com Jogo, com atributos extras)
- **Usuário** (1:N) **Avaliação** (N:N com Jogo)

## 🚀 Como executar o Banco de Dados
1. Crie um banco de dados no PostgreSQL chamado `jogos_db`.
2. Abra o Query Tool do pgAdmin conectado a esse banco.
3. Execute o script `database/schema.sql` para criar as tabelas.
4. Execute o script `database/seed.sql` para popular o banco com dados de teste.
5. Utilize as consultas de `database/queries.sql` para testar os endpoints.

## 🛠️ Tecnologias Utilizadas
- PostgreSQL
- SQL Puro (DDL, DML, DQL)
- Git & GitHub