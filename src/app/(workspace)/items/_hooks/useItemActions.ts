import { ItemListItem } from "@/types/item";
import { updateItem as updateItemApi } from "@/lib/api";

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

        const newPinnedState = !item.isPinned;

        // 낙관적 업데이트
        updateItemLocally(itemId, { isPinned: newPinnedState });

        // API 호출
        try {
            const result = await updateItemApi(itemId, { isPinned: newPinnedState });
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

    // 재고 수량 변경
    // TODO: 재고 변경 API 연결 필요 (현재 API 명세에 없음)
    const handleStockChange = async (itemId: number, newStock: number) => {
        const item = items.find((i) => i.itemId === itemId);
        if (!item) return;

        const oldStock = item.stockAmount;

        // 낙관적 업데이트
        updateItemLocally(itemId, { stockAmount: newStock });

        // TODO: 재고 변경 API 호출
        // 현재는 로컬 상태만 변경하고, 다음 refetch 시 서버 데이터로 덮어씌워짐
        console.log(`Stock changed: ${itemId} ${oldStock} -> ${newStock}`);
    };

    return {
        handleToggleFavorite,
        handleStockChange,
    };
}
