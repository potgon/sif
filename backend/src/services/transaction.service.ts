import {prisma} from '@/prisma/client';
import {Transaction} from "@/types/entities";

export const createTransaction = async (data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> => {
    return await prisma.transaction.create({
        data,
    })
}

export const getTransactionsByUser = async (userId: string): Promise<Transaction[]> => {
    return await prisma.transaction.findMany({
        where: { userId },
        orderBy: {
            date: 'desc',
        },
    })
}

export const updateTransaction = async (
    id: string,
    data: Partial<Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Transaction> => {
    return await prisma.transaction.update({
        where: { id },
        data,
    })
}

export const deleteTransaction = async (id: string): Promise<Transaction> => {
    return await prisma.transaction.delete({
        where: { id },
    })
}