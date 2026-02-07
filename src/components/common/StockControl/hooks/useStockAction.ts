import { useState } from "react";
import { StockChangeData } from "./useStockConfirmDialog";

export type StockActionType = "in" | "out" | null;

interface UseStockActionProps {
    currentStock: number;
    onConfirm: (data: StockChangeData) => void;
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
        if (value === "") {
            setActionValue(value);
            return;
        }

        const numValue = Number(value);
        if (isNaN(numValue) || numValue <= 0) return;

        // 출고 시 현재 재고보다 큰 값 입력 불가
        if (actionType === "out" && numValue > currentStock) return;

        setActionValue(value);
    };

    const handleActionConfirm = () => {
        if (!actionType) return;

        const amount = Number(actionValue);
        if (!isNaN(amount) && amount > 0) {
            let newStock = currentStock;
            if (actionType === "in") {
                newStock = currentStock + amount;
            } else if (actionType === "out") {
                newStock = Math.max(0, currentStock - amount);
            }

            onConfirm({ newStock, actionType, amount });
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
