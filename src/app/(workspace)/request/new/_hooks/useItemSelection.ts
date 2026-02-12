"use client";

import { useState, useMemo, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getItems } from "@/lib/api/item";

interface SimpleItem {
    itemId: number;
    itemName: string;
    stockAmount: number;
}

export function useItemSelection() {
    const { data: session } = useSession();
    const storeId = session?.storeId ?? 1;

    const [items, setItems] = useState<SimpleItem[]>([]);
    const [searchValue, setSearchValue] = useState("");
    const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);

    useEffect(() => {
        getItems({ storeId, page: 1, size: 100 }).then((res) => {
            if (res.data) {
                setItems(
                    res.data.content.map((item) => ({
                        itemId: item.itemId,
                        itemName: item.itemName,
                        stockAmount: item.stockAmount,
                    }))
                );
            }
        });
    }, [storeId]);

    // 검색 필터링된 상품 목록
    const filteredItems = useMemo(() => {
        if (!searchValue) return items;
        return items.filter((item) => item.itemName.toLowerCase().includes(searchValue.toLowerCase()));
    }, [searchValue, items]);

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
        return items.find((item) => item.itemId === itemId);
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
        allItems: items,
    };
}
