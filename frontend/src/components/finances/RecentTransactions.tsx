import {useEffect, useState} from "react"
import {fetchMonthlySubcategoryExpenses, fetchMonthlyTransactionBySubcategory} from "../../api/finances/metrics"
import {Modal} from "../ui/modal"
import {MonthlySubcategoryExpense, MonthlyTransactionSubcategory} from "../../api/finances/types"

interface Props {
    year: number
    month: number
}

export default function RecentTransactions({year, month}: Props) {
    const [subcategories, setSubcategories] = useState<MonthlySubcategoryExpense>()
    const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
    const [subcategoryTransactions, setSubcategoryTransactions] = useState<MonthlyTransactionSubcategory>()
    const [modalOpen, setModalOpen] = useState(false)

    useEffect(() => {
        fetchMonthlySubcategoryExpenses(year, month)
            .then(setSubcategories)
            .catch((err) => console.error("Error fetching subcategories", err))
    }, [year, month])

    const handleRowClick = async (year: number, month: number, subcategoryName: string) => {
        setSelectedSubcategory(subcategoryName)
        const transactions = await fetchMonthlyTransactionBySubcategory(year, month, subcategoryName)
        setSubcategoryTransactions(transactions)
        setModalOpen(true)
    }

    return (
        <>
            <div
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
                    Gastos por subcategoría
                </h3>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="min-w-full text-sm text-gray-500 dark:text-gray-400">
                        <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="px-6 py-4 text-left font-semibold">Subcategoría</th>
                            <th className="px-6 py-4 text-right font-semibold">Gasto Total</th>
                        </tr>
                        </thead>
                        <tbody>
                        {subcategories?.subcategoryExpenses.map((subcat) => (
                            <tr
                                key={subcat.subcategory?.name}
                                className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                onClick={() => handleRowClick(year, month, subcat.subcategory?.name)}
                            >
                                <td className="px-6 py-4">{subcat.subcategory?.name}</td>
                                <td className="px-6 py-4 text-right">€ {subcat.amount.toFixed(2)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} className="max-w-4xl w-full p-6">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
                    Transacciones en {selectedSubcategory}
                </h2>

                <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2">
                    {subcategoryTransactions?.transactions.map((tx) => (
                        <div key={tx.id} className="border p-4 rounded-lg bg-white dark:bg-gray-800">
                            <p className="font-semibold text-gray-800 dark:text-white">
                                {new Date(tx.date).toLocaleDateString()} - €{tx.amount.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{tx.description || "No description"}</p>
                        </div>
                    ))}
                </div>
            </Modal>
        </>
    )
}
