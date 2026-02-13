"use client";

import { useRef, useCallback } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Item {
    itemId: number;
    itemName: string;
    stockAmount: number;
}

interface ItemSelectorProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    filteredItems: Item[];
    selectedItemIds: number[];
    onCheckboxChange: (itemId: number, checked: boolean) => void;
    onLoadMore: () => void;
    hasMore: boolean;
    isLoading: boolean;
}

export default function ItemSelector({
    searchValue,
    onSearchChange,
    filteredItems,
    selectedItemIds,
    onCheckboxChange,
    onLoadMore,
    hasMore,
    isLoading,
}: ItemSelectorProps) {
    const observerRef = useRef<IntersectionObserver | null>(null);

    const sentinelRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (observerRef.current) observerRef.current.disconnect();
            if (!node || !hasMore) return;

            observerRef.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && !isLoading) {
                    onLoadMore();
                }
            });
            observerRef.current.observe(node);
        },
        [hasMore, isLoading, onLoadMore]
    );

    return (
        <div className="w-2/5 flex flex-col border rounded-lg overflow-hidden">
            {/* 좌상단 - 검색 */}
            <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 whitespace-nowrap">검색</span>
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        <Input
                            value={searchValue}
                            onChange={(e) => onSearchChange(e.target.value)}
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
                                    onCheckedChange={(checked) => onCheckboxChange(item.itemId, checked as boolean)}
                                />
                                <div className="text-sm text-gray-900 truncate text-center">{item.itemName}</div>
                                <div className="text-sm text-gray-600 text-center">{item.stockAmount}</div>
                            </div>
                        ))}
                        {hasMore && (
                            <div ref={sentinelRef} className="px-4 py-3 text-center text-sm text-gray-400">
                                {isLoading ? "불러오는 중..." : ""}
                            </div>
                        )}
                    </div>
                    <ScrollBar orientation="vertical" className="opacity-100" />
                </ScrollArea>
            </div>
        </div>
    );
}
