// Carrega as variáveis de ambiente IMEDIATAMENTE
// Esta deve ser a PRIMEIRA coisa que o app faz
import dotenv from 'dotenv';
dotenv.config();

// --- Agora importa o resto dos pacotes ---
import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes';
import addressRoutes from './routes/addressRoutes';
import authRoutes from './routes/authRoutes';
import orderRoutes from './routes/orderRoutes';
// O Prisma só é importado DEPOIS que o dotenv.config() rodou
import { prisma } from './models/Product';

// Inicialização do app
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/products', productRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.send('API do Mini E-commerce está funcionando!');
});

// Inicialização do servidor
const startServer = async () => {
  try {
    // Testar conexão com o banco de dados
    await prisma.$connect();
    console.log('Conexão com o MySQL estabelecida com sucesso via Prisma.');

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    // Informa ao Render que o app falhou ao iniciar
    process.exit(1);
  } finally {
    // Garantir que o Prisma seja desconectado quando o servidor for encerrado
    process.on('beforeExit', async () => {
      await prisma.$disconnect();
    });
  }
};

startServer();

export default app;