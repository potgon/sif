import apiClient from "../client.ts"
import {
    AnnualMetrics,
    MonthlyExpenseTarget,
    MonthlyMetrics,
    ExtraPay,
    IncomeUpdate
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

export const fetchMonthlyExpenseTarget = async (
    year: number,
    month: number
): Promise<MonthlyExpenseTarget> => {
    const response = await apiClient.get("/metrics/monthly/target", {
        params: {year, month},
    })
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
