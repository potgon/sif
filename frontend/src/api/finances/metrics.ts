import apiClient from "../client.ts"

export interface MonthlyMetrics {
    periodId: number
    year: number
    month: number
    totalIncome: number
    totalExpenses: number
    expenseTarget: number
    prevMonthIncomeDiff: number
    prevMonthExpensesDiff: number
}

export const fetchMonthlyMetrics = async (
    year: number,
    month: number
): Promise<MonthlyMetrics> => {
    const response = await apiClient.get("/metrics/monthly", {
        params: { year, month },
    })
    return response.data
}