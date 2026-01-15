import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, X } from "lucide-react";
import { StockActionType } from "../hooks/useStockAction";

interface StockActionInputProps {
    actionType: StockActionType;
    actionValue: string;
    currentStock: number;
    variant?: "card" | "list";
    onActionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onActionKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onActionConfirm: () => void;
    onActionCancel: () => void;
}

export function StockActionInput({
    actionType,
    actionValue,
    currentStock,
    variant = "list",
    onActionChange,
    onActionKeyDown,
    onActionConfirm,
    onActionCancel,
}: StockActionInputProps) {
    if (!actionType) return null;

    if (variant === "card") {
        return (
            <div className="flex flex-col gap-2 p-2 border rounded-md bg-muted/50">
                <label className="text-xs text-muted-foreground">
                    {actionType === "in" ? "입고" : "출고"} 수량 (현재: {currentStock}개)
                </label>
                <div className="flex gap-2">
                    <Input
                        type="number"
                        min="1"
                        placeholder="수량"
                        value={actionValue}
                        onChange={onActionChange}
                        onKeyDown={onActionKeyDown}
                        className="h-8 text-center flex-1"
                        autoFocus
                    />
                    <Button
                        variant="default"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={onActionConfirm}
                        disabled={!actionValue || Number(actionValue) <= 0}
                    >
                        <Check className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 shrink-0" onClick={onActionCancel}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
            <span className="text-xs text-muted-foreground whitespace-nowrap">
                {actionType === "in" ? "입고" : "출고"}:
            </span>
            <Input
                type="number"
                min="1"
                placeholder="수량"
                value={actionValue}
                onChange={onActionChange}
                onKeyDown={onActionKeyDown}
                className="h-8 w-20 text-center"
                autoFocus
            />
            <Button
                variant="default"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={onActionConfirm}
                disabled={!actionValue || Number(actionValue) <= 0}
            >
                <Check className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 shrink-0" onClick={onActionCancel}>
                <X className="h-4 w-4" />
            </Button>
        </div>
    );
}
