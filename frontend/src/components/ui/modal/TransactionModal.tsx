import { useEffect, useState } from "react"
import { Modal } from "../modal"
import {MonthlyTransactions} from "../../../api/finances/types.ts";
import {fetchMonthlyTransactions} from "../../../api/finances/metrics.ts";

interface Props {
    year: number
    month: number
    onClose: () => void
}

export default function TransactionModal({ year, month, onClose }: Readonly<Props>) {
    const [data, setData] = useState<MonthlyTransactions | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        fetchMonthlyTransactions(year, month)
            .then(setData)
            .catch((err) => console.error("Failed to load transactions", err))
            .finally(() => setLoading(false))
    }, [year, month])

    return (
        <Modal isOpen={true} onClose={onClose} className="max-w-3xl w-full p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                Transactions for {year}-{String(month).padStart(2, "0")}
            </h2>

            {loading ? (
                <p className="text-gray-500 dark:text-gray-400">Loading...</p>
            ) : !data || data.transactions.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No transactions found.</p>
            ) : (
                <ul className="space-y-3 max-h-[500px] overflow-y-auto">
                    {data.transactions.map((tx) => (
                        <li
                            key={tx.id}
                            className="border border-gray-200 rounded-lg p-4 dark:border-gray-700"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(tx.date).toLocaleDateString()}
                                    </p>
                                    <p className="font-medium text-gray-800 dark:text-white">
                                        {tx.description || "No description"}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {tx.category.categoryType}
                                        {tx.subcategory?.name ? ` • ${tx.subcategory.name}` : ""}
                                    </p>
                                    {tx.isRecurring && (
                                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                            Recurring
                                        </p>
                                    )}
                                </div>

                                <p
                                    className={`text-lg font-bold ${
                                        tx.category.categoryType === "INCOME"
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                >
                                    € {tx.amount.toFixed(2)}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </Modal>
    )
}
