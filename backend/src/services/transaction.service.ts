import prisma from '../config/prisma';
import { TransactionInput } from '../types';

export const createTransaction = async (
  userId: string,
  data: TransactionInput,
) => {
  return prisma.transaction.create({
    data: {
      ...data,
      date: new Date(),
      userId,
    },
  });
};

export const getAllTransactions = async (userId: string) => {
  return prisma.transaction.findMany({
    where: { userId },
    orderBy: {
      createdAt: 'desc',
    },
  });
};