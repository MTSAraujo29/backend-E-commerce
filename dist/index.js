"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const addressRoutes_1 = __importDefault(require("./routes/addressRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const Product_1 = require("./models/Product");
// Configuração do ambiente
dotenv_1.default.config();
// Inicialização do app
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Rotas
app.use('/api/products', productRoutes_1.default);
app.use('/api/address', addressRoutes_1.default);
app.use('/api/auth', authRoutes_1.default);
app.use('/api/orders', orderRoutes_1.default);
// Rota raiz
app.get('/', (req, res) => {
    res.send('API do Mini E-commerce está funcionando!');
});
// Inicialização do servidor
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Testar conexão com o banco de dados
        yield Product_1.prisma.$connect();
        console.log('Conexão com o MySQL estabelecida com sucesso via Prisma.');
        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    }
    catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
    }
    finally {
        // Garantir que o Prisma seja desconectado quando o servidor for encerrado
        process.on('beforeExit', () => __awaiter(void 0, void 0, void 0, function* () {
            yield Product_1.prisma.$disconnect();
        }));
    }
});
startServer();
exports.default = app;
//# sourceMappingURL=index.js.map