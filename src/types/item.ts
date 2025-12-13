export interface Item {
    itemId: number;
    storeId: number;
    itemName: string;
    createdAt: string;
    isDel: boolean;
}

// 가게 재고
export interface Stock {
    itemId: number;
    storeId: number;
    stockId: number;
    quantity: number;
    isFavorite: boolean;
}

// 안전 재고
export interface SafeStock {
    stockId: number;
    safeQuantity: number;
}