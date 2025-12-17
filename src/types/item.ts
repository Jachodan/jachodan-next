export interface Item {
    itemId: number;
    storeId: number;
    imageId?: number;
    itemName: string;
    createdAt: string;
    isDel: boolean;
}

// 가게 재고
export interface Stock {
    itemId: number;
    storeId: number; // 매장id
    stockId: number;
    quantity?: number;
    isFavorite: boolean;
}

// 안전 재고
export interface SafeStock {
    stockId: number;
    safeQuantity: number;
}