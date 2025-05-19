import { useState } from "react";
import { Modal } from "./index";
import Form from "../../form/Form";
import Button from "../button/Button";
import { Subcategory } from "../../../api/expenses/types"
import {createSubcategory} from "../../../api/expenses/subcategory.ts";
import InputField from "../../form/input/InputField.tsx";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (newSubcategory: Subcategory) => void;
}

export default function SubcategoryCreateModal({ isOpen, onClose, onSubmit }: Readonly<Props>) {
    const [name, setName] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (name.length < 1) return;

        const response = await createSubcategory(name);
        onSubmit(response);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl w-full p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
                Crear Subcategoría
            </h2>

            <Form onSubmit={handleSubmit} className="space-y-4">
                <InputField
                    label="Nombre"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    hint={name.length > 0 && name.length < 1 ? "Mínimo 1 carácter" : undefined}
                    error={name.length > 0 && name.length < 1}
                    placeholder="Introduce el nombre de la subcategoría"
                />

                <Button
                    type="submit"
                    variant={name.length >= 1 ? "primary" : "outline"}
                    disabled={name.length < 1}
                    size="sm">
                    Añadir
                </Button>
            </Form>
        </Modal>
    );
}
