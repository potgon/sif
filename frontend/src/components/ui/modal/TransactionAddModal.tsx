import { useState, useEffect } from "react"
import { Modal } from "./index"
import {TransactionCreate, Subcategory} from "../../../api/finances/types"
import Form from "../../form/Form"
import InputField from "../../form/input/InputField"
import TextArea from "../../form/input/TextArea"
import Checkbox from "../../form/input/Checkbox"
import DatePicker from "../../form/date-picker"
import { fetchAllSubcategories } from "../../../api/finances/metrics"
import Select, {Option} from "../../form/Select.tsx";

interface Props {
    isOpen: boolean
    onClose: () => void
    onSubmit: (transaction: TransactionCreate) => void
    year: number
    month: number
}

export default function TransactionAddModal({ isOpen, onClose, onSubmit, year, month }: Props) {
    const [subcategories, setSubcategories] = useState<Subcategory[]>([])
    const [formData, setFormData] = useState<TransactionCreate>({
        year,
        month,
        date: new Date().toLocaleDateString("es-ES").slice(0, 10),
        amount: 0,
        subcategory: subcategories[0],
        isRecurring: false,
        description: "",
        notes: "",
    })

    useEffect(() => {
        fetchAllSubcategories().then(setSubcategories)
    }, [])

    const handleChange = (field: keyof TransactionCreate, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
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
                Añadir Transacción
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
                    id="new-transaction-date"
                    label="Fecha"
                    defaultDate={formData.date}
                    onChange={([d]) =>
                        handleChange("date", d?.toLocaleDateString("sv-SE") || "")
                    }
                />

                <Select
                    label="Subcategoría"
                    options={subcategoryOptions}
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
                    onChange={(v) => handleChange("description", v)}
                />

                <Checkbox
                    label="Recurrente"
                    checked={formData.isRecurring}
                    onChange={(v) => handleChange("isRecurring", v)}
                />

                <TextArea
                    label="Notas"
                    value={formData.notes || ""}
                    onChange={(v) => handleChange("notes", v)}
                />

                <button type="submit" className="text-theme-xl text-gray-800 dark:text-white">
                    Añadir
                </button>
            </Form>
        </Modal>
    )
}
