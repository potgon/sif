import {useEffect, useState} from "react"
import {Modal} from "./index"
import {fetchExtraPay, fetchParam} from "../../../api/finances/metrics"
import {ExtraPay, Param} from "../../../api/finances/types"
import InputField from "../../form/input/InputField"
import Button from "../../ui/button/Button"

interface Props {
    isOpen: boolean
    onClose: () => void
    year: number
    month: number
}

export default function IncomeModal({isOpen, onClose, year, month}: Props) {
    const [salary, setSalary] = useState<Param | null>(null)
    const [extraPay, setExtraPay] = useState<ExtraPay | null>(null)

    useEffect(() => {
        fetchParam("SALARY").then(setSalary)
        fetchExtraPay(year, month).then(setExtraPay)
    }, [year, month])

    const handleUpdate = () => {
        // 🔧 TODO: Implement update API call
        console.log("Update salary:", salary?.value)
        console.log("Update extra pay:", extraPay)
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-xl w-full p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
                Detalles de Ingresos
            </h2>

            <div className="space-y-4">
                <InputField
                    label="Salario base (€)"
                    name="salary"
                    type="number"
                    value={salary?.value ?? ""}
                    onChange={(e) =>
                        setSalary((prev) => ({...prev!, value: e.target.value}))
                    }
                />

                <InputField
                    label="Paga extra (€)"
                    name="extra"
                    type="number"
                    value={extraPay?.extraPay ?? ""}
                    onChange={(e) => setExtraPay(parseFloat(e.target.value))}
                />

                <div className="pt-2">
                    <Button variant="primary" size="sm" onClick={handleUpdate}>
                        Actualizar
                    </Button>
                </div>
            </div>
        </Modal>
    )
}
