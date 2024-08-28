# API de Gerenciamento de Refeições

Este projeto consiste em uma API para gerenciamento de usuários e refeições, permitindo o controle de hábitos alimentares com base em métricas de refeições dentro e fora da dieta.

Funcionalidades:

## Usuário: ##

Endpoint: POST /users
Request Body: { "name": "Nome do Usuário", "email": "email@example.com" }
O ID do usuário criado é retornado nos cookies do cliente e utilizado nas demais rotas.
Métricas do Usuário:

Endpoint: GET /users/metrics
Retorna:
Quantidade total de refeições registradas
Quantidade total de refeições dentro da dieta
Quantidade total de refeições fora da dieta
Melhor sequência de refeições dentro da dieta

## Usuário: ##
Criação de Refeição:
Endpoint: POST /meal
Request Body: { "name": "Nome da Refeição", "description": "Descrição da Refeição", "withinDiet": true, "date": "YYYY-MM-DD", "hour": "HH:mm
" }

Listagem de Refeições:
Endpoint: GET /meal
Retorna uma lista de todas as refeições registradas.
Obter Refeição pelo ID:

Endpoint: GET /meal/id
Retorna uma refeição específica com base no seu ID.
Deletar Refeição pelo ID:

Endpoint: DELETE /meal/id
Exclui uma refeição específica com base no seu ID.
Editar Refeição pelo ID:

Endpoint: PUT /meal/id
Request Body: { "name": "Nome da Refeição", "description": "Descrição da Refeição", "withinDiet": true, "date": "YYYY-MM-DD", "hour": "HH:mm
" }
Atualiza as informações de uma refeição específica com base no seu ID.
Testes:

Todas as rotas foram testadas utilizando o Vitest.

Como Executar:

Renomeie os arquivos .env.example e .env.test.example removendo o sufixo "example" e ajuste as variáveis de ambiente conforme necessário.

Instale as dependências: npm install

Execute as migrações do banco de dados: npm run knex -- migrate:latest

Inicie o servidor de desenvolvimento: npm run dev

Esse README foi ajustado para melhorar a clareza e a organização das informações, mantendo o conteúdo e a estrutura original.