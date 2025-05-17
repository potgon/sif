import apiClient from "../client.ts"
import {
    AnnualMetrics,
    MonthlyExpenseTarget,
    MonthlyMetrics,
    MonthlySubcategoryExpense,
    MonthlyTransactionSubcategory,
    MonthlyTransactions,
    TransactionCreate,
    TransactionUpdate,
    Transaction,
    Subcategory,
    Delete,
    Param,
    ExtraPay, IncomeUpdate
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
    const response = await apiClient.get("/transactions/monthly", {
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

export const fetchAllSubcategories = async (): Promise<Subcategory[]> => {
    const response = await apiClient.get("/subcategory")
    return response.data
}

export const fetchParam = async (paramName: string): Promise<Param> => {
    const response = await apiClient.get(`/params/income/${paramName}`)
    return response.data
}

export const fetchExtraPay = async (
    year: number,
    month: number
): Promise<ExtraPay> => {
    const response = await apiClient.get("/metrics/extra", {
        params: {year, month},
    })
    return response.data
}

export const updateIncome = async (income: IncomeUpdate): Promise<IncomeUpdate> => {
    const response = await apiClient.patch("/metrics/income/update", income)
    return response.data
}

export const updateParam = async (payload: { key: string, value: string }): Promise<Param> => {
    const response = await apiClient.post(`/params/target`, payload)
    return response.data
}