import { useState } from "react";
import { Modal } from "./index";
import Form from "../../form/Form";
import TextArea from "../../form/input/TextArea";
import Button from "../button/Button";
import { Subcategory } from "../../../api/finances/types"
import {createSubcategory} from "../../../api/finances/metrics.ts";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (newSubcategory: Subcategory) => void;
}

export default function SubcategoryCreateModal({ isOpen, onClose, onSubmit }: Readonly<Props>) {
    const [name, setName] = useState("");

    const handleSubmit = async () => {
        const response = await createSubcategory(name)
        onSubmit(response);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl w-full p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
                Crear Subcategoría
            </h2>

            <Form onSubmit={handleSubmit} className="space-y-4">
                <TextArea
                    label="Nombre"
                    value={name}
                    onChange={setName}
                />

                <Button type="submit" variant="primary" size="sm">
                    Añadir
                </Button>
            </Form>
        </Modal>
    );
}
