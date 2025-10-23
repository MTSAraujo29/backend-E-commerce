FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
# Instalar todas as dependências (incluindo devDependencies) para o build
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

# Remover devDependencies após o build para reduzir tamanho da imagem
RUN npm prune --production

EXPOSE $PORT

# Script para renomear tabelas e executar migrações
CMD ["sh", "-c", "npx prisma db execute --file prisma/migrations/20250123000000_rename_order_tables/migration.sql || echo 'Tabelas já renomeadas' && npx prisma migrate deploy && npm start"]