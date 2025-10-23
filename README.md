# Mini E-commerce Backend (Teste Manto Sistemas)

API RESTful completa para gerenciamento de pedidos de venda e produtos, desenvolvida como parte do teste técnico para a vaga de Programador JavaScript Pleno (Backend) na Manto Sistemas.

O projeto foi desenvolvido em Node.js com Express, TypeScript e MySQL (utilizando o Prisma ORM), e está totalmente containerizado com Docker e hospedado em produção.

## 🚀 Status do Projeto

- ✅ **Deploy em Produção**: Hospedado no Render
- ✅ **Banco de Dados**: MySQL no Railway
- ✅ **Todas as funcionalidades**: Implementadas e testadas
- ✅ **Integração Externa**: Consulta de CEP com fallback
- ✅ **Autenticação**: JWT + Bcrypt funcionando
- ✅ **CRUD Completo**: Produtos e Pedidos operacionais

## Principais Funcionalidades

Este projeto implementa todas as funcionalidades obrigatórias e diversos diferenciais solicitados:

- **Autenticação e Autorização:** Cadastro e Login de usuários com senhas criptografadas (Bcrypt) e proteção de rotas com JWT.
- **CRUD de Produtos:** Gerenciamento completo de produtos (Criar, Listar, Editar, Excluir).
- **CRUD de Pedidos:** Gerenciamento de pedidos com consulta por cliente.
- **Controle de Estoque:** Atualização automática do estoque ao criar um novo pedido.
- **Integração Externa:** Consulta de endereços via múltiplas APIs de CEP com sistema de fallback resiliente.
- **Sistema Resiliente:** Fallback automático entre APIs de CEP para garantir disponibilidade.

## Entregáveis (Links)

- **[Documentação da API (Postman)]**: `[COLE SEU LINK DO POSTMAN/HOPPSCOTCH AQUI]`
- **[Vídeo de Apresentação (2-5 min)]**: `[COLE SEU LINK DO VÍDEO AQUI]`
- **[Deploy Funcional (Render)]**: `https://mini-ecommerce-api-h8iv.onrender.com/`

## Tecnologias Utilizadas

- **Backend:** Node.js 18, Express, TypeScript
- **Banco de Dados:** MySQL (Railway)
- **ORM:** Prisma
- **Testes:** Jest
- **Autenticação:** JWT (jsonwebtoken) e Bcrypt
- **Containerização:** Docker e Docker Compose
- **Hospedagem:** Render (App) + Railway (Database)
- **APIs Externas:** ViaCEP, AwesomeAPI, BrasilAPI (com fallback)

## Estrutura do Projeto

```
prisma/
  └── migrations
      └── 20251022145811_init
          └──migration.sql
      └── migration_lock.toml
  └── schema.prisma    # Definição do schema do Prisma
src/
  ├── controllers/     # Controladores da aplicação
  ├── models/          # Modelos e cliente Prisma
  ├── routes/          # Rotas da API
  ├── services/        # Serviços externos (CEP com fallback)
  ├── middlewares/     # Middlewares personalizados
  ├── utils/           # Utilitários
  └── index.ts         # Ponto de entrada da aplicação
```

## Endpoints da API

_Base URL: `https://mini-ecommerce-api-h8iv.onrender.com`_

### Autenticação (`/api/auth`)

- `POST /register`: Registrar novo usuário.
- `POST /login`: Login (retorna token JWT).

### Produtos (`/api/products`) - (Protegido)

- `GET /`: Listar todos os produtos.
- `GET /:id`: Obter produto por ID.
- `POST /`: Criar novo produto.
- `PUT /:id`: Atualizar produto.
- `DELETE /:id`: Excluir produto.

### Pedidos (`/api/orders`) - (Protegido)

- `POST /`: Criar novo pedido (atualiza o estoque).
- `GET /`: Listar pedidos do usuário autenticado.
- `GET /:id`: Obter pedido por ID.

### Endereço (`/api/address`)

- `GET /:cep`: Buscar endereço por CEP (Integração Externa com fallback).

### Health Check

- `GET /`: Verificar se a API está funcionando.

---

## Como Executar o Projeto Localmente

### Requisitos Obrigatórios

- **Node.js (v18+ OBRIGATÓRIO)**
- **Docker Desktop** (deve estar rodando)

### 1. Configuração Inicial (Setup)

1.  Clone o repositório:

    ```bash
    git clone https://github.com/MTSAraujo29/backend-E-commerce.git
    cd backend-E-commerce
    ```

2.  Instale as dependências do Node:

    ```bash
    npm install
    ```

3.  Crie um arquivo `.env` na raiz do projeto:

    ```env
    # .env
    PORT=3000

    # Configuração do Banco (para conectar ao Docker localmente)
    DB_NAME=mini_ecommerce
    DB_USER=root
    DB_PASSWORD=password
    DB_HOST=localhost

    DATABASE_URL="mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:3306/${DB_NAME}"

    # Chave secreta para o JWT
    JWT_SECRET=sua_chave_secreta_aqui
    ```

### 2. Executando com Docker (Método Recomendado)

Este método inicia a API e o Banco de Dados MySQL dentro de contêineres Docker.

1.  Inicie os contêineres:

    ```bash
    docker compose up -d --build
    ```

    _(Este comando irá construir a imagem, baixar o MySQL e iniciar ambos. O `healthcheck` garante que a API só inicie depois que o banco de dados estiver pronto.)_

2.  Execute a migração do Prisma para criar as tabelas no banco de dados Docker:
    ```bash
    npx prisma migrate dev
    ```

**Pronto!** A aplicação estará rodando em `http://localhost:3000`.

### 3. Executando Localmente (Para Desenvolvimento)

Este método é útil se você quiser fazer alterações no código com "hot-reload".

1.  **Certifique-se de que o banco de dados Docker (do Passo 2) esteja rodando:**

    ```bash
    # Se não estiver rodando, inicie apenas o banco
    docker compose up -d mysql
    ```

2.  Execute a migração (se ainda não o fez):

    ```bash
    npx prisma migrate dev
    ```

3.  Inicie o servidor de desenvolvimento (com `ts-node`):
    ```bash
    npm run dev
    ```

A aplicação estará rodando em `http://localhost:3000`.

## Testes

Para rodar os testes automatizados (Jest):

```bash
npm test
```

## Scripts Disponíveis

```bash
npm start          # Inicia a aplicação em produção
npm run dev        # Inicia em modo desenvolvimento
npm run build      # Compila TypeScript
npm test           # Executa testes
npm run lint       # Executa linter
npm run db:reset   # Reseta o banco de dados
npm run db:deploy  # Executa migrações
```

## Arquitetura de Produção

### Hospedagem

- **Aplicação**: Render (Web Service)
- **Banco de Dados**: Railway (MySQL)
- **Deploy**: Automático via GitHub

### Configurações de Produção

- **Porta**: Dinâmica (definida pelo Render)
- **Migrações**: Automáticas no deploy
- **Logs**: Centralizados no Render Dashboard
- **Health Check**: Configurado para monitoramento

### Sistema de Fallback para CEP

O sistema implementa um mecanismo resiliente de consulta de CEP:

1. **ViaCEP** (API principal)
2. **AwesomeAPI** (fallback 1)
3. **BrasilAPI** (fallback 2)

Se uma API falhar, o sistema automaticamente tenta a próxima, garantindo alta disponibilidade.

## Melhorias Implementadas

- ✅ **Tratamento de Erros**: Logs detalhados e mensagens específicas
- ✅ **Sistema Resiliente**: Fallback entre múltiplas APIs
- ✅ **Otimização Docker**: Imagem otimizada para produção
- ✅ **Migrações Automáticas**: Deploy sem intervenção manual
- ✅ **Nomenclatura Segura**: Tabelas com nomes que não conflitam com palavras reservadas SQL
- ✅ **Shutdown Graceful**: Encerramento adequado da aplicação

## Banco de Dados

### Schema Atual

- **User**: Usuários do sistema
- **Product**: Produtos disponíveis
- **SaleOrder**: Pedidos de venda (renomeado para evitar conflito SQL)
- **SaleOrderItem**: Itens dos pedidos (renomeado para evitar conflito SQL)

### Migrações

- Todas as migrações são executadas automaticamente no deploy
- Schema otimizado para evitar conflitos com palavras reservadas SQL
- Índices configurados para melhor performance

## Contribuição

Este projeto foi desenvolvido como teste técnico e está em produção. Para contribuições ou melhorias, entre em contato através dos canais oficiais.
