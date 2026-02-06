export interface Item {
    itemId: number;
    storeId: number;
    imageId?: number;
    itemName: string;
    createdAt: string;
    updatedAt?: string;
    isActive: boolean;
    isPin: boolean;
}

// API Response Types
export type ItemFilter = "FAVORITE" | "LOW_STOCK" | "HAS_REQUEST" | "BAD_STOCK";
export type ItemKeyword = "itemName" | "stockAmount";
export type RequestStatus = "WAIT" | "APPROVED" | "REJECTED" | "CONFIRM" | "CANCLE" | "COMPLETE";
export type RequestType = "ORDER" | "RETURN" | "DISCARD" | "CHECK";
export type LogType = "IN" | "OUT";

// GET /stores/{storeId}/items - 목록 조회 요청 파라미터
export interface GetItemsParams {
    storeId: number;
    filter?: ItemFilter;
    keyword?: string;
    page?: number;
    size?: number;
}

// GET /stores/{storeId}/items - 목록 조회 응답 아이템
export interface ItemListItem {
    imageId: number;
    isPinned: boolean;
    itemId: number;
    itemName: string;
    latestRequestAmount: number;
    latestRequestCreatedAt: string;
    latestRequestId: number;
    latestRequestStatus: RequestStatus;
    latestRequestType: RequestType;
    stockAmount: number;
    stockId: number;
}

// GET /stores/{storeId}/items - 목록 조회 응답
export interface ItemListResponse {
    content: ItemListItem[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

// POST /stores/{storeId}/items - 아이템 생성 요청
export interface CreateItemRequest {
    imageId?: number;
    itemName: string;
    stockAmount: number;
}

// POST /stores/{storeId}/items - 아이템 생성 응답
export interface CreateItemResponse {
    itemId: number;
    stockId: number;
}

// GET /stores/{storeId}/items/{itemId} - 상세 조회 응답
export interface ItemDetailResponse {
    bufferAmount: number;
    imageId: number;
    isPinned: boolean;
    itemId: number;
    itemName: string;
    lastLogAt: string;
    lastLogType: LogType;
    stockAmount: number;
}

// PUT /stores/{storeId}/items/{itemId} - 수정 요청
export interface UpdateItemRequest {
    bufferAmount?: number;
    imageId?: number;
    isPinned?: boolean;
    itemName?: string;
    targetAmount?: number;
}

// 가게 재고
export interface Stock {
    itemId: number;
    stockId: number;
    stockAmount?: number;
    createdAt: string;
    updatedAt?: string;
}

// 안전 재고
export interface Buffer {
    itemId: number;
    bufferId: number;
    bufferAmount?: number;
    createdAt: string;
    updatedAt?: string;
}

// 재고 수량 수정 내역
export const STOCKLOG_TYPE = ["입고", "출고"] as const;
export type StockLogType = (typeof STOCKLOG_TYPE)[number];
export interface StockLog {
    itemId: number;
    stockLogId: number;
    stockLogType?: StockLogType;
    stockLogAmount?: number;
    createdAt: string;
}

// 상품 정보
export interface ItemWithStock extends Item {
    stock: Stock;
    buffer?: Buffer;
}

// 아이템 리스트 뷰 모드
export type ViewMode = "list" | "card";

// POST /stores/{storeId}/stocks/{stockId}/in - 재고 입고 요청
// POST /stores/{storeId}/stocks/{stockId}/out - 재고 출고 요청
export interface StockInOutRequest {
    amount: number;
}

// POST /stores/{storeId}/stocks/{stockId}/in - 재고 입고 응답
// POST /stores/{storeId}/stocks/{stockId}/out - 재고 출고 응답
export interface StockInOutResponse {
    stockAmount: number;
    stockId: number;
}
