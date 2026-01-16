import { useMemo } from "react";
import { ItemWithStock } from "@/types/item";
import { ItemRequest } from "@/types/itemRequest";
import { FilterType, hasRequest, isLowStock } from "@/lib/utils/item";

interface UseFilteredItemsParams {
    items: ItemWithStock[];
    requests: ItemRequest[];
    filterType: FilterType;
    searchQuery: string;
    excludeZero: boolean;
}

export function useFilteredItems({ items, requests, filterType, searchQuery, excludeZero }: UseFilteredItemsParams) {
    return useMemo(() => {
        return items.filter((item) => {
            // 필터 타입 체크
            if (filterType === "request" && !hasRequest(item, requests)) return false;
            if (filterType === "lowStock" && !isLowStock(item)) return false;
            if (filterType === "favorite" && !item.isPin) return false;
            // deadStock은 현재 동작하지 않도록 구현 - 백엔드와 협의 후 추가 예정

            // 검색어 체크
            if (searchQuery && !item.itemName.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }

            // 재고 0건 제외 체크
            if (excludeZero && (item.stock.stockAmount === undefined || item.stock.stockAmount === 0)) {
                return false;
            }

            return true;
        });
    }, [items, requests, filterType, searchQuery, excludeZero]);
}
