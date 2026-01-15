import { useState } from "react";

export type StockActionType = "in" | "out" | null;

interface UseStockActionProps {
    currentStock: number;
    onConfirm: (newStock: number) => void;
}

export function useStockAction({ currentStock, onConfirm }: UseStockActionProps) {
    const [actionType, setActionType] = useState<StockActionType>(null);
    const [actionValue, setActionValue] = useState("");

    const handleActionClick = (type: StockActionType) => {
        setActionType(type);
        setActionValue("");
    };

    const handleActionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === "" || (!isNaN(Number(value)) && Number(value) > 0)) {
            setActionValue(value);
        }
    };

    const handleActionConfirm = () => {
        const amount = Number(actionValue);
        if (!isNaN(amount) && amount > 0) {
            let newStock = currentStock;
            if (actionType === "in") {
                newStock = currentStock + amount;
            } else if (actionType === "out") {
                newStock = Math.max(0, currentStock - amount);
            }

            onConfirm(newStock);
        }
    };

    const handleActionCancel = () => {
        setActionType(null);
        setActionValue("");
    };

    const handleActionKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleActionConfirm();
        } else if (e.key === "Escape") {
            handleActionCancel();
        }
    };

    const resetAction = () => {
        setActionType(null);
        setActionValue("");
    };

    return {
        actionType,
        actionValue,
        handleActionClick,
        handleActionChange,
        handleActionConfirm,
        handleActionCancel,
        handleActionKeyDown,
        resetAction,
    };
}
