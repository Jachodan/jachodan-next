import { ItemWithStock } from "@/types/item";
import { ItemRequest } from "@/types/itemRequest";

export function isLowStock(item: ItemWithStock): boolean {
    if (!item.buffer?.bufferAmount) return false;
    const stockAmount = item.stock.stockAmount ?? 0;
    return stockAmount < item.buffer?.bufferAmount;
}

export function hasRequest(item: ItemWithStock, requests: ItemRequest[]): boolean {
    return requests.some(
        (req) =>
            req.itemId === item.itemId &&
            req.requestType === "입고요청" &&
            !["완료", "취소", "반려"].includes(req.requestStatus)
    );
}

export function getItemStatus(item: ItemWithStock, requests: ItemRequest[]) {
    return {
        isLowStock: isLowStock(item),
        hasRequest: hasRequest(item, requests),
    };
}

export function formatStockInfo(item: ItemWithStock): string {
    const stockText = `재고: ${item.stock.stockAmount ?? 0}개`;
    const bufferText = item.buffer ? ` / 적정재고: ${item.buffer.bufferAmount}개` : "";
    return stockText + bufferText;
}

type FilterType = "all" | "request" | "lowStock" | "favorite" | "deadStock";

export function getItemListEmptyMessage(
    filterType: FilterType,
    searchQuery: string,
    excludeZero: boolean
): string {
    if (searchQuery) return `"${searchQuery}"에 대한 검색 결과가 없습니다.`;
    if (filterType === "request") return "요청사항이 있는 상품이 없습니다.";
    if (filterType === "lowStock") return "재고가 부족한 상품이 없습니다.";
    if (filterType === "favorite") return "즐겨찾기한 상품이 없습니다.";
    if (filterType === "deadStock") return "악성재고 상품이 없습니다.";
    if (excludeZero) return "표시할 상품이 없습니다.";
    return "등록된 상품이 없습니다.";
}
