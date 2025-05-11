export interface MonthlyMetrics {
    totalIncome: number
    totalExpenses: number
    prevMonthIncomeDiff: number
    prevMonthExpensesDiff: number
}

export interface AnnualMetrics {
    totalExpenses: number[]
}

export interface MonthlyTransactions {
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
    periodSalary: number
    extraPay: number
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
    targetPercentage: number
    surplus: number
    accumulated: number
}

export interface MonthlyTransactionSubcategory {
    transactions: Transaction[]
}

export interface MonthlySubcategoryExpense {
    subcategoryExpenses: SubcategoryExpense[]
}

export interface SubcategoryExpense {
    subcategory: Subcategory
    amount: number
    isRecurrent: boolean
}

export interface TransactionCreate {
    year: number
    month: number
    date: string
    amount: number
    description?: string
    subcategory: Subcategory
    isRecurring: boolean
    notes?: string
}

export interface TransactionUpdate {
    id: number
    date?: string
    amount?: number
    description?: string
    subcategory?: Subcategory
    isRecurring?: boolean
    notes?: string
}

export interface TransactionDelete {
    id: number
    result: boolean
    message: string
}

export interface Param {
    id: number
    name: string
    value: string
    createdAt: string
}

