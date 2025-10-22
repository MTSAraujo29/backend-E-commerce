import { PrismaClient } from '@prisma/client';

// Inicialização do cliente Prisma
export const prisma = new PrismaClient();

// Tipo para atributos do Produto
export type ProductAttributes = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// Tipo para criação de Produto (ID é opcional na criação)
export type ProductCreateInput = Omit<ProductAttributes, 'id' | 'createdAt' | 'updatedAt'>;

// Tipo para atualização de Produto
export type ProductUpdateInput = Partial<ProductCreateInput>;

// Exportando o modelo Product do Prisma Client
export const Product = prisma.product;

export default Product;