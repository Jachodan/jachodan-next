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
