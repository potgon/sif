import {useState, useEffect, useMemo} from "react"
import {Modal} from "./index"
import {TransactionCreate, Subcategory} from "../../../api/expenses/types"
import Form from "../../form/Form"
import InputField from "../../form/input/InputField"
import TextArea from "../../form/input/TextArea"
import Checkbox from "../../form/input/Checkbox"
import DatePicker from "../../form/date-picker"
import {fetchAllSubcategories} from "../../../api/expenses/subcategory"
import Select, {Option} from "../../form/Select.tsx";
import Button from "../button/Button.tsx";
import {EditPencil, PlusIcon} from "../../../icons/index.ts"
import {useModal} from "../../../hooks/useModal.ts"
import SubcategoryCreateModal from "./SubcategoryCreateModal.tsx"
import SubcategoryEditModal from "./SubcategoryEditModal.tsx"

interface Props {
    isOpen: boolean
    onClose: () => void
    onSubmit: (transaction: TransactionCreate) => void
    year: number
    month: number
}

export default function TransactionAddModal({isOpen, onClose, onSubmit, year, month}: Readonly<Props>) {
    const [subcategories, setSubcategories] = useState<Subcategory[]>([])
    const {isOpen: isCreateSubOpen, openModal: openCreateSub, closeModal: closeCreateSub} = useModal()
    const {isOpen: isEditSubOpen, openModal: openEditSub, closeModal: closeEditSub} = useModal()
    const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null)
    const [formData, setFormData] = useState<TransactionCreate>({
        year,
        month,
        date: new Date().toLocaleDateString("sv-SE").slice(0, 10),
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
        setFormData((prev) => ({...prev, [field]: value}))
    }

    const handleSubmit = () => {
        if (!formData.subcategory) {
            return
        }
        onSubmit(formData)
        onClose()
    }

    const subcategoryOptions: Option[] = useMemo(() =>
            subcategories.map((subcat) => ({
                value: subcat.name,
                label: subcat.name,
            })),
        [subcategories]
    )

    useEffect(() => {
        if (subcategories.length > 0) {
            handleChange("subcategory", subcategories[subcategories.length - 1])
        }
    }, [subcategories])

    return (
        <>
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

                    <div className="flex items-end gap-2">
                        <div className="flex-1">
                            <Select
                                label="Subcategoría"
                                options={subcategoryOptions}
                                value={formData.subcategory?.name || ""}
                                onChange={(subcategoryName) => {
                                    const selected = subcategories.find(s => s.name === subcategoryName)
                                    if (selected) handleChange("subcategory", selected)
                                }}
                                className="w-full h-12"
                            />
                        </div>
                        <div className="flex flex-col gap-1 h-16 justify-between">
                            <button
                                type="button"
                                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                                onClick={openCreateSub}
                                title="Crear nueva subcategoría"
                            >
                                <PlusIcon className="w-6 h-6 text-primary"/>
                            </button>

                            <button
                                type="button"
                                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:hover:bg-transparent"
                                title="Editar subcategoría"
                                disabled={!formData.subcategory || subcategories.length === 0}
                                onClick={() => {
                                    const exists = subcategories.some(s => s.id === formData.subcategory?.id)
                                    if (exists) {
                                        setSelectedSubcategory(formData.subcategory)
                                        openEditSub()
                                    } else {
                                        handleChange("subcategory", subcategories[0] || null)
                                    }
                                }}
                            >
                                <EditPencil className="w-6 h-6 text-primary"/>
                            </button>
                        </div>
                    </div>

                    <TextArea
                        label="Descripción"
                        value={formData.description ?? ""}
                        onChange={(v) => handleChange("description", v)}
                    />

                    <Checkbox
                        label="Recurrente"
                        checked={formData.isRecurring}
                        onChange={(v) => handleChange("isRecurring", v)}
                    />

                    <TextArea
                        label="Notas"
                        value={formData.notes ?? ""}
                        onChange={(v) => handleChange("notes", v)}
                    />

                    <Button
                        type="submit"
                        variant={formData.subcategory ? "primary" : "outline"}
                        size="sm"
                        disabled={!formData.subcategory}
                    >
                        Añadir
                    </Button>
                </Form>
            </Modal>
            <SubcategoryCreateModal
                isOpen={isCreateSubOpen}
                onClose={closeCreateSub}
                onSubmit={(newSubcategory) => {
                    setSubcategories(prev => [...prev, newSubcategory])
                    handleChange("subcategory", newSubcategory)
                }}
            />
            <SubcategoryEditModal
                isOpen={isEditSubOpen}
                onClose={closeEditSub}
                subcategory={selectedSubcategory}
                onUpdate={(updatedSub) => {
                    setSubcategories(prev =>
                        prev.map(sub => sub.id === updatedSub.id ? updatedSub : sub)
                    )
                    if (formData.subcategory?.id === updatedSub.id) {
                        handleChange("subcategory", updatedSub)
                    }
                    closeEditSub()
                }}
                onDelete={(deleteResult) => {
                    if (deleteResult.result) {
                        setSubcategories(prev =>
                            prev.filter(sub => sub.id !== deleteResult.id)
                        )
                        if (formData.subcategory?.id === deleteResult.id) {
                            const newSubcategory = subcategories.filter(s => s.id !== deleteResult.id)[0] || null
                            handleChange("subcategory", newSubcategory)
                            if (subcategories.length === 1) {
                                closeEditSub()
                                setSelectedSubcategory(null)
                            }
                        }
                    }
                    closeEditSub()
                }}
            />
        </>
    )
}
