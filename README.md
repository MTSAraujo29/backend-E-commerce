# Mini E-commerce Backend

API RESTful para um mini e-commerce desenvolvida com Node.js, Express, TypeScript e MySQL.

## Funcionalidades

- CRUD completo de produtos
- Integração com API pública de CEP (ViaCEP)
- Validação de dados
- Documentação detalhada

## Tecnologias Utilizadas

- Node.js
- Express
- TypeScript
- MySQL com Prisma ORM
- Docker
- Jest para testes
- Bcrypt para criptografia de senhas
- JWT para autenticação

## Estrutura do Projeto

```
prisma/
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

### Produtos

- `GET /api/products` - Listar todos os produtos
- `GET /api/products/:id` - Obter produto por ID
- `POST /api/products` - Criar novo produto
- `PUT /api/products/:id` - Atualizar produto
- `DELETE /api/products/:id` - Excluir produto

### Endereço (CEP)

- `GET /api/address/:cep` - Buscar endereço por CEP

### Autenticação

- `POST /api/auth/register` - Registrar novo usuário (com criptografia bcrypt)
- `POST /api/auth/login` - Login de usuário

### Pedidos (Requer Autenticação)

- `POST /api/orders` - Criar novo pedido
- `GET /api/orders` - Listar pedidos do usuário
- `GET /api/orders/:id` - Obter pedido por ID

## Como Executar

### Requisitos

- Node.js (v14+)
- MySQL
- Docker (opcional)

### Instalação

1. Clone o repositório
2. Instale as dependências:
   ```
   npm install
   ```
3. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
   ```
   PORT=3000
   DB_NAME=mini_ecommerce
   DB_USER=root
   DB_PASSWORD=sua_senha
   DB_HOST=localhost
   DATABASE_URL=mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:3306/${DB_NAME}
   ```
4. Execute a migração do Prisma para criar as tabelas no banco de dados:
   ```
   npx prisma migrate dev --name init
   ```

### Executando o Projeto

```
npm run dev
```

### Usando Docker

```
docker-compose up
```

## Testes

```
npm test
```

## Autor

Desenvolvido como parte do teste técnico para a vaga de Programador JavaScript Pleno (Backend) na Marto Sistemas.