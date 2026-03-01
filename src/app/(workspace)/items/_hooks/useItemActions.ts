import { ItemListItem } from "@/types/item";
import { toggleItemPin, stockIn, stockOut, stockAdjust } from "@/lib/api";
import { StockInOutParams } from "@/components/common/StockControl";

interface UseItemActionsProps {
    items: ItemListItem[];
    updateItemLocally: (itemId: number, updates: Partial<ItemListItem>) => void;
    refetch: () => Promise<void>;
}

/**
 * 아이템 액션 훅
 *
 * TODO: [React Query 도입 시 변경]
 * - useMutation으로 대체하면 낙관적 업데이트와 에러 롤백이 자동화됨
 * - 예시:
 *   const toggleFavoriteMutation = useMutation({
 *     mutationFn: (itemId) => updateItemApi(itemId, { isPinned: !item.isPinned }),
 *     onMutate: async (itemId) => { // 낙관적 업데이트 },
 *     onError: (err, itemId, context) => { // 롤백 },
 *     onSettled: () => queryClient.invalidateQueries(['items']),
 *   });
 */
export function useItemActions({
    items,
    updateItemLocally,
    refetch,
}: UseItemActionsProps) {
    // 즐겨찾기 토글
    const handleToggleFavorite = async (itemId: number) => {
        const item = items.find((i) => i.itemId === itemId);
        if (!item) return;

        const newPinnedState = !(item.isPinned ?? false);

        // 낙관적 업데이트
        updateItemLocally(itemId, { isPinned: newPinnedState });

        // API 호출
        try {
            const result = await toggleItemPin(itemId);
            if (result.error) {
                // 실패 시 롤백
                updateItemLocally(itemId, { isPinned: !newPinnedState });
                console.error("Failed to toggle favorite:", result.error);
            }
        } catch (error) {
            // 에러 시 롤백
            updateItemLocally(itemId, { isPinned: !newPinnedState });
            console.error("Failed to toggle favorite:", error);
        }
    };

    // 재고 입고/출고
    const handleStockInOut = async (
        itemId: number,
        params: StockInOutParams
    ) => {
        const item = items.find((i) => i.itemId === itemId);
        if (!item) return;

        const oldStock = item.stockAmount;
        const newStock =
            params.actionType === "in"
                ? oldStock + params.amount
                : Math.max(0, oldStock - params.amount);

        // 낙관적 업데이트
        updateItemLocally(itemId, { stockAmount: newStock });

        // API 호출
        try {
            const apiCall =
                params.actionType === "in" ? stockIn : stockOut;
            const result = await apiCall(itemId, { amount: params.amount });

            if (result.error) {
                // 실패 시 롤백
                updateItemLocally(itemId, { stockAmount: oldStock });
                console.error("Failed to update stock:", result.error);
                return;
            }

            // 성공 시 서버 응답으로 업데이트
            if (result.data) {
                updateItemLocally(itemId, { stockAmount: result.data.stockAmount });
            }
        } catch (error) {
            // 에러 시 롤백
            updateItemLocally(itemId, { stockAmount: oldStock });
            console.error("Failed to update stock:", error);
        }
    };

    // 재고 직접 조정
    const handleStockAdjust = async (itemId: number, newStock: number) => {
        const item = items.find((i) => i.itemId === itemId);
        if (!item) return;

        const oldStock = item.stockAmount;

        // 낙관적 업데이트
        updateItemLocally(itemId, { stockAmount: newStock });

        try {
            const result = await stockAdjust(itemId, { stockAmount: newStock });

            if (result.error) {
                updateItemLocally(itemId, { stockAmount: oldStock });
                console.error("Failed to adjust stock:", result.error);
                return;
            }

            if (result.data) {
                updateItemLocally(itemId, { stockAmount: result.data.stockAmount });
            }
        } catch (error) {
            updateItemLocally(itemId, { stockAmount: oldStock });
            console.error("Failed to adjust stock:", error);
        }
    };

    return {
        handleToggleFavorite,
        handleStockInOut,
        handleStockAdjust,
    };
}
