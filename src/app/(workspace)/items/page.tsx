"use client";

import { useLayout } from "@/components/layouts/provider/LayoutProvider";
import { Button } from "@/components/ui/button";
import { ItemWithStock } from "@/types/item";
import { useEffect, useState } from "react";
import ItemListHeader from "./_components/ItemListHeader";
import { mockItems } from "@/lib/mock/items";
import { useItemListStore } from "@/stores/itemListStore";
import CustomPagination from "@/components/common/CustomPagination";
import { generateMockRequests } from "@/lib/mock/itemRequests";
import { ItemRequest } from "@/types/itemRequest";
import { cn } from "@/lib/utils";
import { useFilteredItems } from "@/hooks/useFilteredItems";
import { usePagination } from "@/hooks/usePagination";
import ItemCardView from "./_components/ItemCardView";
import ItemListView from "./_components/ItemListView";

const LIST_ITEMS_PER_PAGE = 8;
const CARD_ITEMS_PER_PAGE = 10;

export default function ItemList() {
    const { setHeaderTitle } = useLayout();
    const [items, setItems] = useState<ItemWithStock[]>([]);
    const [requests, setRequests] = useState<ItemRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const { filterType, searchQuery, excludeZero, viewMode, currentPage, setCurrentPage } = useItemListStore();

    useEffect(() => {
        setHeaderTitle("상품관리");
    }, [setHeaderTitle]);

    // mock 데이터 로딩
    useEffect(() => {
        const loadItems = async () => {
            setIsLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 500));

            const loadedItems = mockItems;
            const loadedRequests = generateMockRequests(loadedItems.map((item) => ({ itemId: item.itemId })));

            setItems(mockItems);
            setRequests(loadedRequests);
            setIsLoading(false);
        };

        loadItems();
    }, []);

    const filteredItems = useFilteredItems({
        items,
        requests,
        filterType,
        searchQuery,
        excludeZero,
    });

    const { paginatedItems, totalPages, handlePageChange } = usePagination({
        items: filteredItems,
        itemsPerPage: viewMode === "list" ? LIST_ITEMS_PER_PAGE : CARD_ITEMS_PER_PAGE,
        currentPage,
        setCurrentPage,
    });

    // 즐겨찾기
    const handleToggleFavorite = (itemId: number) => {
        setItems((prev) =>
            prev.map((item) =>
                item.itemId === itemId
                    ? {
                          ...item,
                          isPin: !item.isPin,
                      }
                    : item
            )
        );
    };

    // 특정 아이템의 요청사항 가져오기
    const getItemRequests = (itemId: number) => {
        return requests.filter((request) => request.itemId === itemId && request.isActive);
    };

    // 빈 상태 메시지
    const getEmptyMessage = () => {
        if (searchQuery) return `"${searchQuery}"에 대한 검색 결과가 없습니다.`;
        if (filterType === "request") return "요청사항이 있는 상품이 없습니다.";
        if (filterType === "lowStock") return "재고가 부족한 상품이 없습니다.";
        if (filterType === "favorite") return "즐겨찾기한 상품이 없습니다.";
        if (filterType === "deadStock") return "악성재고 상품이 없습니다.";
        if (excludeZero) return "표시할 상품이 없습니다.";
        return "등록된 상품이 없습니다.";
    };

    if (isLoading) {
        return (
            <div className="p-10">
                <div className="flex items-center justify-center h-64">
                    <p className="text-muted-foreground">상품 목록을 불러오는 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-10">
            <ItemListHeader />

            {/* 상품 개수 및 페이지 알림 */}
            <div className="flex items-center justify-between py-2 mb-4">
                <p className="text-sm text-muted-foreground">
                    {filterType === "all" ? "전체" : "필터링된"} {filteredItems.length}개 상품
                    {filteredItems.length !== items.length && (
                        <span className="text-muted-foreground/70"> (전체: {items.length}개)</span>
                    )}
                </p>
                {totalPages > 0 && (
                    <p className="text-sm text-muted-foreground">
                        {currentPage} / {totalPages} 페이지
                    </p>
                )}
            </div>

            <div
                className={cn(
                    "grid gap-4",
                    viewMode === "card" ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" : "grid-cols-1"
                )}
            >
                {paginatedItems.length === 0 ? (
                    <div
                        className={cn(
                            "text-center py-12 text-muted-foreground",
                            viewMode === "card" && "col-span-full"
                        )}
                    >
                        {getEmptyMessage()}
                    </div>
                ) : (
                    paginatedItems.map((item) => (
                        <div
                            key={item.itemId}
                            className={cn(
                                "border rounded-lg p-4 transition-shadow cursor-pointer",
                                viewMode === "card" ? "hover:shadow-md" : "hover:shadow-sm flex items-center gap-4"
                            )}
                        >
                            {viewMode === "card" ? (
                                <ItemCardView
                                    item={item}
                                    requests={getItemRequests(item.itemId)}
                                    onToggleFavorite={handleToggleFavorite}
                                />
                            ) : (
                                <ItemListView
                                    item={item}
                                    requests={getItemRequests(item.itemId)}
                                    onToggleFavorite={handleToggleFavorite}
                                />
                            )}
                        </div>
                    ))
                )}
            </div>

            <div className="flex justify-between items-center py-6">
                <div className="flex-1 flex justify-center">
                    {totalPages > 0 && (
                        <CustomPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>
                <Button variant="outline" className="hover:text-white hover:bg-black">
                    + 상품등록
                </Button>
            </div>
        </div>
    );
}
