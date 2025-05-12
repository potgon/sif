import {useEffect, useState} from "react"
import {Modal} from "./index"
import {fetchExtraPay, fetchParam, updateIncome} from "../../../api/finances/metrics"
import {ExtraPay, IncomeUpdate, Param} from "../../../api/finances/types"
import InputField from "../../form/input/InputField"
import Button from "../../ui/button/Button"

interface Props {
    isOpen: boolean
    onClose: () => void
    year: number
    month: number
    refreshData: () => void
}

export default function IncomeModal({isOpen, onClose, year, month, refreshData}: Props) {
    const [salary, setSalary] = useState<Param | null>(null)
    const [extraPay, setExtraPay] = useState<ExtraPay | null>(null)

    useEffect(() => {
        if (isOpen) {
            fetchParam("SALARY").then(setSalary)
            fetchExtraPay(year, month).then(setExtraPay)
        }
    }, [isOpen, year, month])

    const handleUpdate = async () => {
        const incomeData: IncomeUpdate = {
            year,
            month,
            salary: salary?.value,
            extraPay: extraPay?.extraPay
        };
        await updateIncome(incomeData);
        refreshData()
        onClose()
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
                    onChange={(e) =>
                        setExtraPay((prev) =>
                            prev ? {...prev, extraPay: parseFloat(e.target.value)} : null
                        )
                    }
                />

                <div className="pt-2">
                    <Button type="submit" variant="primary" size="sm" onClick={handleUpdate}>
                        Actualizar
                    </Button>
                </div>
            </div>
        </Modal>
    )
}
