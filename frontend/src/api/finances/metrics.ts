import apiClient from "../client.ts"
import {
    AnnualMetrics,
    MonthlyExpenseTarget,
    MonthlyMetrics, MonthlySubcategoryExpense,
    MonthlyTransactionSubcategory,
    MonthlyTransactions
} from "./types.ts";

export const fetchMonthlyMetrics = async (
    year: number,
    month: number
): Promise<MonthlyMetrics> => {
    const response = await apiClient.get("/metrics/monthly", {
        params: {year, month},
    })
    return response.data
}

export const fetchAnnualMetrics = async (
    year: number
): Promise<AnnualMetrics> => {
    const response = await apiClient.get("/metrics/annual", {
        params: {year},
    })
    return response.data
}

export const fetchMonthlyTransactions = async (
    year: number,
    month: number
): Promise<MonthlyTransactions> => {
    const response = await apiClient.get("/metrics/monthly/transactions", {
        params: {year, month},
    })
    return response.data
}

export const fetchMonthlyExpenseTarget = async (
    year: number,
    month: number
): Promise<MonthlyExpenseTarget> => {
    const response = await apiClient.get("/metrics/monthly/target", {
        params: {year, month},
    })
    return response.data
}

export const fetchMonthlyTransactionBySubcategory = async (
    year: number,
    month: number,
    subcategory: string
): Promise<MonthlyTransactionSubcategory> => {
    const response = await apiClient.get("/metrics/monthly/transaction/subcategory", {
        params: {year, month, subcategory},
    })
    return response.data
}

export const fetchMonthlySubcategoryExpenses = async (
    year: number,
    month: number
): Promise<MonthlySubcategoryExpense> => {
    const response = await apiClient.get("/metrics/monthly/transactions/subcategory/sum", {
        params: {year, month},
    })
    return response.data
}