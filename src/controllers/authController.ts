import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Registrar um novo usuário
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Criar novo usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // --- MODIFICAÇÃO INICIA AQUI ---
    // Pega a chave secreta do .env
    const secret = process.env.JWT_SECRET;

    // Validação de segurança: Se a chave não existir, envie um erro.
    if (!secret) {
      console.error('Erro fatal: JWT_SECRET não foi definida no .env');
      return res.status(500).json({ message: 'Erro interno do servidor (configuração)' });
    }
    // --- MODIFICAÇÃO TERMINA AQUI ---

    // Gerar token JWT usando a chave validada
    const token = jwt.sign(
      { id: user.id, email: user.email },
      secret, // <-- Use a variável 'secret'
      { expiresIn: '1d' }
    );

    res.status(201).json({
      message: 'Usuário registrado com sucesso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ message: 'Erro ao registrar usuário' });
  }
};

// Login de usuário
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // --- MODIFICAÇÃO INICIA AQUI ---
    // Pega a chave secreta do .env
    const secret = process.env.JWT_SECRET;

    // Validação de segurança: Se a chave não existir, envie um erro.
    if (!secret) {
      console.error('Erro fatal: JWT_SECRET não foi definida no .env');
      return res.status(500).json({ message: 'Erro interno do servidor (configuração)' });
    }
    // --- MODIFICAÇÃO TERMINA AQUI ---

    // Gerar token JWT usando a chave validada
    const token = jwt.sign(
      { id: user.id, email: user.email },
      secret, // <-- Use a variável 'secret'
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
};