import {MonthlyTransactionSubcategory, Transaction} from "../../../api/expenses/types.ts";
import Alert from "../alert/Alert.tsx";
import {Modal} from "./index.tsx";

export default function TransactionSubcategoryModal({
                                                        isOpen,
                                                        onClose,
                                                        transactions,
                                                        subcategoryName,
                                                        onTransactionClick,
                                                        alert
                                                    }: Readonly<{
    isOpen: boolean
    onClose: () => void
    transactions: MonthlyTransactionSubcategory['transactions']
    subcategoryName: string | null
    onTransactionClick: (tx: Transaction) => void
    alert: {
        variant: "success" | "error"
        title: string
        message: string
    } | null
}>) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl w-full p-6">
            <h2 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-white">
                Transacciones en {subcategoryName}
            </h2>
            {alert && (
                <div className="mb-4 w-full">
                    <Alert
                        variant={alert.variant}
                        title={alert.title}
                        message={alert.message}
                    />
                </div>
            )}
            <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2">
                {transactions.map((tx) => (
                    <div
                        key={tx.id}
                        onClick={() => onTransactionClick(tx)}
                        className="border p-4 rounded-lg bg-white dark:bg-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                        <p className="text-theme-xl font-semibold text-gray-800 dark:text-white">
                            {new Date(tx.date).toLocaleDateString("es-ES")} - €{tx.amount.toFixed(2)}
                        </p>
                        <p className="text-theme-sm--line-height text-gray-500 dark:text-gray-300">{tx.description}</p>
                        <p className="text-gray-700 dark:text-gray-300">{tx.notes}</p>
                        {tx.isRecurring && (
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Recurrente</p>
                        )}
                    </div>
                ))}
            </div>
        </Modal>
    )
}