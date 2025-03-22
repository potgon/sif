import prisma from '../config/prisma';

export const createTransaction = async (data: {
  amount: number;
  description: string;
  type: 'income' | 'expense';
  category: string;
}) => {
  return prisma.transaction.create({
    data: {
      ...data,
      date: new Date(),
    },
  });
};

export const getAllTransactions = async () => {
  return prisma.transaction.findMany({
    orderBy: {
      createdAt: 'desc'
    },
  });
};