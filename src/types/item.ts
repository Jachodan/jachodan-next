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

// 상품 정보
export interface ItemWithStock extends Item {
  stock: Stock;
  safeStock?: SafeStock;
  isLowStock: boolean;
  isDeadStock: boolean;
  hasRequest: boolean;
}

// 아이템 리스트 뷰 모드
export type ViewMode = "list" | "card";
