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
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'seu_jwt_secret_seguro';
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token;
        // Verificar se o token está no header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        // Verificar se o token existe
        if (!token) {
            return res.status(401).json({ message: 'Acesso não autorizado, token não fornecido' });
        }
        // Verificar o token
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // Verificar se o usuário ainda existe
        const user = yield prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, name: true, email: true }
        });
        if (!user) {
            return res.status(401).json({ message: 'Usuário não encontrado' });
        }
        // Adicionar o usuário à requisição
        req.user = user;
        next();
    }
    catch (error) {
        console.error('Erro no middleware de autenticação:', error);
        res.status(401).json({ message: 'Acesso não autorizado' });
    }
});
exports.protect = protect;
//# sourceMappingURL=authMiddleware.js.map