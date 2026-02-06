"use client";

import { useState, useMemo } from "react";
import { generateMockItems } from "@/lib/mock/items";

// 목 데이터 생성
const mockItemsData = generateMockItems(30);
export const MOCK_ITEMS = mockItemsData.map((item) => ({
    itemId: item.itemId,
    itemName: item.itemName,
    stockAmount: item.stock.stockAmount ?? 0,
}));

export function useItemSelection() {
    const [searchValue, setSearchValue] = useState("");
    const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);

    // 검색 필터링된 상품 목록
    const filteredItems = useMemo(() => {
        if (!searchValue) return MOCK_ITEMS;
        return MOCK_ITEMS.filter((item) => item.itemName.toLowerCase().includes(searchValue.toLowerCase()));
    }, [searchValue]);

    // 체크박스 선택
    const selectItem = (itemId: number) => {
        setSelectedItemIds((prev) => [...prev, itemId]);
    };

    // 체크박스 해제
    const deselectItem = (itemId: number) => {
        setSelectedItemIds((prev) => prev.filter((id) => id !== itemId));
    };

    // 아이템 ID로 아이템 찾기
    const getItemById = (itemId: number) => {
        return MOCK_ITEMS.find((item) => item.itemId === itemId);
    };

    return {
        searchValue,
        setSearchValue,
        selectedItemIds,
        setSelectedItemIds,
        filteredItems,
        selectItem,
        deselectItem,
        getItemById,
        allItems: MOCK_ITEMS,
    };
}
