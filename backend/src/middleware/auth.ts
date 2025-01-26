import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
      };
    }
  }
}

export const auth = (async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: '未提供认证令牌' });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as {
      id: number;
      email: string;
    };
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: '无效的认证令牌' });
  }
}) as RequestHandler; 