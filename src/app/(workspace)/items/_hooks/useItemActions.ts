import { ItemWithStock, Request } from "@/types/item";

interface UseItemActionsProps {
    items: ItemWithStock[];
    requests: Request[];
    updateItem: (itemId: number, updates: Partial<ItemWithStock>) => void;
}

export function useItemActions({ items, requests, updateItem }: UseItemActionsProps) {
    // 즐겨찾기 토글
    const handleToggleFavorite = (itemId: number) => {
        const item = items.find((item) => item.itemId === itemId);
        if (item) {
            updateItem(itemId, { isPin: !item.isPin });
        }
    };

    // 재고 수량 변경
    const handleStockChange = (itemId: number, newStock: number) => {
        updateItem(itemId, {
            stock: {
                ...items.find((item) => item.itemId === itemId)!.stock,
                stockAmount: newStock,
            },
        });
    };

    // 특정 아이템의 입고요청만 가져오기
    const getItemRequests = (itemId: number) => {
        return requests.filter(
            (request) => request.itemId === itemId && request.isActive && request.requestType === "입고요청"
        );
    };

    return {
        handleToggleFavorite,
        handleStockChange,
        getItemRequests,
    };
}
