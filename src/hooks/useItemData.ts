import { useState, useEffect, useCallback } from "react";
import { ItemListItem, ItemFilter } from "@/types/item";
import { getItems } from "@/lib/api";

interface UseItemDataParams {
    excludeZero?: boolean;
    filter?: ItemFilter;
    keyword?: string;
    page?: number;
    size?: number;
}

interface UseItemDataReturn {
    items: ItemListItem[];
    isLoading: boolean;
    error: string | null;
    // 페이지네이션 정보
    pagination: {
        page: number;
        size: number;
        totalElements: number;
        totalPages: number;
    };
    // 데이터 리프레시
    refetch: () => Promise<void>;
    // 낙관적 업데이트 (로컬 상태만 변경)
    // TODO: [React Query 도입 시 제거] - React Query의 optimistic updates로 대체
    updateItemLocally: (itemId: number, updates: Partial<ItemListItem>) => void;
}

/**
 * 아이템 목록 데이터 훅
 *
 * TODO: [React Query 도입 시 변경]
 * - useQuery로 대체하면 캐싱, 자동 리페치, 로딩/에러 상태 관리가 자동화됨
 * - 예시:
 *   const { data, isLoading, error, refetch } = useQuery({
 *     queryKey: ['items', { filter, keyword, page, size }],
 *     queryFn: () => getItems({ filter, keyword, page, size }),
 *   });
 */
export function useItemData({
    excludeZero,
    filter,
    keyword,
    page = 1,
    size = 10,
}: UseItemDataParams): UseItemDataReturn {
    const [items, setItems] = useState<ItemListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        page: 1,
        size: 10,
        totalElements: 0,
        totalPages: 0,
    });

    const fetchItems = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await getItems({
                storeId: 1, // TODO: 세션에서 가져올 예정
                excludeZero,
                filter,
                keyword,
                page,
                size,
            });

            if (result.data) {
                setItems(result.data.content);
                setPagination({
                    page: result.data.page,
                    size: result.data.size,
                    totalElements: result.data.totalElements,
                    totalPages: result.data.totalPages,
                });
            } else {
                setError(result.error || "데이터를 불러오는데 실패했습니다.");
            }
        } catch (err) {
            setError("네트워크 오류가 발생했습니다.");
            console.error("Failed to fetch items:", err);
        } finally {
            setIsLoading(false);
        }
    }, [excludeZero, filter, keyword, page, size]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    /**
     * 낙관적 업데이트 - 로컬 상태만 변경
     * TODO: [React Query 도입 시 제거]
     * - React Query의 optimistic updates + invalidateQueries로 대체
     */
    const updateItemLocally = useCallback((itemId: number, updates: Partial<ItemListItem>) => {
        setItems((prev) =>
            prev.map((item) =>
                item.itemId === itemId ? { ...item, ...updates } : item
            )
        );
    }, []);

    return {
        items,
        isLoading,
        error,
        pagination,
        refetch: fetchItems,
        updateItemLocally,
    };
}
