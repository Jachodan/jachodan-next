"use client";

import { Button } from "@/components/ui/button";
import { useStockEdit } from "./hooks/useStockEdit";
import { useStockAction } from "./hooks/useStockAction";
import { useStockConfirmDialog } from "./hooks/useStockConfirmDialog";
import { StockDisplay } from "./components/StockDisplay";
import { StockActionInput } from "./components/StockActionInput";
import { StockConfirmDialog } from "./components/StockConfirmDialog";

export interface StockInOutParams {
    actionType: "in" | "out";
    amount: number;
}

interface StockControlProps {
    itemName: string;
    currentStock: number;
    onStockChange?: (newStock: number) => void;
    onStockInOut?: (params: StockInOutParams) => void;
    onStockAdjust?: (newStock: number) => void;
    variant?: "card" | "list";
}

export default function StockControl({ itemName, currentStock, onStockChange, onStockInOut, onStockAdjust, variant = "list" }: StockControlProps) {
    // 재고 변경 확인 다이얼로그
    const confirmDialog = useStockConfirmDialog({
        onConfirm: (data) => {
            if (data.actionType === "adjust") {
                onStockAdjust?.(data.newStock);
                onStockChange?.(data.newStock);
            } else {
                onStockInOut?.({ actionType: data.actionType, amount: data.amount });
            }
            stockEdit.resetEdit();
            stockAction.resetAction();
        },
        onCancel: () => {
            stockEdit.resetEdit();
        },
    });

    // 직접 수정 기능
    const stockEdit = useStockEdit({
        currentStock,
        onComplete: (newStock) => {
            confirmDialog.showDialog({ newStock, actionType: "adjust", amount: newStock });
        },
    });

    // 입고/출고 기능
    const stockAction = useStockAction({
        currentStock,
        onConfirm: (data) => {
            confirmDialog.showDialog(data);
        },
    });

    return (
        <>
            {variant === "card" ? (
                <div className="flex flex-col gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                    {/* 입고/수량/출고 */}
                    <div className="flex items-center gap-2 justify-between">
                        <Button variant="outline" size="sm" className="h-8 w-16" onClick={() => stockAction.handleActionClick("in")}>
                            입고
                        </Button>

                        <StockDisplay
                            isEditing={stockEdit.isEditing}
                            currentStock={currentStock}
                            editValue={stockEdit.editValue}
                            variant="card"
                            onStockClick={stockEdit.handleStockClick}
                            onEditChange={stockEdit.handleEditChange}
                            onEditComplete={stockEdit.handleEditComplete}
                            onEditKeyDown={stockEdit.handleEditKeyDown}
                        />

                        <Button variant="outline" size="sm" className="h-8 w-16" onClick={() => stockAction.handleActionClick("out")}>
                            출고
                        </Button>
                    </div>

                    {/* 입고/출고 입력창 */}
                    <StockActionInput
                        actionType={stockAction.actionType}
                        actionValue={stockAction.actionValue}
                        currentStock={currentStock}
                        variant="card"
                        onActionChange={stockAction.handleActionChange}
                        onActionKeyDown={stockAction.handleActionKeyDown}
                        onActionConfirm={stockAction.handleActionConfirm}
                        onActionCancel={stockAction.handleActionCancel}
                    />
                </div>
            ) : (
                // List variant
                <div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                        {/* 입고/수량/출고 */}
                        {!stockAction.actionType && (
                            <>
                                <Button variant="outline" size="sm" className="h-8" onClick={() => stockAction.handleActionClick("in")}>
                                    입고
                                </Button>

                                <StockDisplay
                                    isEditing={stockEdit.isEditing}
                                    currentStock={currentStock}
                                    editValue={stockEdit.editValue}
                                    variant="list"
                                    onStockClick={stockEdit.handleStockClick}
                                    onEditChange={stockEdit.handleEditChange}
                                    onEditComplete={stockEdit.handleEditComplete}
                                    onEditKeyDown={stockEdit.handleEditKeyDown}
                                />

                                <Button variant="outline" size="sm" className="h-8" onClick={() => stockAction.handleActionClick("out")}>
                                    출고
                                </Button>
                            </>
                        )}
                    </div>

                    {/* 입고/출고 입력창 */}
                    <StockActionInput
                        actionType={stockAction.actionType}
                        actionValue={stockAction.actionValue}
                        currentStock={currentStock}
                        variant="list"
                        onActionChange={stockAction.handleActionChange}
                        onActionKeyDown={stockAction.handleActionKeyDown}
                        onActionConfirm={stockAction.handleActionConfirm}
                        onActionCancel={stockAction.handleActionCancel}
                    />
                </div>
            )}

            {/* 재고 변경 확인 AlertDialog */}
            <StockConfirmDialog
                open={confirmDialog.showConfirmDialog}
                itemName={itemName}
                currentStock={currentStock}
                pendingNewStock={confirmDialog.pendingNewStock}
                onOpenChange={confirmDialog.setShowConfirmDialog}
                onConfirm={confirmDialog.handleConfirmDialogAccept}
                onCancel={confirmDialog.handleConfirmDialogCancel}
            />
        </>
    );
}
