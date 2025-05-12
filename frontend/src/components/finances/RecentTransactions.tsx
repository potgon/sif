import {useEffect, useState} from "react"
import {
    createTransaction,
    fetchMonthlySubcategorySumExpenses,
    fetchMonthlyTransactionBySubcategory,
    updateTransaction
} from "../../api/finances/metrics"
import {
    MonthlySubcategoryExpense,
    MonthlyTransactionSubcategory,
    Transaction,
    TransactionUpdate
} from "../../api/finances/types"
import {useModal} from "../../hooks/useModal.ts";
import TransactionSubcategoryModal from "../ui/modal/TransactionSubcategoryModal.tsx";
import TransactionEditModal from "../ui/modal/TransactionEditModal.tsx";
import Button from "../ui/button/Button.tsx";
import TransactionAddModal from "../ui/modal/TransactionAddModal.tsx";
import Alert from "../ui/alert/Alert.tsx";

interface Props {
    year: number
    month: number
}

export default function RecentTransactions({year, month}: Props) {
    const [subcategoryExpenses, setSubcategoryExpenses] = useState<MonthlySubcategoryExpense>()
    const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
    const [subcategoryTransactions, setSubcategoryTransactions] = useState<MonthlyTransactionSubcategory>()

    const {isOpen, openModal, closeModal} = useModal()
    const {isOpen: isEditOpen, openModal: openEditModal, closeModal: closeEditModal} = useModal()
    const {isOpen: isAddOpen, openModal: openAddModal, closeModal: closeAddModal} = useModal()
    const [editingTx, setEditingTx] = useState<Transaction | null>(null)

    const [modalAlert, setModalAlert] = useState<{
        variant: "success" | "error";
        title: string;
        message: string;
    } | null>(null)

    const [creationAlert, setCreationAlert] = useState<{
        variant: "success" | "error";
        title: string;
        message: string;
    } | null>(null)

    useEffect(() => {
        fetchMonthlySubcategorySumExpenses(year, month)
            .then(setSubcategoryExpenses)
            .catch((err) => console.error("Error fetching subcategories", err))
    }, [year, month])

    const handleRowClick = async (subcategoryName: string) => {
        setSelectedSubcategory(subcategoryName)
        const transactions = await fetchMonthlyTransactionBySubcategory(year, month, subcategoryName)
        setSubcategoryTransactions(transactions)
        openModal()
    }

    return (
        <>
            {creationAlert && (
                <div className="mb-4">
                    <Alert
                        variant={creationAlert.variant}
                        title={creationAlert.title}
                        message={creationAlert.message}
                    />
                </div>
            )}
            <div
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
                        Gastos por Subcategoría
                    </h3>

                    <Button
                        size="sm"
                        variant="primary"
                        onClick={() => {
                            openAddModal()
                        }}
                    >
                        Añadir
                    </Button>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="min-w-full text-sm text-gray-500 dark:text-gray-400">
                        <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="px-6 py-4 text-left font-semibold">Subcategoría</th>
                            <th className="px-6 py-4 text-right font-semibold">Gasto Total</th>
                        </tr>
                        </thead>
                        <tbody>
                        {subcategoryExpenses?.subcategoryExpenses.map((subcat) => (
                            <tr
                                key={subcat.subcategory?.name}
                                className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                onClick={() => handleRowClick(subcat.subcategory?.name)}
                            >
                                <td className="font-semibold px-6 py-4">{subcat.subcategory?.name}</td>
                                <td className="font-semibold px-6 py-4 text-right">€ {subcat.amount.toFixed(2)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <TransactionSubcategoryModal
                isOpen={isOpen}
                onClose={closeModal}
                transactions={subcategoryTransactions?.transactions || []}
                subcategoryName={selectedSubcategory}
                onTransactionClick={(tx) => {
                    console.log(tx)
                    setEditingTx(tx)
                    openEditModal()
                }}
                alert={modalAlert}
            />

            <TransactionAddModal
                isOpen={isAddOpen}
                onClose={closeAddModal}
                year={year}
                month={month}
                onSubmit={async (newTx) => {
                    const response = await createTransaction(newTx)
                    setCreationAlert({
                        variant: response.id ? "success" : "error",
                        title: response.id ? "Transacción añadida" : "No se ha podido añadir la transacción",
                        message: response.id ? "Transacción añadida" : "No se ha podido añadir la transacción"
                    })
                    if (selectedSubcategory) {
                        fetchMonthlyTransactionBySubcategory(year, month, selectedSubcategory)
                            .then(setSubcategoryTransactions)
                        window.dispatchEvent(new CustomEvent('transactionUpdated'))
                    }
                    fetchMonthlySubcategorySumExpenses(year, month)
                        .then(setSubcategoryExpenses)
                    setTimeout(() => setCreationAlert(null), 5000)
                }}
            />

            {editingTx && (
                <TransactionEditModal
                    isOpen={isEditOpen}
                    onClose={closeEditModal}
                    transaction={editingTx}
                    onSubmit={async (updatedTx) => {
                        const transactionUpdate: TransactionUpdate = {
                            id: updatedTx.id,
                            ...(updatedTx.date !== undefined && {date: updatedTx.date}),
                            ...(updatedTx.amount !== undefined && {amount: updatedTx.amount}),
                            ...(updatedTx.description !== undefined && {description: updatedTx.description}),
                            ...(updatedTx.subcategory !== undefined && {subcategory: updatedTx.subcategory}),
                            ...(updatedTx.isRecurring !== undefined && {isRecurring: updatedTx.isRecurring}),
                            ...(updatedTx.notes !== undefined && {notes: updatedTx.notes})
                        }
                        const response = await updateTransaction(editingTx?.id, transactionUpdate)
                        setSubcategoryTransactions(prev => ({
                            ...prev!,
                            transactions: prev!.transactions.map((tx) =>
                                tx.id === response.id ? response : tx
                            )
                        }))
                        const updatedExpenses = await fetchMonthlySubcategorySumExpenses(year, month)
                        setSubcategoryExpenses(updatedExpenses)
                        window.dispatchEvent(new CustomEvent('transactionUpdated'));
                        closeEditModal()
                    }}
                    onDelete={(response) => {
                        if (response.result) {
                            setSubcategoryTransactions((prev) => ({
                                ...prev!,
                                transactions: prev!.transactions.filter((tx) => tx.id !== response.id),
                            }))
                            fetchMonthlySubcategorySumExpenses(year, month).then(setSubcategoryExpenses)
                            window.dispatchEvent(new CustomEvent('transactionUpdated'));
                        }
                        setModalAlert({
                            variant: response.result ? "success" : "error",
                            title: response.result ? "Transacción eliminada" : "No se pudo eliminar la transacción",
                            message: response.message,
                        })
                        setTimeout(() => setModalAlert(null), 5000)
                    }}
                />
            )}
        </>
    )
}