import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'seu_jwt_secret_seguro';

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

    // Verificar o token
    const decoded: any = jwt.verify(token, JWT_SECRET);

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
    res.status(401).json({ message: 'Acesso não autorizado' });
  }
};