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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderById = exports.getUserOrders = exports.createOrder = void 0;
// MODIFICAÇÃO: Importar o tipo 'Prisma'
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Criar um novo pedido
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore - Assumindo que 'req.user' é adicionado por um middleware de autenticação
    const userId = req.user.id;
    const { items } = req.body;
    try {
        // Iniciar transação para garantir consistência
        // MODIFICAÇÃO: Adicionado o tipo 'Prisma.TransactionClient' ao parâmetro 'tx'
        const result = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // Calcular o total e verificar estoque
            let total = 0;
            const orderItems = [];
            for (const item of items) {
                // Buscar produto para verificar estoque e preço atual
                const product = yield tx.product.findUnique({
                    where: { id: item.productId },
                });
                if (!product) {
                    throw new Error(`Produto com ID ${item.productId} não encontrado`);
                }
                if (product.stock < item.quantity) {
                    throw new Error(`Estoque insuficiente para o produto ${product.name}`);
                }
                // Atualizar estoque do produto (PONTO CRÍTICO)
                yield tx.product.update({
                    where: { id: product.id },
                    data: { stock: product.stock - item.quantity },
                });
                // Calcular subtotal
                const itemTotal = product.price * item.quantity;
                total += itemTotal;
                // Adicionar item ao pedido
                orderItems.push({
                    productId: product.id,
                    quantity: item.quantity,
                    price: product.price,
                });
            }
            // Criar o pedido
            const order = yield tx.order.create({
                data: {
                    userId,
                    total,
                    items: {
                        create: orderItems,
                    },
                },
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            });
            return order;
        }));
        res.status(201).json({
            message: 'Pedido criado com sucesso',
            order: result,
        });
    }
    catch (error) {
        console.error('Erro ao criar pedido:', error);
        res.status(400).json({ message: error.message || 'Erro ao criar pedido' });
    }
});
exports.createOrder = createOrder;
// Listar todos os pedidos do usuário
const getUserOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore - Assumindo que 'req.user' é adicionado por um middleware de autenticação
        const userId = req.user.id;
        const orders = yield prisma.order.findMany({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.status(200).json(orders);
    }
    catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        res.status(500).json({ message: 'Erro ao buscar pedidos' });
    }
});
exports.getUserOrders = getUserOrders;
// Obter detalhes de um pedido específico
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // @ts-ignore - Assumindo que 'req.user' é adicionado por um middleware de autenticação
        const userId = req.user.id;
        const order = yield prisma.order.findFirst({
            where: {
                id: Number(id),
                userId,
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        if (!order) {
            return res.status(44).json({ message: 'Pedido não encontrado' });
        }
        res.status(200).json(order);
    }
    catch (error) {
        console.error('Erro ao buscar pedido:', error);
        res.status(500).json({ message: 'Erro ao buscar pedido' });
    }
});
exports.getOrderById = getOrderById;
//# sourceMappingURL=orderController.js.map