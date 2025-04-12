import type { Transaction } from "./entities"

export interface DashboardSummary {
    income: number
    expenseObjective: number
    expenseActual: number
    inversionObjective: number
    inversionActual: number
    surplus: number
    accumulated: number
    recentTransactions: Transaction[]
}

export interface MonthlyComparison {
    name: string // Month name (e.g., "Jan", "Feb")
    expenses: number
    inversions: number
}

export interface MonthlyData {
    month: number
    monthName: string
    income: number
    expense: number
    inversion: number
    surplus: number
    accumulated: number
}

export interface YearlyOverview {
    year: number
    totalIncome: number
    totalExpense: number
    totalInversion: number
    monthlySummaries: MonthlyData[]
}
