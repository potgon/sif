import {Modal} from "./index"
import {Subcategory, Transaction} from "../../../api/finances/types"
import Form from "../../form/Form"
import InputField from "../../form/input/InputField"
import TextArea from "../../form/input/TextArea"
import Checkbox from "../../form/input/Checkbox"
import {useEffect, useState} from "react"
import Select, {Option} from "../../form/Select.tsx"
import DatePicker from "../../form/date-picker.tsx";
import {fetchAllSubcategories} from "../../../api/finances/metrics.ts";

interface Props {
    isOpen: boolean
    onClose: () => void
    transaction: Transaction
    onSubmit: (updated: Transaction) => void
}

export default function TransactionEditModal({isOpen, onClose, transaction, onSubmit}: Props) {
    const [formData, setFormData] = useState<Transaction>(transaction)
    const [subcategories, setSubcategories] = useState<Subcategory[]>([])

    useEffect(() => {
        fetchAllSubcategories().then(setSubcategories)
    }, [])

    useEffect(() => {
        setFormData(transaction)
    }, [transaction])

    const handleChange = (field: keyof Transaction, value: any) => {
        setFormData((prev) => ({...prev, [field]: value}))
    }

    const handleSubmit = () => {
        onSubmit(formData)
        onClose()
    }

    const subcategoryOptions: Option[] = subcategories.map((subcat) => ({
        value: subcat.name,
        label: subcat.name,
    }))

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl w-full p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
                Editar Transacción
            </h2>

            <Form onSubmit={handleSubmit} className="space-y-4">
                <InputField
                    label="Cantidad"
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => handleChange("amount", parseFloat(e.target.value))}
                />

                <DatePicker
                    id="transaction-date"
                    label="Fecha"
                    defaultDate={formData.date}
                    onChange={([selectedDate]) => {
                        const formattedDate = selectedDate?.toLocaleDateString("sv-SE").slice(0, 10) || ""
                        handleChange("date", formattedDate)
                    }}
                />

                <Select
                    label="Subcategoría"
                    options={subcategoryOptions}
                    defaultValue={transaction.subcategory.name}
                    onChange={(subcategoryName) => {
                        const selected = subcategories.find((s) => s.name === subcategoryName)
                        if (selected) {
                            handleChange("subcategory", selected)
                        }
                    }}
                />

                <TextArea
                    label="Descripción"
                    value={formData.description || ""}
                    onChange={(value) => handleChange("description", value)}
                />

                <Checkbox
                    label="Recurrente"
                    checked={formData.isRecurring}
                    onChange={(value) => handleChange("isRecurring", value)}
                />

                <TextArea
                    label="Notas"
                    value={formData.notes || ""}
                    onChange={(value) => handleChange("notes", value)}
                />

                <button type="submit" className="text-theme-xl text-gray-800 dark:text-white">
                    Actualizar
                </button>
            </Form>
        </Modal>
    )
}
