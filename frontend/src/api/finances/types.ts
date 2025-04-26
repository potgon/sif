export interface MonthlyMetrics {
    totalIncome: number
    totalExpenses: number
    prevMonthIncomeDiff: number
    prevMonthExpensesDiff: number
}

export interface AnnualMetrics {
    year: number
    totalExpenses: number[]
}

export interface MonthlyTransactions {
    year: number
    month: number
    transactions: Transaction[]
}

export interface Transaction {
    id: number
    period: Period
    date: string
    amount: number
    description?: string
    category: Category
    subcategory: Subcategory
    isRecurring: boolean
    notes?: string
    createdAt: string
}

export interface Period {
    id: number
    year: number
    month: number
    startingBalance: number
    expenseTarget: number
}

export interface Category {
    id: number
    categoryType: CategoryType
}

export interface Subcategory {
    id: number
    name: string
}

enum CategoryType {
    INCOME = "INCOME",
    EXPENSE = "EXPENSE",
    INVERSION = "INVERSION",
    DEBT = "DEBT",
}

export interface MonthlyExpenseTarget {
    currentExpensePercentage: number
    targetExpense: number
    currentExpense: number
    surplus: number
    accumulated: number
}

