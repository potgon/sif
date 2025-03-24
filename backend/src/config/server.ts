import express from 'express';
import cors from 'cors';
import { healthRouter } from '../routes/health.route';
import { transactionRouter } from '../routes/transaction.route';
import { errorHandler } from '../middleware/errorHandler';
import { authRouter } from '../routes/auth.route';

export const createServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/api', healthRouter);
  app.use('/api/transactions', transactionRouter);
  app.use('/auth', authRouter);

  app.use(errorHandler);

  return app;
};