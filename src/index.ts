import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes";
import addressRoutes from "./routes/addressRoutes";
import authRoutes from "./routes/authRoutes";
import orderRoutes from "./routes/orderRoutes";
import { prisma } from "./models/Product";

// Configuração do ambiente
dotenv.config();

// Inicialização do app
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use("/api/products", productRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

// Rota raiz
app.get("/", (req, res) => {
  res.send("API do Mini E-commerce está funcionando!");
});

// Inicialização do servidor
const startServer = async () => {
  try {
    // Testar conexão com o banco de dados
    await prisma.$connect();
    console.log("Conexão com o MySQL estabelecida com sucesso via Prisma.");

    // Iniciar servidor
    const server = app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });

    // Tratamento de sinais para shutdown graceful
    process.on("SIGTERM", async () => {
      console.log("SIGTERM recebido, encerrando servidor...");
      server.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
      });
    });

    process.on("SIGINT", async () => {
      console.log("SIGINT recebido, encerrando servidor...");
      server.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
    process.exit(1);
  }
};

startServer();

export default app;
