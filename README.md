# Mini E-commerce Backend (Teste Manto Sistemas)

API RESTful completa para gerenciamento de pedidos de venda e produtos, desenvolvida como parte do teste técnico para a vaga de Programador JavaScript Pleno (Backend) na Manto Sistemas.

O projeto foi desenvolvido em Node.js com Express, TypeScript e MySQL (utilizando o Prisma ORM), e está totalmente containerizado com Docker.

## Principais Funcionalidades

Este projeto implementa todas as funcionalidades obrigatórias e diversos diferenciais solicitados:

* **Autenticação e Autorização:** Cadastro e Login de usuários com senhas criptografadas (Bcrypt) e proteção de rotas com JWT.
* **CRUD de Produtos:** Gerenciamento completo de produtos (Criar, Listar, Editar, Excluir).
* **CRUD de Pedidos:** Gerenciamento de pedidos com consulta por cliente.
* **Controle de Estoque:** Atualização automática do estoque ao criar um novo pedido.
* **Integração Externa:** Consulta de endereços via API pública (ViaCEP) para ser usada em cadastros.

## Entregáveis (Links)

* **[Documentação da API (Postman/Hoppscotch)]**: `[COLE SEU LINK DO POSTMAN/HOPPSCOTCH AQUI]`
* **[Vídeo de Apresentação (2-5 min)]**: `[COLE SEU LINK DO VÍDEO AQUI]`
* **[Deploy Funcional (Render/Railway)]**: `[COLE SEU LINK DO DEPLOY ONLINE AQUI (OPCIONAL)]`

## Tecnologias Utilizadas

* **Backend:** Node.js, Express, TypeScript
* **Banco de Dados:** MySQL
* **ORM:** Prisma
* **Testes:** Jest
* **Autenticação:** JWT (jsonwebtoken) e Bcrypt
* **Containerização:** Docker e Docker Compose
* **Validação:** Zod (ou outra biblioteca de sua escolha)

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
  ├── services/        # Serviços externos (CEP)
  ├── middlewares/     # Middlewares personalizados
  ├── utils/           # Utilitários
  └── index.ts         # Ponto de entrada da aplicação
```

## Endpoints da API

*A documentação completa com exemplos de requisição está no link do Postman acima.*

### Autenticação (`/api/auth`)
* `POST /register`: Registrar novo usuário.
* `POST /login`: Login (retorna token JWT).

### Produtos (`/api/products`) - (Protegido)
* `GET /`: Listar todos os produtos.
* `GET /:id`: Obter produto por ID.
* `POST /`: Criar novo produto.
* `PUT /:id`: Atualizar produto.
* `DELETE /:id`: Excluir produto.

### Pedidos (`/api/orders`) - (Protegido)
* `POST /`: Criar novo pedido (atualiza o estoque).
* `GET /`: Listar pedidos do usuário autenticado.
* `GET /:id`: Obter pedido por ID.

### Endereço (`/api/address`)
* `GET /:cep`: Buscar endereço por CEP (Integração Externa).

---

## Como Executar o Projeto Localmente

### Requisitos Obrigatórios

* **Node.js (v18+ OBRIGATÓRIO)**
* **Docker Desktop** (deve estar rodando)

### 1. Configuração Inicial (Setup)

1.  Clone o repositório:
    ```bash
    git clone [URL-DO-SEU-REPOSITÓRIO]
    cd [NOME-DO-PROJETO]
    ```

2.  Instale as dependências do Node:
    ```bash
    npm install
    ```

3.  Crie um arquivo `.env` na raiz do projeto. Este arquivo é usado para o `npm run dev` e para os comandos `prisma` se conectarem ao banco de dados do Docker.
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

Este método inicia a API e o Banco de Dados MySQL dentro de contêineres Docker, como solicitado no teste.

1.  Inicie os contêineres:
    ```bash
    docker compose up -d --build
    ```
    *(Este comando irá construir a imagem, baixar o MySQL e iniciar ambos. O `healthcheck` garante que a API só inicie *depois* que o banco de dados estiver pronto.)*

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