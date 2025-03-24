export type TransactionInput = {
  id?: string;
  amount: number;
  description: string;
  type: 'income' | 'expense';
  category: string;
  date?: Date;
}

export type Transaction = TransactionInput & {
  id: string;
  date: Date;
  userId: string;
}