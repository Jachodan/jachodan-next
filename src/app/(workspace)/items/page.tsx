"use client";

import { useLayout } from "@/components/layouts/provider/LayoutProvider";
import { Button } from "@/components/ui/button";
import { ItemWithStock } from "@/types/item";
import { useEffect, useMemo, useState } from "react";
import ItemListHeader from "./_components/ItemListHeader";
import { mockItems } from "@/lib/mock/items";
import { useItemListStore } from "@/stores/itemListStore";
import CustomPagination from "@/components/common/CustomPagination";
import { hasRequest, isLowStock } from "@/lib/utils/item";
import { generateMockRequests } from "@/lib/mock/itemRequests";
import { ItemRequest } from "@/types/itemRequest";
import { cn } from "@/lib/utils";
import FavoriteButton from "@/components/common/FavoriteButton";
import ItemRequestIndicator from "@/app/(workspace)/items/_components/ItemRequestIndicator";

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

    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            // 필터 타입 체크
            if (filterType === "request" && !hasRequest(item, requests)) return false;
            if (filterType === "lowStock" && !isLowStock(item)) return false;
            if (filterType === "favorite" && !item.isPin) return false;
            // deadStock은 현재 동작하지 않도록 구현 - 백엔드와 협의 후 추가 예정

            // 검색어 체크
            if (searchQuery && !item.itemName.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }

            // 재고 0건 제외 체크
            if (excludeZero && (item.stock.stockAmount === undefined || item.stock.stockAmount === 0)) {
                return false;
            }

            return true;
        });
    }, [items, requests, filterType, searchQuery, excludeZero]);

    // 페이지네이션
    const itemsPerPage = viewMode === "list" ? LIST_ITEMS_PER_PAGE : CARD_ITEMS_PER_PAGE;
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = filteredItems.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // ScrollArea 컨테이너를 찾아서 스크롤
        const scrollContainer = document.querySelector("[data-radix-scroll-area-viewport]");
        if (scrollContainer) {
            scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        }
    }, [currentPage, totalPages, setCurrentPage]);

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
                            {/* 리스트/카드 섹션 - 컴포넌트 분리 예정 */}
                            {viewMode === "card" ? (
                                <div className="space-y-2">
                                    <div className="relative aspect-square bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">
                                        {item.imageId ? "이미지" : "No Image"}
                                        <ItemRequestIndicator requests={getItemRequests(item.itemId)} variant="card" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="font-medium text-sm truncate flex-1">{item.itemName}</p>
                                        <FavoriteButton
                                            isPin={item.isPin}
                                            onToggle={() => handleToggleFavorite(item.itemId)}
                                            size={16}
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        재고: {item.stock.stockAmount ?? 0}개
                                        {item.buffer && ` / 적정재고: ${item.buffer.bufferAmount}개`}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* 왼쪽 섹션: 이미지 + 아이템명 */}
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground shrink-0">
                                            {item.imageId ? "이미지" : "No"}
                                        </div>
                                        <div className="flex flex-col gap-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium truncate">{item.itemName}</p>
                                                <FavoriteButton
                                                    isPin={item.isPin}
                                                    onToggle={() => handleToggleFavorite(item.itemId)}
                                                    size={18}
                                                />
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                재고: {item.stock.stockAmount ?? 0}개
                                                {item.buffer && ` / 적정재고: ${item.buffer.bufferAmount}개`}
                                            </p>
                                        </div>
                                    </div>

                                    {/* 중간 섹션: 입고요청 메시지 */}
                                    <div className="flex-1 flex items-center justify-center">
                                        <ItemRequestIndicator requests={getItemRequests(item.itemId)} variant="list" />
                                    </div>

                                    {/* 오른쪽 섹션: 재고 수량 조절 기능 추가 예정 */}
                                    <div className="flex-1 flex items-center justify-end"></div>
                                </>
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
