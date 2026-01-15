import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface StockConfirmDialogProps {
    open: boolean;
    itemName: string;
    currentStock: number;
    pendingNewStock: number;
    onOpenChange: (open: boolean) => void;
    onConfirm: (e?: React.MouseEvent) => void;
    onCancel: (e?: React.MouseEvent) => void;
}

export function StockConfirmDialog({
    open,
    itemName,
    currentStock,
    pendingNewStock,
    onOpenChange,
    onConfirm,
    onCancel,
}: StockConfirmDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                <AlertDialogHeader>
                    <AlertDialogTitle>재고 수량 변경</AlertDialogTitle>
                    <AlertDialogDescription>
                        {itemName}의 수량을 {currentStock}개에서 {pendingNewStock}개로 변경합니다.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>취소</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>확인</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
