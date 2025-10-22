import { Request, Response } from 'express';
// MODIFICAÇÃO: Importar o tipo 'Prisma'
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// Criar um novo pedido
export const createOrder = async (req: Request, res: Response) => {
  // @ts-ignore - Assumindo que 'req.user' é adicionado por um middleware de autenticação
  const userId = req.user.id;
  const { items } = req.body;

  try {
    // Iniciar transação para garantir consistência
    // MODIFICAÇÃO: Adicionado o tipo 'Prisma.TransactionClient' ao parâmetro 'tx'
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Calcular o total e verificar estoque
      let total = 0;
      const orderItems = [];

      for (const item of items) {
        // Buscar produto para verificar estoque e preço atual
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(`Produto com ID ${item.productId} não encontrado`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Estoque insuficiente para o produto ${product.name}`);
        }

        // Atualizar estoque do produto (PONTO CRÍTICO)
        await tx.product.update({
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
      const order = await tx.order.create({
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
    });

    res.status(201).json({
      message: 'Pedido criado com sucesso',
      order: result,
    });
  } catch (error: any) {
    console.error('Erro ao criar pedido:', error);
    res.status(400).json({ message: error.message || 'Erro ao criar pedido' });
  }
};

// Listar todos os pedidos do usuário
export const getUserOrders = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - Assumindo que 'req.user' é adicionado por um middleware de autenticação
    const userId = req.user.id;

    const orders = await prisma.order.findMany({
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
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    res.status(500).json({ message: 'Erro ao buscar pedidos' });
  }
};

// Obter detalhes de um pedido específico
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // @ts-ignore - Assumindo que 'req.user' é adicionado por um middleware de autenticação
    const userId = req.user.id;

    const order = await prisma.order.findFirst({
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
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    res.status(500).json({ message: 'Erro ao buscar pedido' });
  }
};