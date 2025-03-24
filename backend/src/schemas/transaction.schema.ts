import { z } from 'zod';

export const CreateTransactionSchema = z.object({
  amount: z.number({ message: 'Amount must be a number' }),
  description: z.string({}),
  type: z.enum(['income', 'expense']),
  category: z.string().min(1, 'Category is required'),
});