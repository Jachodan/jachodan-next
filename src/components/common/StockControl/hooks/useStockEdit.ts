import { useState } from "react";

interface UseStockEditProps {
    currentStock: number;
    onComplete: (newStock: number) => void;
}

export function useStockEdit({ currentStock, onComplete }: UseStockEditProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState("");

    const handleStockClick = () => {
        setIsEditing(true);
        setEditValue(String(currentStock));
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === "" || (!isNaN(Number(value)) && Number(value) >= 0)) {
            setEditValue(value);
        }
    };

    const handleEditComplete = () => {
        const newStock = editValue === "" ? 0 : Number(editValue);
        if (newStock !== currentStock) {
            onComplete(newStock);
        } else {
            setIsEditing(false);
            setEditValue("");
        }
    };

    const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
            handleEditComplete();
        } else if (e.key === "Escape") {
            setIsEditing(false);
            setEditValue("");
        }
    };

    const resetEdit = () => {
        setIsEditing(false);
        setEditValue("");
    };

    return {
        isEditing,
        editValue,
        handleStockClick,
        handleEditChange,
        handleEditComplete,
        handleEditKeyDown,
        resetEdit,
    };
}
