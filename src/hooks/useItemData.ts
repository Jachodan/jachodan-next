import { useState, useEffect } from "react";
import { ItemWithStock } from "@/types/item";
import { ItemRequest } from "@/types/itemRequest";
import { mockItems } from "@/lib/mock/items";
import { generateMockRequests } from "@/lib/mock/itemRequests";

interface UseItemDataReturn {
    items: ItemWithStock[];
    requests: ItemRequest[];
    isLoading: boolean;

    // CRUD 작업
    setItems: React.Dispatch<React.SetStateAction<ItemWithStock[]>>;
    updateItem: (itemId: number, updates: Partial<ItemWithStock>) => void;
    deleteItem: (itemId: number) => void;
    addItem: (item: ItemWithStock) => void;

    // 요청사항 관련
    setRequests: React.Dispatch<React.SetStateAction<ItemRequest[]>>;
}

export function useItemData(): UseItemDataReturn {
    const [items, setItems] = useState<ItemWithStock[]>([]);
    const [requests, setRequests] = useState<ItemRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // 데이터 로딩
    useEffect(() => {
        const loadItems = async () => {
            setIsLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 500));

            const loadedItems = mockItems;
            const loadedRequests = generateMockRequests(loadedItems.map((item) => ({ itemId: item.itemId })));

            setItems(loadedItems);
            setRequests(loadedRequests);
            setIsLoading(false);
        };

        loadItems();
    }, []);

    // 아이템 수정
    const updateItem = (itemId: number, updates: Partial<ItemWithStock>) => {
        setItems((prev) =>
            prev.map((item) =>
                item.itemId === itemId
                    ? {
                          ...item,
                          ...updates,
                      }
                    : item
            )
        );
    };

    // 아이템 삭제
    const deleteItem = (itemId: number) => {
        setItems((prev) => prev.filter((item) => item.itemId !== itemId));
    };

    // 아이템 추가
    const addItem = (item: ItemWithStock) => {
        setItems((prev) => [...prev, item]);
    };

    return {
        items,
        requests,
        isLoading,
        setItems,
        updateItem,
        deleteItem,
        addItem,
        setRequests,
    };
}
