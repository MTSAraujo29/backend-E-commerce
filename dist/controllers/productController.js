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
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getAllProducts = void 0;
const Product_1 = require("../models/Product");
// Obter todos os produtos
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield Product_1.prisma.product.findMany();
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao buscar produtos', error });
    }
});
exports.getAllProducts = getAllProducts;
// Obter produto por ID
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = parseInt(req.params.id);
        const product = yield Product_1.prisma.product.findUnique({
            where: { id: productId }
        });
        if (!product) {
            res.status(404).json({ message: 'Produto não encontrado' });
            return;
        }
        res.status(200).json(product);
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao buscar produto', error });
    }
});
exports.getProductById = getProductById;
// Criar novo produto
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, price, stock, category, imageUrl } = req.body;
        // Validações básicas
        if (!name || !description || price === undefined || stock === undefined || !category) {
            res.status(400).json({ message: 'Dados incompletos para criar produto' });
            return;
        }
        const productData = {
            name,
            description,
            price: Number(price),
            stock: Number(stock),
            category,
            imageUrl
        };
        const newProduct = yield Product_1.prisma.product.create({
            data: productData
        });
        res.status(201).json(newProduct);
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao criar produto', error });
    }
});
exports.createProduct = createProduct;
// Atualizar produto
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, price, stock, category, imageUrl } = req.body;
        const productId = parseInt(req.params.id);
        // Verificar se o produto existe
        const existingProduct = yield Product_1.prisma.product.findUnique({
            where: { id: productId }
        });
        if (!existingProduct) {
            res.status(404).json({ message: 'Produto não encontrado' });
            return;
        }
        // Preparar dados para atualização
        const productData = {};
        if (name !== undefined)
            productData.name = name;
        if (description !== undefined)
            productData.description = description;
        if (price !== undefined)
            productData.price = Number(price);
        if (stock !== undefined)
            productData.stock = Number(stock);
        if (category !== undefined)
            productData.category = category;
        if (imageUrl !== undefined)
            productData.imageUrl = imageUrl;
        // Atualizar produto
        const updatedProduct = yield Product_1.prisma.product.update({
            where: { id: productId },
            data: productData
        });
        res.status(200).json(updatedProduct);
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar produto', error });
    }
});
exports.updateProduct = updateProduct;
// Deletar produto
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = parseInt(req.params.id);
        // Verificar se o produto existe
        const existingProduct = yield Product_1.prisma.product.findUnique({
            where: { id: productId }
        });
        if (!existingProduct) {
            res.status(404).json({ message: 'Produto não encontrado' });
            return;
        }
        // Deletar produto
        yield Product_1.prisma.product.delete({
            where: { id: productId }
        });
        res.status(200).json({ message: 'Produto deletado com sucesso' });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao deletar produto', error });
    }
});
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=productController.js.map