// src/models/Product.ts

import { PrismaClient } from '@prisma/client';

// A instância do Prisma Client agora é uma variável LOCAL
const prisma = new PrismaClient();

// Tipos para atributos de Produto (mantidos conforme o seu código)
export type ProductAttributes = {
    id: string;
    owner: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    imageUrl?: string | null;
    createdt: Date;
    updatedt: Date;
};

// Tipo para criação de Produto (ID é opcional na criação)
export type ProductCreateInput = Omit<ProductAttributes, 'id' | 'createdt' | 'updatedt'>;

// Tipo para atualização de Produto
export type ProductUpdateInput = Partial<ProductCreateInput>;

// Exportando o modelo Product (Continua como exportação nomeada)
export const Product = prisma.product;

// EXPORTA A INSTÂNCIA COMPLETA do Prisma Client como DEFAULT
export default prisma;