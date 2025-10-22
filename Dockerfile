FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# --- ADICIONE ESTA NOVA LINHA ---
RUN echo "FORCE_REBUILD_V5"
# ---------------------------------

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/index.js"]