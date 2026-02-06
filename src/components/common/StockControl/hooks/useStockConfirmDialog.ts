import { useState } from "react";

export interface StockChangeData {
    newStock: number;
    actionType: "in" | "out";
    amount: number;
}

interface UseStockConfirmDialogProps {
    onConfirm: (data: StockChangeData) => void;
    onCancel?: () => void;
}

export function useStockConfirmDialog({ onConfirm, onCancel }: UseStockConfirmDialogProps) {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingData, setPendingData] = useState<StockChangeData>({
        newStock: 0,
        actionType: "in",
        amount: 0,
    });

    const showDialog = (data: StockChangeData) => {
        setPendingData(data);
        setShowConfirmDialog(true);
    };

    const handleConfirmDialogAccept = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        onConfirm(pendingData);
        setShowConfirmDialog(false);
    };

    const handleConfirmDialogCancel = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setShowConfirmDialog(false);
        onCancel?.();
    };

    return {
        showConfirmDialog,
        pendingNewStock: pendingData.newStock,
        showDialog,
        handleConfirmDialogAccept,
        handleConfirmDialogCancel,
        setShowConfirmDialog,
    };
}
