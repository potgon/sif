// User entity
export interface User {
    id: string
    email: string
    name: string
    createdAt: Date
    updatedAt: Date
}

// Income entity
export interface Income {
    id: string
    userId: string
    amount: number
    currency: string // Default: EUR
    date: Date
    source: string // e.g., "Salary", "Freelance", etc.
    description?: string
    createdAt: Date
    updatedAt: Date
}

// Category types
export enum CategoryType {
    EXPENSE = "EXPENSE",
    INVERSION = "INVERSION",
}

// Main category entity
export interface Category {
    id: string
    userId: string
    name: string // e.g., "Monthly Payments", "Leisure", "Inversion", "Debt"
    type: CategoryType
    objectivePercentage: number // Target percentage of income
    createdAt: Date
    updatedAt: Date
}

// Subcategory entity
export interface Subcategory {
    id: string
    categoryId: string
    userId: string
    name: string // e.g., "Groceries", "Rent", "Stocks", etc.
    createdAt: Date
    updatedAt: Date
}

// Transaction entity
export interface Transaction {
    id: string
    userId: string
    categoryId: string
    subcategoryId?: string
    amount: number
    currency: string // Default: EUR
    date: Date
    description?: string
    createdAt: Date
    updatedAt: Date
}

// Monthly summary entity
export interface MonthlySummary {
    id: string
    userId: string
    month: number // 1-12
    year: number
    totalIncome: number
    totalExpense: number
    totalInversion: number
    expensePercentage: number
    inversionPercentage: number
    surplus: number
    accumulated: number
    lastRevision: Date
    createdAt: Date
    updatedAt: Date
}

// Debt entity
export interface Debt {
    id: string
    userId: string
    amount: number
    currency: string // Default: EUR
    isOwedByUser: boolean // true if user owes someone, false if someone owes user
    personName: string // Who owes/is owed
    description?: string
    dueDate?: Date
    isPaid: boolean
    createdAt: Date
    updatedAt: Date
}

