import express from 'express';
import cors from 'cors';
import { healthRouter } from '../routes/health.route';
import transactionRouter from '../routes/transaction.route';
import { PrismaClient } from '@prisma/client';

export const createServer = (prisma: PrismaClient) => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/api', healthRouter);
  app.use('/api/transactions', transactionRouter(prisma));


  return app;
};