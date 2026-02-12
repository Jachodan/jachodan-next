"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { getItems } from "@/lib/api/item";

interface SimpleItem {
    itemId: number;
    itemName: string;
    stockAmount: number;
}

const PAGE_SIZE = 8;

export function useItemSelection() {
    const { data: session } = useSession();
    const storeId = session?.storeId ?? 1;

    const [items, setItems] = useState<SimpleItem[]>([]);
    const [searchValue, setSearchValue] = useState("");
    const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const fetchItems = useCallback(async (pageNum: number, reset = false) => {
        setIsLoading(true);
        const res = await getItems({ storeId, page: pageNum, size: PAGE_SIZE });
        if (res.data) {
            const newItems = res.data.content.map((item) => ({
                itemId: item.itemId,
                itemName: item.itemName,
                stockAmount: item.stockAmount,
            }));
            setItems((prev) => (reset ? newItems : [...prev, ...newItems]));
            setHasMore(pageNum < res.data.totalPages);
        }
        setIsLoading(false);
    }, [storeId]);

    // 초기 로드
    useEffect(() => {
        setPage(1);
        setItems([]);
        setHasMore(true);
        fetchItems(1, true);
    }, [fetchItems]);

    // 다음 페이지 로드
    const loadMore = useCallback(() => {
        if (isLoading || !hasMore) return;
        const nextPage = page + 1;
        setPage(nextPage);
        fetchItems(nextPage);
    }, [isLoading, hasMore, page, fetchItems]);

    // 검색 필터링된 상품 목록
    const filteredItems = useMemo(() => {
        if (!searchValue) return items;
        return items.filter((item) => item.itemName.toLowerCase().includes(searchValue.toLowerCase()));
    }, [searchValue, items]);

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
        selectItem: (itemId: number) => setSelectedItemIds((prev) => [...prev, itemId]),
        deselectItem: (itemId: number) => setSelectedItemIds((prev) => prev.filter((id) => id !== itemId)),
        getItemById,
        allItems: items,
        loadMore,
        hasMore,
        isLoading,
    };
}
