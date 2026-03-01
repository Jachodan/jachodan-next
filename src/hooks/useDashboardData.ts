import { useState, useEffect, useMemo } from "react";
import { ItemWithStock } from "@/types/item";
import { ItemRequest } from "@/types/itemRequest";
import { Board } from "@/types/board";
import { Work } from "@/types/work";
import { Alba } from "@/types/user";
import { mockItems } from "@/lib/mock/items";
import { generateMockRequests } from "@/lib/mock/itemRequests";
import { mockNotices } from "@/lib/mock/boards";
import { mockAlbas, mockWorks } from "@/lib/mock/works";
import { isLowStock } from "@/lib/utils/item";

interface UseDashboardDataReturn {
    items: ItemWithStock[];
    requests: ItemRequest[];
    notices: Board[];
    works: Work[];
    albas: Alba[];
    isLoading: boolean;

    // 대시보드용 필터링된 데이터
    lowStockItems: ItemWithStock[];
    favoriteItems: ItemWithStock[];
    pendingRequests: (ItemRequest & { itemName: string })[];
}

export function useDashboardData(): UseDashboardDataReturn {
    const [items, setItems] = useState<ItemWithStock[]>([]);
    const [requests, setRequests] = useState<ItemRequest[]>([]);
    const [notices, setNotices] = useState<Board[]>([]);
    const [works, setWorks] = useState<Work[]>([]);
    const [albas, setAlbas] = useState<Alba[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 500));

            const loadedItems = mockItems;
            const loadedRequests = generateMockRequests(
                loadedItems.map((item) => ({ itemId: item.itemId }))
            );

            setItems(loadedItems);
            setRequests(loadedRequests);
            setNotices(mockNotices);
            setAlbas(mockAlbas);
            setWorks(mockWorks);
            setIsLoading(false);
        };

        loadData();
    }, []);

    // 재고부족 아이템 (최대 5개)
    const lowStockItems = useMemo(() => {
        return items.filter(isLowStock).slice(0, 5);
    }, [items]);

    // 즐겨찾기 아이템 (최대 5개)
    const favoriteItems = useMemo(() => {
        return items.filter((item) => item.isPin).slice(0, 5);
    }, [items]);

    // 대기 중인 입고요청 (아이템명 포함)
    const pendingRequests = useMemo(() => {
        return requests
            .filter(
                (req) =>
                    req.requestType === "주문요청" &&
                    req.isActive &&
                    !["완료", "취소", "반려"].includes(req.requestStatus)
            )
            .slice(0, 5)
            .map((req) => {
                const item = items.find((i) => i.itemId === req.itemId);
                return {
                    ...req,
                    itemName: item?.itemName ?? "알 수 없음",
                };
            });
    }, [requests, items]);

    return {
        items,
        requests,
        notices,
        works,
        albas,
        isLoading,
        lowStockItems,
        favoriteItems,
        pendingRequests,
    };
}
