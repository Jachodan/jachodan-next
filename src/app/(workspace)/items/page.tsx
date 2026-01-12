"use client";

import { useLayout } from "@/components/layouts/provider/LayoutProvider";
import { useEffect } from "react";
import ItemListHeader from "./_components/ItemListHeader";
import { useItemListStore } from "@/stores/itemListStore";
import ListPageFooter from "@/components/common/ListPageFooter";
import { cn } from "@/lib/utils";
import { getItemListEmptyMessage } from "@/lib/utils/item";
import { useFilteredItems } from "@/hooks/useFilteredItems";
import { usePagination } from "@/hooks/usePagination";
import { useItemData } from "@/hooks/useItemData";
import ItemCardView from "./_components/ItemCardView";
import ItemListView from "./_components/ItemListView";

const LIST_ITEMS_PER_PAGE = 8;
const CARD_ITEMS_PER_PAGE = 10;

export default function ItemList() {
    const { setHeaderTitle } = useLayout();
    const { filterType, searchQuery, excludeZero, viewMode, currentPage, setCurrentPage } = useItemListStore();

    const { items, requests, isLoading, updateItem } = useItemData();

    useEffect(() => {
        setHeaderTitle("상품관리");
    }, [setHeaderTitle]);

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

    // 특정 아이템의 요청사항 가져오기
    const getItemRequests = (itemId: number) => {
        return requests.filter((request) => request.itemId === itemId && request.isActive);
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
            <div className="flex items-center justify-between py-2">
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
                        {getItemListEmptyMessage(filterType, searchQuery, excludeZero)}
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
                                    onStockChange={handleStockChange}
                                />
                            ) : (
                                <ItemListView
                                    item={item}
                                    requests={getItemRequests(item.itemId)}
                                    onToggleFavorite={handleToggleFavorite}
                                    onStockChange={handleStockChange}
                                />
                            )}
                        </div>
                    ))
                )}
            </div>

            <ListPageFooter
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                actionButton={{
                    label: "+ 상품등록",
                    onClick: () => {
                        // TODO: 상품등록 핸들러 추가
                    },
                }}
            />
        </div>
    );
}
