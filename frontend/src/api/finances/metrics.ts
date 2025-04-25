import apiClient from "../client.ts"
import {AnnualMetrics, MonthlyMetrics, MonthlyTransactions} from "./types.ts";

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