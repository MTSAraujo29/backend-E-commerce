"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = exports.prisma = void 0;
const client_1 = require("@prisma/client");
// Inicialização do cliente Prisma
exports.prisma = new client_1.PrismaClient();
// Exportando o modelo Product do Prisma Client
exports.Product = exports.prisma.product;
exports.default = exports.Product;
//# sourceMappingURL=Product.js.map