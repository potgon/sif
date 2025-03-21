import express from 'express';
import cors from 'cors';
import { healthRouter } from '../routes/health.route';

export const createServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/api', healthRouter);

  return app;
};