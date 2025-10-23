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

# Script para resetar banco e executar migrações automaticamente
CMD ["sh", "-c", "npx prisma migrate reset --force --skip-seed && npm start"]