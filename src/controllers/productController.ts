import { Request, Response } from 'express';
import { prisma, ProductCreateInput, ProductUpdateInput } from '../models/Product';

// Obter todos os produtos
export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await prisma.product.findMany();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar produtos', error });
  }
};

// Obter produto por ID
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = parseInt(req.params.id);
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });
    
    if (!product) {
      res.status(404).json({ message: 'Produto não encontrado' });
      return;
    }
    
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar produto', error });
  }
};

// Criar novo produto
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, stock, category, imageUrl } = req.body;
    
    // Validações básicas
    if (!name || !description || price === undefined || stock === undefined || !category) {
      res.status(400).json({ message: 'Dados incompletos para criar produto' });
      return;
    }
    
    const productData: ProductCreateInput = {
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      category,
      imageUrl
    };
    
    const newProduct = await prisma.product.create({
      data: productData
    });
    
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar produto', error });
  }
};

// Atualizar produto
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, stock, category, imageUrl } = req.body;
    const productId = parseInt(req.params.id);
    
    // Verificar se o produto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId }
    });
    
    if (!existingProduct) {
      res.status(404).json({ message: 'Produto não encontrado' });
      return;
    }
    
    // Preparar dados para atualização
    const productData: ProductUpdateInput = {};
    if (name !== undefined) productData.name = name;
    if (description !== undefined) productData.description = description;
    if (price !== undefined) productData.price = Number(price);
    if (stock !== undefined) productData.stock = Number(stock);
    if (category !== undefined) productData.category = category;
    if (imageUrl !== undefined) productData.imageUrl = imageUrl;
    
    // Atualizar produto
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: productData
    });
    
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar produto', error });
  }
};

// Deletar produto
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = parseInt(req.params.id);
    
    // Verificar se o produto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId }
    });
    
    if (!existingProduct) {
      res.status(404).json({ message: 'Produto não encontrado' });
      return;
    }
    
    // Deletar produto
    await prisma.product.delete({
      where: { id: productId }
    });
    
    res.status(200).json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar produto', error });
  }
};