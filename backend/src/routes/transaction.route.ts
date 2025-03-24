import { Router } from 'express';
import { createTransaction, getAllTransactions } from '../services/transaction.service';
import { CreateTransactionSchema } from '../schemas/transaction.schema';

const router = Router();

router.post('/', async (req, res) => {
  const validatedData = CreateTransactionSchema.parse(req.body);
  const transaction = await createTransaction(req.user!.id, validatedData);
  res.status(201).json(transaction);
});

router.get('/', async (req, res) => {
  try {
    const transactions = await getAllTransactions();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Error getting transactions' });
  }
});

export const transactionRouter = router;
