import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt';
import prisma from '../config/prisma';
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Forbidden access' });
  }

  const decoded = verifyJwt(token);

  if (!decoded) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
  });

  if (!user) {
    return res.status(401).json({ message: 'Invalid user' });
  }

  req.user = user;
  next();
};