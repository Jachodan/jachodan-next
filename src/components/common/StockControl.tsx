"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, X } from "lucide-react";
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

interface StockControlProps {
    itemName: string;
    currentStock: number;
    onStockChange: (newStock: number) => void;
    variant?: "card" | "list";
}

type StockActionType = "in" | "out" | null;

export default function StockControl({ itemName, currentStock, onStockChange, variant = "list" }: StockControlProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState("");
    const [actionType, setActionType] = useState<StockActionType>(null);
    const [actionValue, setActionValue] = useState("");
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingNewStock, setPendingNewStock] = useState<number>(0);

    // 재고수량 클릭 시 직접 수정
    const handleStockClick = () => {
        setIsEditing(true);
        setEditValue(String(currentStock));
    };

    // 직접 수정 Input 변경
    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === "" || (!isNaN(Number(value)) && Number(value) >= 0)) {
            setEditValue(value);
        }
    };

    // 직접 수정 완료 (Enter 또는 blur)
    const handleEditComplete = () => {
        const newStock = editValue === "" ? 0 : Number(editValue);
        if (newStock !== currentStock) {
            onStockChange(newStock);
        }
        setIsEditing(false);
        setEditValue("");
    };

    // Enter/Escape 키 처리
    const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleEditComplete();
        } else if (e.key === "Escape") {
            setIsEditing(false);
            setEditValue("");
        }
    };

    // 입고/출고 버튼 클릭
    const handleActionClick = (type: StockActionType) => {
        setActionType(type);
        setActionValue("");
    };

    // 입고/출고 수량 입력 변경
    const handleActionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === "" || (!isNaN(Number(value)) && Number(value) > 0)) {
            setActionValue(value);
        }
    };

    // 입고/출고 확인 버튼 클릭 (AlertDialog 표시)
    const handleActionConfirm = () => {
        const amount = Number(actionValue);
        if (!isNaN(amount) && amount > 0) {
            let newStock = currentStock;
            if (actionType === "in") {
                newStock = currentStock + amount;
            } else if (actionType === "out") {
                newStock = Math.max(0, currentStock - amount);
            }

            // AlertDialog 표시를 위해 pending 상태 저장
            setPendingNewStock(newStock);
            setShowConfirmDialog(true);
        }
    };

    // AlertDialog에서 확인 버튼 클릭
    const handleConfirmDialogAccept = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        onStockChange(pendingNewStock);
        setShowConfirmDialog(false);
        setActionType(null);
        setActionValue("");
    };

    // AlertDialog에서 취소 버튼 클릭
    const handleConfirmDialogCancel = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setShowConfirmDialog(false);
    };

    // 입고/출고 취소 버튼 클릭
    const handleActionCancel = () => {
        setActionType(null);
        setActionValue("");
    };

    // 입고/출고 입력 Enter/Escape 키 처리
    const handleActionKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleActionConfirm();
        } else if (e.key === "Escape") {
            handleActionCancel();
        }
    };

    return (
        <>
            {variant === "card" ? (
                <div className="flex flex-col gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                    {/* 입고/수량/출고 */}
                    <div className="flex items-center gap-2 justify-between">
                        <Button variant="outline" size="sm" className="h-8 w-16" onClick={() => handleActionClick("in")}>
                            입고
                        </Button>

                        {isEditing ? (
                            <Input
                                type="number"
                                min="0"
                                value={editValue}
                                onChange={handleEditChange}
                                onBlur={handleEditComplete}
                                onKeyDown={handleEditKeyDown}
                                className="h-8 w-20 text-center"
                                autoFocus
                            />
                        ) : (
                            <button
                                onClick={handleStockClick}
                                className="font-medium text-sm hover:text-primary cursor-pointer transition-colors"
                            >
                                {currentStock}개
                            </button>
                        )}

                        <Button variant="outline" size="sm" className="h-8 w-16" onClick={() => handleActionClick("out")}>
                            출고
                        </Button>
                    </div>

                    {/* 입고/출고 입력창 */}
                    {actionType && (
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
                                    onChange={handleActionChange}
                                    onKeyDown={handleActionKeyDown}
                                    className="h-8 text-center flex-1"
                                    autoFocus
                                />
                                <Button
                                    variant="default"
                                    size="icon"
                                    className="h-8 w-8 shrink-0"
                                    onClick={handleActionConfirm}
                                    disabled={!actionValue || Number(actionValue) <= 0}
                                >
                                    <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 shrink-0"
                                    onClick={handleActionCancel}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                // List variant
                <div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                        {/* 입고/수량/출고 */}
                        {!actionType && (
                            <>
                                <Button variant="outline" size="sm" className="h-8" onClick={() => handleActionClick("in")}>
                                    입고
                                </Button>

                                {isEditing ? (
                                    <Input
                                        type="number"
                                        min="0"
                                        value={editValue}
                                        onChange={handleEditChange}
                                        onBlur={handleEditComplete}
                                        onKeyDown={handleEditKeyDown}
                                        className="h-8 w-20 text-center"
                                        autoFocus
                                    />
                                ) : (
                                    <button
                                        onClick={handleStockClick}
                                        className="font-medium hover:text-primary cursor-pointer transition-colors min-w-12 text-center"
                                    >
                                        {currentStock}개
                                    </button>
                                )}

                                <Button variant="outline" size="sm" className="h-8" onClick={() => handleActionClick("out")}>
                                    출고
                                </Button>
                            </>
                        )}
                    </div>

                    {/* 입고/출고 입력창 */}
                    {actionType && (
                        <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {actionType === "in" ? "입고" : "출고"}:
                            </span>
                            <Input
                                type="number"
                                min="1"
                                placeholder="수량"
                                value={actionValue}
                                onChange={handleActionChange}
                                onKeyDown={handleActionKeyDown}
                                className="h-8 w-20 text-center"
                                autoFocus
                            />
                            <Button
                                variant="default"
                                size="icon"
                                className="h-8 w-8 shrink-0"
                                onClick={handleActionConfirm}
                                disabled={!actionValue || Number(actionValue) <= 0}
                            >
                                <Check className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-8 w-8 shrink-0" onClick={handleActionCancel}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* 재고 변경 확인 AlertDialog */}
            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>재고 수량 변경</AlertDialogTitle>
                        <AlertDialogDescription>
                            {itemName}의 수량을 {currentStock}개에서 {pendingNewStock}개로 변경합니다.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={(e) => handleConfirmDialogCancel(e)}>취소</AlertDialogCancel>
                        <AlertDialogAction onClick={(e) => handleConfirmDialogAccept(e)}>확인</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
