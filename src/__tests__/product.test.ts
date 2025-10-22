import request from 'supertest';
import app from '../index';
import { PrismaClient } from '@prisma/client';

// Mock do cliente Prisma para evitar acesso ao banco de dados real
jest.mock('../models/Product', () => {
  const mockPrisma = {
    product: {
      findMany: jest.fn().mockResolvedValue([
        {
          id: '123456789012',
          name: 'Produto Teste',
          description: 'Descrição do produto teste',
          price: 99.99,
          stock: 10,
          category: 'Teste',
          imageUrl: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ]),
      findUnique: jest.fn().mockImplementation(({ where }) => {
        if (where.id === '123456789012') {
          return Promise.resolve({
            id: '123456789012',
            name: 'Produto Teste',
            description: 'Descrição do produto teste',
            price: 99.99,
            stock: 10,
            category: 'Teste',
            imageUrl: null,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
        return Promise.resolve(null);
      }),
      create: jest.fn().mockImplementation(({ data }) => {
        return Promise.resolve({
          id: '123456789012',
          ...data,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }),
      update: jest.fn().mockImplementation(({ where, data }) => {
        if (where.id === '123456789012') {
          return Promise.resolve({
            id: '123456789012',
            ...data,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
        return Promise.resolve(null);
      }),
      delete: jest.fn().mockImplementation(({ where }) => {
        if (where.id === '123456789012') {
          return Promise.resolve({
            id: '123456789012',
            name: 'Produto Teste',
            description: 'Descrição do produto teste',
            price: 99.99,
            stock: 10,
            category: 'Teste',
            imageUrl: null,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
        return Promise.resolve(null);
      })
    }
  };
  return { prisma: mockPrisma };
});

describe('API de Produtos', () => {
  afterAll(async () => {
    // Fechar conexão do Prisma
    const prisma = new PrismaClient();
    await prisma.$disconnect();
  });

  describe('GET /api/products', () => {
    it('deve retornar todos os produtos', async () => {
      const res = await request(app).get('/api/products');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/products/:id', () => {
    it('deve retornar um produto específico pelo ID', async () => {
      const res = await request(app).get('/api/products/123456789012');
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Produto Teste');
    });

    it('deve retornar 404 para ID inexistente', async () => {
      const res = await request(app).get('/api/products/999999999999');
      expect(res.status).toBe(404);
    });
  });
});