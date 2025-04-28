import { useEffect, useState } from "react"
import { Modal } from "./index.tsx"
import { Transaction } from "../../../api/finances/types"
import { fetchMonthlyTransactions } from "../../../api/finances/metrics"
import { format } from "date-fns"

interface Props {
    year: number
    month: number
    isOpen: boolean
    onClose: () => void
}

export default function TransactionPeriodDetailModal({ year, month, isOpen, onClose }: Props) {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (isOpen) {
            setLoading(true)
            fetchMonthlyTransactions(year, month)
                .then((data) => setTransactions(data.transactions))
                .catch((err) => console.error("Failed to fetch monthly transactions", err))
                .finally(() => setLoading(false))
        }
    }, [year, month, isOpen])

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-5xl w-full p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
                Transacciones de {year}-{String(month).padStart(2, "0")}
            </h2>

            {loading ? (
                <p className="text-gray-500 dark:text-gray-400">Cargando transacciones...</p>
            ) : transactions.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No se han encontrado transacciones para este periodo.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {transactions.map((tx) => (
                        <div
                            key={tx.id}
                            className="border border-gray-200 rounded-lg p-5 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {format(new Date(tx.date), "PPP")}
                                    </p>
                                    <h4 className="text-lg font-bold text-gray-800 dark:text-white mt-1">
                                        {tx.amount.toFixed(2)}€
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {tx.category.categoryType} {tx.subcategory?.name && `• ${tx.subcategory.name}`}
                                    </p>
                                    {tx.isRecurring && (
                                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                            Recurrente
                                        </p>
                                    )}
                                </div>
                            </div>

                            {tx.description && (
                                <div className="mt-3">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Descripción</p>
                                    <p className="text-gray-700 dark:text-gray-300">{tx.description}</p>
                                </div>
                            )}

                            {tx.notes && (
                                <div className="mt-3">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Notas</p>
                                    <p className="text-gray-700 dark:text-gray-300">{tx.notes}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </Modal>
    )
}
