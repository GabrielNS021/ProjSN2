# Projeto Integrador – Cloud Developing 2025/1

> CRUD simples + API Gateway + Lambda /report + RDS

**Grupo**:

1. 10403348 - Gabriel Neman Silva - AWS + Back-end
2. 10376918 - Ricardo Carvalho Paixão Brandão - Front-end + Documentacao
3. 10419046 - Gabriel Pastorelli de Almeida - Documentacao + Wireframe

## 1. Visão geral
Este projeto implementa um sistema para gerenciar uma lista pessoal de Heróis Favoritos. Este domínio foi selecionado devido ao interesse em heróis e à oportunidade de demonstrar a integração com uma API externa rica em dados, focando na aplicação prática das operações CRUD. As informações dos heróis são obtidas desta API externa, e a aplicação permite armazenar detalhes como nome, imagem, biografia, poderes e um apelido personalizável.

A API interna oferece funcionalidades CRUD para a lista de favoritos:
*Create: Adiciona um novo herói (com seus dados completos da API externa) à lista de favoritos.
*Read: Permite listar todos os heróis favoritos ou buscar um específico pelo seu ID (da API externa).
*Update: Modifica o apelido de um herói favorito existente, identificado pelo seu ID.
*Delete: Remove um herói da lista de favoritos, utilizando seu ID.

## 2. Arquitetura

### Diagrama
![image](https://github.com/user-attachments/assets/10664dd8-e276-4b43-86ef-f3c7cb364204)

### Tabela
| Camada | Serviço | Descrição |
|--------|---------|-----------|
| Backend | EC2 + Docker | API REST Node|
| Banco   | Amazon RDS              | PostgreSQL |
| Gateway | Amazon API Gateway      | Rotas CRUD → ECS · `/report` → Lambda |
| Função  | AWS Lambda              | Consome a API, gera estatísticas JSON |

## 3. Como rodar localmente

```
Construir imagem: docker build -t imagem_heroi .
Construir container: docker run -d --restart unless-stopped -p 80:8080 --name container_heroi --env-file ./cred.env imagem_heroi
Inicar o Docker: docker start container_heroi
Acessar: https://localhost:8080
```
