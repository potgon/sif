import apiClient from "../client.ts"
import {
    Delete,
    MonthlySubcategoryExpense,
    MonthlyTransactions,
    MonthlyTransactionSubcategory, Transaction,
    TransactionCreate, TransactionUpdate
} from "./types.ts";

export const fetchMonthlyTransactions = async (
    year: number,
    month: number
): Promise<MonthlyTransactions> => {
    const response = await apiClient.get("/transactions/monthly", {
        params: {year, month},
    })
    return response.data
}

export const fetchMonthlyTransactionBySubcategory = async (
    year: number,
    month: number,
    subcategory: string
): Promise<MonthlyTransactionSubcategory> => {
    const response = await apiClient.get("/transactions/monthly/subcategory", {
        params: {year, month, subcategory},
    })
    return response.data
}

export const fetchMonthlySubcategorySumExpenses = async (
    year: number,
    month: number
): Promise<MonthlySubcategoryExpense> => {
    const response = await apiClient.get("/transactions/monthly/subcategory/sum", {
        params: {year, month},
    })
    return response.data
}

export const createTransaction = async (transaction: TransactionCreate): Promise<Transaction> => {
    const response = await apiClient.post("/transactions/new", transaction)
    return response.data
}

export const updateTransaction = async (id: number, transaction: TransactionUpdate): Promise<Transaction> => {
    const response = await apiClient.patch(`/transactions/${id}`, transaction)
    return response.data
}

export const deleteTransaction = async (transactionId: number): Promise<Delete> => {
    const response = await apiClient.delete(`/transactions/${transactionId}`)
    return response.data
}