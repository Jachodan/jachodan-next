import { ItemFormData } from "../hooks/useItemForm";
import { ItemImageUpload } from "./ItemImageUpload";
import { ItemFormFields } from "./ItemFormFields";

interface ItemFormViewProps {
    mode: "create" | "edit";
    formData: ItemFormData;
    imagePreview: string | null;
    onInputChange: (field: keyof ItemFormData, value: string | number) => void;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ItemFormView({
    mode,
    formData,
    imagePreview,
    onInputChange,
    onImageChange,
}: ItemFormViewProps) {
    return (
        <>
            <ItemImageUpload imagePreview={imagePreview} onImageChange={onImageChange} />
            <ItemFormFields mode={mode} formData={formData} onInputChange={onInputChange} />
        </>
    );
}
