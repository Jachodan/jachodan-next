"use client";

import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { REQUEST_TYPES, type RequestType } from "@/types/itemRequest";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type RequestItem } from "../_hooks/useRequestForm";

interface Item {
    itemId: number;
    itemName: string;
    stockAmount: number;
}

interface RequestFormTableProps {
    requestItems: RequestItem[];
    allItems: Item[];
    onUpdateItem: (id: string, field: keyof RequestItem, value: string | number) => void;
    onSelectItemForManualRow: (id: string, itemId: number, itemName: string) => void;
    onRemoveRow: (id: string) => void;
    onAddManualRow: () => void;
    onCancel: () => void;
    onSubmit: () => void;
    isSubmitting: boolean;
}

export default function RequestFormTable({
    requestItems,
    allItems,
    onUpdateItem,
    onSelectItemForManualRow,
    onRemoveRow,
    onAddManualRow,
    onCancel,
    onSubmit,
    isSubmitting,
}: RequestFormTableProps) {
    const handleManualItemSelect = (id: string, itemIdStr: string) => {
        const selectedItem = allItems.find((item) => item.itemId === Number(itemIdStr));
        if (selectedItem) {
            onSelectItemForManualRow(id, selectedItem.itemId, selectedItem.itemName);
        } else {
            toast.error("상품을 찾을 수 없습니다.");
        }
    };

    return (
        <div className="w-3/5 flex flex-col border rounded-lg overflow-hidden">
            {/* 헤더 */}
            <div className="grid grid-cols-[100px_1fr_80px_100px_100px_40px] gap-2 px-4 py-3 bg-gray-50 border-b text-sm font-medium text-gray-600">
                <div className="text-center">요청유형</div>
                <div className="text-center">상품명</div>
                <div className="text-center">수량</div>
                <div className="text-center">요청일</div>
                <div className="text-center">요청자</div>
                <div></div>
            </div>

            {/* 요청 항목 목록 */}
            <ScrollArea className="flex-1">
                <div className="divide-y">
                    {requestItems.map((item) => (
                        <div
                            key={item.id}
                            className="grid grid-cols-[100px_1fr_80px_100px_100px_40px] gap-2 px-4 py-3 items-center"
                        >
                            {/* 요청유형 */}
                            <Select
                                value={item.requestType}
                                onValueChange={(value) => onUpdateItem(item.id, "requestType", value as RequestType)}
                            >
                                <SelectTrigger size="sm" className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {REQUEST_TYPES.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            {/* 상품명 */}
                            {item.isManual ? (
                                <Select
                                    value={item.itemId?.toString() || ""}
                                    onValueChange={(value) => handleManualItemSelect(item.id, value)}
                                >
                                    <SelectTrigger size="sm" className="w-full">
                                        <SelectValue placeholder="상품 선택" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {allItems.map((mockItem) => (
                                                <SelectItem key={mockItem.itemId} value={mockItem.itemId.toString()}>
                                                    {mockItem.itemName}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            ) : (
                                <span className="text-sm text-gray-900 truncate text-center">{item.itemName}</span>
                            )}

                            {/* 수량 */}
                            <Input
                                type="number"
                                min={1}
                                value={item.quantity}
                                onChange={(e) => {
                                    const value = Math.max(1, Number(e.target.value) || 1);
                                    onUpdateItem(item.id, "quantity", value);
                                }}
                                className="text-center h-8"
                            />

                            {/* 요청일 */}
                            <span className="text-sm text-gray-500 text-center">{item.requestDate}</span>

                            {/* 요청자 */}
                            <Input
                                type="text"
                                value={item.requester}
                                onChange={(e) => onUpdateItem(item.id, "requester", e.target.value)}
                                placeholder="이름"
                                className="text-center h-8"
                            />

                            {/* 삭제 버튼 */}
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => onRemoveRow(item.id)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="size-4" />
                            </Button>
                        </div>
                    ))}

                    {/* 행 추가 버튼 */}
                    <div className="px-4 py-3">
                        <Button
                            variant="ghost"
                            onClick={onAddManualRow}
                            className="w-full justify-center text-gray-500 hover:text-gray-700 border border-dashed border-gray-300 hover:border-gray-400"
                        >
                            <Plus className="size-4 mr-2" />
                            직접 추가
                        </Button>
                    </div>
                </div>
            </ScrollArea>

            {/* 하단 버튼 */}
            <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
                <Button variant="outline" onClick={onCancel}>
                    취소
                </Button>
                <Button onClick={onSubmit} disabled={isSubmitting}>
                    {isSubmitting ? "등록 중..." : "확인"}
                </Button>
            </div>
        </div>
    );
}
