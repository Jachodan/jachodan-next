import { useState } from "react";

interface UseStockConfirmDialogProps {
    onConfirm: (newStock: number) => void;
    onCancel?: () => void;
}

export function useStockConfirmDialog({ onConfirm, onCancel }: UseStockConfirmDialogProps) {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingNewStock, setPendingNewStock] = useState<number>(0);

    const showDialog = (newStock: number) => {
        setPendingNewStock(newStock);
        setShowConfirmDialog(true);
    };

    const handleConfirmDialogAccept = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        onConfirm(pendingNewStock);
        setShowConfirmDialog(false);
    };

    const handleConfirmDialogCancel = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setShowConfirmDialog(false);
        onCancel?.();
    };

    return {
        showConfirmDialog,
        pendingNewStock,
        showDialog,
        handleConfirmDialogAccept,
        handleConfirmDialogCancel,
        setShowConfirmDialog,
    };
}
