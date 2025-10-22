// src/index.ts

// 1. CARREGA AS VARIÁVEIS DE AMBIENTE IMEDIATAMENTE (PRIORIDADE MÁXIMA)
import dotenv from 'dotenv';
dotenv.config();

// 2. IMPORTAÇÕES DE MÓDULOS E ROTAS
import express from 'express';
import cors from 'cors';

// Importa a instância 'prisma' usando a EXPORT DEFAULT corrigida
import prisma from './models/Product'; 

// Importação das rotas
import productRoutes from './routes/productRoutes';
import addressRoutes from './routes/addressRoutes';
import authRoutes from './routes/authRoutes';
import orderRoutes from './routes/orderRoutes';

const app = express();
// Usa a variável de ambiente PORT que o Render fornece, ou 3000 localmente
const PORT = process.env.PORT || 3000; 

// Configurações do App
app.use(cors());
app.use(express.json());

// Rotas
app.use(productRoutes);
app.use(addressRoutes);
app.use(authRoutes);
app.use(orderRoutes);

// Rota de Teste
app.get('/', (req, res) => {
    res.send('API do Mini E-commerce está funcionando!');
});


// Função de Inicialização
async function startServer() {
    try {
        // Tenta conectar o Prisma ao banco de dados
        await prisma.$connect();
        console.log('Conexão com o banco de dados estabelecida com sucesso!');

        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
        });
    } catch (error) {
        console.error('Falha ao conectar ao banco de dados ou iniciar o servidor:', error);
        
        // Removemos o process.exit(1)
    }
}

// Inicia o Servidor
startServer();

export default app;