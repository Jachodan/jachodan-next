import { useState, useEffect } from "react";
import { ItemDetailResponse } from "@/types/item";

export interface ItemFormData {
    itemId?: number;
    itemName: string;
    stockAmount: number;
    bufferAmount?: number;
    imageId?: number;
    imageFile?: File;
}

interface UseItemFormProps {
    mode: "create" | "detail" | "edit";
    item?: ItemDetailResponse | null;
    onFormChange: (data: ItemFormData) => void;
}

export function useItemForm({ mode, item, onFormChange }: UseItemFormProps) {
    // 초기 데이터를 계산
    const getInitialData = (): ItemFormData => {
        if (mode === "create") {
            return {
                itemName: "",
                stockAmount: 0,
                bufferAmount: 0,
            };
        } else if ((mode === "detail" || mode === "edit") && item) {
            return {
                itemId: item.itemId,
                itemName: item.itemName,
                stockAmount: item.stockAmount ?? 0,
                bufferAmount: item.bufferAmount ?? 0,
                imageId: item.imageId,
            };
        }
        return {
            itemName: "",
            stockAmount: 0,
            bufferAmount: 0,
        };
    };

    const [formData, setFormData] = useState<ItemFormData>(getInitialData);

    // 부모 컴포넌트에 초기 데이터 전달 (마운트 시 한 번만)
    useEffect(() => {
        onFormChange(formData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleInputChange = (field: keyof ItemFormData, value: string | number) => {
        const newData = { ...formData, [field]: value };
        setFormData(newData);
        onFormChange(newData);
    };

    const handleFileChange = (file: File) => {
        const newData = { ...formData, imageFile: file };
        setFormData(newData);
        onFormChange(newData);
    };

    return {
        formData,
        handleInputChange,
        handleFileChange,
    };
}
