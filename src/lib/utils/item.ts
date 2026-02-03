import { ItemFilter, ItemListItem, ItemWithStock } from "@/types/item";
import { ItemRequest } from "@/types/itemRequest";

/**
 * 프론트 FilterType을 API ItemFilter로 변환
 */
export function toApiFilter(filterType: FilterType): ItemFilter | undefined {
    const filterMap: Record<FilterType, ItemFilter | undefined> = {
        all: undefined,
        request: "HAS_REQUEST",
        lowStock: "LOW_STOCK",
        favorite: "FAVORITE",
        deadStock: "BAD_STOCK",
    };
    return filterMap[filterType];
}

/**
 * 요청 상태를 한글로 변환
 */
export function formatRequestStatus(status: string): string {
    const statusMap: Record<string, string> = {
        WAIT: "대기",
        APPROVED: "승인",
        REJECTED: "반려",
        CONFIRM: "확인중",
        CANCLE: "취소",
        COMPLETE: "완료",
    };
    return statusMap[status] || status;
}

/**
 * 요청 타입을 한글로 변환
 */
export function formatRequestType(type: string): string {
    const typeMap: Record<string, string> = {
        ORDER: "입고요청",
        RETURN: "발주금지",
        DISCARD: "폐기요청",
        CHECK: "유통기한 확인",
    };
    return typeMap[type] || type;
}

/**
 * 아이템의 재고 정보 포맷팅
 */
export function formatStockAmount(stockAmount: number): string {
    return `재고: ${stockAmount}개`;
}

/**
 * 아이템에 대기 중인 요청이 있는지 확인
 */
export function hasActiveRequest(item: ItemListItem): boolean {
    return item.latestRequestId > 0 && ["WAIT", "CONFIRM", "APPROVED"].includes(item.latestRequestStatus);
}

export const FILTER_TYPES = ["all", "request", "lowStock", "favorite", "deadStock"] as const;
export type FilterType = (typeof FILTER_TYPES)[number];

export function isValidFilterType(value: string | null): value is FilterType {
    return value !== null && FILTER_TYPES.includes(value as FilterType);
}

export function getItemListEmptyMessage(filterType: FilterType, searchQuery: string): string {
    if (searchQuery) return `"${searchQuery}"에 대한 검색 결과가 없습니다.`;
    if (filterType === "request") return "요청사항이 있는 상품이 없습니다.";
    if (filterType === "lowStock") return "재고가 부족한 상품이 없습니다.";
    if (filterType === "favorite") return "즐겨찾기한 상품이 없습니다.";
    if (filterType === "deadStock") return "악성재고 상품이 없습니다.";
    return "등록된 상품이 없습니다.";
}

/**
 * 재고 부족 여부 확인 (대시보드용 - ItemWithStock 타입)
 * TODO: 대시보드 API 연결 시 제거
 */
export function isLowStock(item: ItemWithStock): boolean {
    if (!item.buffer?.bufferAmount) return false;
    const stockAmount = item.stock.stockAmount ?? 0;
    return stockAmount < item.buffer.bufferAmount;
}

/**
 * 입고요청이 있는지 확인 (useFilteredItems용 - ItemWithStock 타입)
 * TODO: 대시보드/다른 페이지 API 연결 시 제거
 */
export function hasRequest(item: ItemWithStock, requests: ItemRequest[]): boolean {
    return requests.some(
        (req) =>
            req.itemId === item.itemId &&
            req.requestType === "입고요청" &&
            !["완료", "취소", "반려"].includes(req.requestStatus),
    );
}
