import {useState, useEffect} from "react";
import {Modal} from "./index";
import Form from "../../form/Form";
import Button from "../button/Button";
import {Subcategory, Delete} from "../../../api/finances/types";
import {deleteSubcategory, updateSubcategory} from "../../../api/finances/metrics.ts";
import InputField from "../../form/input/InputField.tsx";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    subcategory: Subcategory | null;
    onUpdate: (updated: Subcategory) => void;
    onDelete: (deleted: Delete) => void;
}

export default function SubcategoryEditModal({isOpen, onClose, subcategory, onUpdate, onDelete}: Readonly<Props>) {
    const [name, setName] = useState(subcategory?.name ?? "");

    useEffect(() => {
        setName(subcategory?.name ?? "");
    }, [subcategory]);

    const handleUpdate = async () => {
        if (subcategory) {
            const updated: Subcategory = {
                ...subcategory,
                name: name
            }
            const response = await updateSubcategory(updated)
            onUpdate(response);
            onClose();
        }
    };

    const handleDelete = async () => {
        if (subcategory) {
            const response = await deleteSubcategory(subcategory.id)
            onDelete(response);
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl w-full p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
                Editar Subcategoría
            </h2>

            <Form className="space-y-4" onSubmit={e => {
                e.preventDefault();
                handleUpdate();
            }}>
                <InputField
                    label="Nombre"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Introduce el nuevo nombre de la subcategoría"
                />

                <div className="flex justify-between">
                    <Button type="submit" variant="primary" size="sm">
                        Actualizar
                    </Button>

                    <Button type="button" variant="primary" size="sm" onClick={handleDelete}>
                        Borrar
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}
