# Projeto Integrador – Cloud Developing 2025/1

> CRUD simples + API Gateway + Lambda /report + RDS + CI/CD

**Grupo**:

1. 10403348 - Gabriel Neman Silva - responsabilidade
2. 10376918 - Ricardo Carvalho Paixão Brandão - responsabilidade
3. 10419046 - Gabriel Pastorelli de Almeida - responsabilidade

## 1. Visão geral
Este projeto implementa um sistema para gerenciar uma lista pessoal de Heróis Favoritos. Este domínio foi selecionado devido ao interesse em heróis e à oportunidade de demonstrar a integração com uma API externa rica em dados, focando na aplicação prática das operações CRUD. As informações dos heróis são obtidas desta API externa, e a aplicação permite armazenar detalhes como nome, imagem, biografia, poderes e um apelido personalizável.

A API interna oferece funcionalidades CRUD para a lista de favoritos:
*Create: Adiciona um novo herói (com seus dados completos da API externa) à lista de favoritos.
*Read: Permite listar todos os heróis favoritos ou buscar um específico pelo seu ID (da API externa).
*Update: Modifica o apelido de um herói favorito existente, identificado pelo seu ID.
*Delete: Remove um herói da lista de favoritos, utilizando seu ID.

## 2. Arquitetura

![Diagrama](docs/arquitetura.png)

| Camada | Serviço | Descrição |
|--------|---------|-----------|
| Backend | ECS Fargate (ou EC2 + Docker) | API REST Node/Spring/… |
| Banco   | Amazon RDS              | PostgreSQL / MySQL em subnet privada |
| Gateway | Amazon API Gateway      | Rotas CRUD → ECS · `/report` → Lambda |
| Função  | AWS Lambda              | Consome a API, gera estatísticas JSON |
| CI/CD   | CodePipeline + GitHub   | push → build → ECR → deploy |

## 3. Como rodar localmente

```bash
cp .env.example .env         # configure variáveis
docker compose up --build
# API em http://localhost:3000