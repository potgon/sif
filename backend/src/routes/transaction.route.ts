import { Router } from 'express';
import { createTransaction, getAllTransactions } from '../services/transaction.service';
import type { PrismaClient } from '@prisma/client';

export default function transactionRouter(prisma: PrismaClient) {
  const router = Router();
  router.post('/', async (req, res) => {
    try {
      const transaction = await createTransaction(req.body);
      res.status(201).json(transaction);
    } catch (error) {
      res.status(500).json({ error: 'Error creating transaction' });
    }
  });

  router.get('/', async (req, res) => {
    try {
      const transactions = await getAllTransactions();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: 'Error getting transactions' });
    }
  });

  return router;
}
