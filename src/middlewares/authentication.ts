import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: any; 
    }
  }
}

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error('La clave secreta JWT no está definida en las variables de entorno');
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ error: 'Token de autenticación no proporcionado' });
  }

  jwt.verify(token, jwtSecret!, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token de autenticación inválido' });
    }
    req.user = user; 
    next(); 
  });
}
