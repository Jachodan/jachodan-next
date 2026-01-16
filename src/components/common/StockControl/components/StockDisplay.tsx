import { Input } from "@/components/ui/input";

interface StockDisplayProps {
    isEditing: boolean;
    currentStock: number;
    editValue: string;
    variant?: "card" | "list";
    onStockClick: () => void;
    onEditChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onEditComplete: () => void;
    onEditKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function StockDisplay({
    isEditing,
    currentStock,
    editValue,
    variant = "list",
    onStockClick,
    onEditChange,
    onEditComplete,
    onEditKeyDown,
}: StockDisplayProps) {
    if (isEditing) {
        return (
            <Input
                type="number"
                min="0"
                value={editValue}
                onChange={onEditChange}
                onBlur={onEditComplete}
                onKeyDown={onEditKeyDown}
                className={variant === "card" ? "h-8 w-20 text-center" : "h-8 w-20 text-center"}
                autoFocus
            />
        );
    }

    return (
        <button
            onClick={onStockClick}
            className={
                variant === "card"
                    ? "font-medium text-sm hover:text-primary cursor-pointer transition-colors"
                    : "font-medium hover:text-primary cursor-pointer transition-colors min-w-12 text-center"
            }
        >
            {currentStock}개
        </button>
    );
}
