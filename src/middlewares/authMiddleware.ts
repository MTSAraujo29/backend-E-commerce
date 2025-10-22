import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Estender a interface Request para incluir o usuário
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
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

    // --- MODIFICAÇÃO INICIA AQUI ---
    // Pega a chave secreta do .env
    const secret = process.env.JWT_SECRET;

    // Validação de segurança: Se a chave não existir, envie um erro.
    if (!secret) {
      console.error('Erro fatal: JWT_SECRET não foi definida no .env');
      return res.status(401).json({ message: 'Não autorizado (configuração inválida)' });
    }
    // --- MODIFICAÇÃO TERMINA AQUI ---

    // Verificar o token usando a chave validada
    const decoded: any = jwt.verify(token, secret); // <-- Use a variável 'secret'

    // Verificar se o usuário ainda existe
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true }
    });

    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    // Adicionar o usuário à requisição
    req.user = user;
    next();
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    // Erros de JWT (token expirado, etc.) também cairão aqui
    res.status(401).json({ message: 'Acesso não autorizado' });
  }
};