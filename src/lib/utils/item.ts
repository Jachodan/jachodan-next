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
