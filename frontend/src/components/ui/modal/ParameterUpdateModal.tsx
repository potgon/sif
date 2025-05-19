import {useEffect, useState} from "react"
import {Modal} from "./index"
import {fetchParam, updateParam} from "../../../api/finances/params"
import InputField from "../../form/input/InputField"
import Button from "../../ui/button/Button"
import {Param} from "../../../api/finances/types.ts";

interface Props {
    isOpen: boolean
    onClose: () => void
    refreshData: () => void
}

export default function ParameterUpdateModal({isOpen, onClose, refreshData}: Props) {
    const [target, setTarget] = useState<Param | null>(null)
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsLoading(true);
            fetchParam("EXPENSE_TARGET")
                .then(setTarget)
                .finally(() => setIsLoading(false));
        }
    }, [isOpen]);

    const handleUpdate = async () => {
        if (!target?.value) return;

        try {
            await updateParam({key: target.name, value: target.value});
            refreshData();
            window.dispatchEvent(new CustomEvent('transactionUpdated'));
            onClose();
        } catch (error) {
            console.error("Error updating parameter:", error);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-xl w-full p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
                Objetivo de Gasto
            </h2>

            <div className="space-y-4">
                {isLoading ? (
                    <div>Cargando...</div>
                ) : (
                    <>
                        <InputField
                            label="Gasto (%)"
                            name="target"
                            type="number"
                            value={target?.value ?? ""}
                            onChange={(e) =>
                                setTarget(prev => prev ?
                                    {...prev, value: e.target.value}
                                    : null
                                )
                            }
                        />

                        <div className="pt-2">
                            <Button
                                type="submit"
                                variant="primary"
                                size="sm"
                                onClick={handleUpdate}
                                disabled={!target?.value}
                            >
                                Actualizar
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    )
}
