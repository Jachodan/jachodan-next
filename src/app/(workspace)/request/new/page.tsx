"use client";

import { useState, useMemo } from "react";
import { Search, Plus, X } from "lucide-react";
import { REQUEST_TYPES, type RequestType } from "@/types/itemRequest";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateMockItems } from "@/lib/mock/items";

// 목 데이터 생성 (스크롤이 생길 정도로 충분히 많이)
const mockItemsData = generateMockItems(30);
const MOCK_ITEMS = mockItemsData.map((item) => ({
    itemId: item.itemId,
    itemName: item.itemName,
    stockAmount: item.stock.stockAmount ?? 0,
}));

interface RequestItem {
    id: string;
    itemId: number | null;
    itemName: string;
    requestType: RequestType;
    quantity: number;
    requestDate: string;
    requester: string;
    isManual: boolean;
}

export default function RequestCreatePage() {
    const [searchValue, setSearchValue] = useState("");
    const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);
    const [requestItems, setRequestItems] = useState<RequestItem[]>([]);

    // 오늘 날짜
    const today = new Date().toISOString().split("T")[0];

    // 검색 필터링된 상품 목록
    const filteredItems = useMemo(() => {
        if (!searchValue) return MOCK_ITEMS;
        return MOCK_ITEMS.filter((item) => item.itemName.toLowerCase().includes(searchValue.toLowerCase()));
    }, [searchValue]);

    // 체크박스 토글
    const handleCheckboxChange = (itemId: number, checked: boolean) => {
        if (checked) {
            setSelectedItemIds((prev) => [...prev, itemId]);
            const item = MOCK_ITEMS.find((i) => i.itemId === itemId);
            if (item) {
                const newRequestItem: RequestItem = {
                    id: `item-${itemId}-${Date.now()}`,
                    itemId: item.itemId,
                    itemName: item.itemName,
                    requestType: "입고요청",
                    quantity: 1,
                    requestDate: today,
                    requester: "",
                    isManual: false,
                };
                setRequestItems((prev) => [...prev, newRequestItem]);
            }
        } else {
            setSelectedItemIds((prev) => prev.filter((id) => id !== itemId));
            setRequestItems((prev) => prev.filter((item) => item.itemId !== itemId || item.isManual));
        }
    };

    // 수동으로 행 추가
    const handleAddManualRow = () => {
        const newRequestItem: RequestItem = {
            id: `manual-${Date.now()}`,
            itemId: null,
            itemName: "",
            requestType: "입고요청",
            quantity: 1,
            requestDate: today,
            requester: "",
            isManual: true,
        };
        setRequestItems((prev) => [...prev, newRequestItem]);
    };

    // 요청 항목 업데이트
    const updateRequestItem = (id: string, field: keyof RequestItem, value: string | number) => {
        setRequestItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
    };

    // 수동 항목에서 상품 선택
    const handleManualItemSelect = (id: string, itemId: string) => {
        const selectedItem = MOCK_ITEMS.find((item) => item.itemId === Number(itemId));
        if (selectedItem) {
            setRequestItems((prev) =>
                prev.map((item) =>
                    item.id === id ? { ...item, itemId: selectedItem.itemId, itemName: selectedItem.itemName } : item
                )
            );
        }
    };

    // 행 삭제
    const handleRemoveRow = (id: string, itemId: number | null) => {
        setRequestItems((prev) => prev.filter((item) => item.id !== id));
        if (itemId !== null) {
            setSelectedItemIds((prev) => prev.filter((id) => id !== itemId));
        }
    };

    return (
        <div className="h-full p-10 overflow-hidden">
            <div className="flex gap-6 h-[calc(100vh-140px)]">
                {/* 좌측 영역 - 상품 선택 (2/5) */}
                <div className="w-2/5 flex flex-col border rounded-lg overflow-hidden">
                    {/* 좌상단 - 검색 */}
                    <div className="p-4 border-b bg-gray-50">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">검색</span>
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                                <Input
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    placeholder="상품명 검색"
                                    className="pl-9"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 좌하단 - 상품 목록 */}
                    <div className="flex-1 overflow-hidden">
                        {/* 헤더 */}
                        <div className="grid grid-cols-[40px_1fr_100px] gap-2 px-4 py-3 bg-gray-50 border-b text-sm font-medium text-gray-600">
                            <div></div>
                            <div className="text-center">상품명</div>
                            <div className="text-center">수량</div>
                        </div>

                        {/* 목록 */}
                        <ScrollArea className="h-[calc(100%-48px)]">
                            <div className="divide-y">
                                {filteredItems.map((item) => (
                                    <div
                                        key={item.itemId}
                                        className="grid grid-cols-[40px_1fr_100px] gap-2 px-4 py-3 items-center hover:bg-gray-50"
                                    >
                                        <Checkbox
                                            checked={selectedItemIds.includes(item.itemId)}
                                            onCheckedChange={(checked) =>
                                                handleCheckboxChange(item.itemId, checked as boolean)
                                            }
                                        />
                                        <div className="text-sm text-gray-900 truncate text-center">{item.itemName}</div>
                                        <div className="text-sm text-gray-600 text-center">{item.stockAmount}</div>
                                    </div>
                                ))}
                            </div>
                            <ScrollBar orientation="vertical" className="opacity-100" />
                        </ScrollArea>
                    </div>
                </div>

                {/* 우측 영역 - 요청 등록 폼 (3/5) */}
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
                                        onValueChange={(value) =>
                                            updateRequestItem(item.id, "requestType", value as RequestType)
                                        }
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
                                                    {MOCK_ITEMS.map((mockItem) => (
                                                        <SelectItem
                                                            key={mockItem.itemId}
                                                            value={mockItem.itemId.toString()}
                                                        >
                                                            {mockItem.itemName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <span className="text-sm text-gray-900 truncate text-center">
                                            {item.itemName}
                                        </span>
                                    )}

                                    {/* 수량 */}
                                    <Input
                                        type="number"
                                        min={1}
                                        value={item.quantity}
                                        onChange={(e) => updateRequestItem(item.id, "quantity", Number(e.target.value))}
                                        className="text-center h-8"
                                    />

                                    {/* 요청일 */}
                                    <span className="text-sm text-gray-500 text-center">{item.requestDate}</span>

                                    {/* 요청자 */}
                                    <Input
                                        type="text"
                                        value={item.requester}
                                        onChange={(e) => updateRequestItem(item.id, "requester", e.target.value)}
                                        placeholder="이름"
                                        className="text-center h-8"
                                    />

                                    {/* 삭제 버튼 */}
                                    <Button
                                        variant="ghost"
                                        size="icon-sm"
                                        onClick={() => handleRemoveRow(item.id, item.itemId)}
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
                                    onClick={handleAddManualRow}
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
                        <Button variant="outline">취소</Button>
                        <Button>확인</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
