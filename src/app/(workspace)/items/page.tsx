"use client";

import { Suspense } from "react";
import { useLayout } from "@/components/layouts/provider/LayoutProvider";
import { useEffect } from "react";
import ItemListHeader from "./_components/ItemListHeader";
import { useItemListStore } from "@/stores/itemListStore";
import ListPageFooter from "@/components/common/ListPageFooter";
import { useItemData } from "@/hooks/useItemData";
import { useItemActions } from "./_hooks/useItemActions";
import ItemListStats from "./_components/ItemListStats";
import ItemListContainer from "./_components/ItemListContainer";
import { useUrlFilterSync } from "@/hooks/useUrlFilterSync";
import { toApiFilter } from "@/lib/utils/item";
import { ItemListItem } from "@/types/item";

const LIST_ITEMS_PER_PAGE = 8;
const CARD_ITEMS_PER_PAGE = 10;

function ItemListContent() {
    const { setHeaderTitle } = useLayout();
    const { filterType, setFilterType } = useUrlFilterSync();
    const { searchQuery, viewMode, currentPage, setCurrentPage } = useItemListStore();

    // 서버 필터링/페이지네이션 사용
    const itemsPerPage = viewMode === "list" ? LIST_ITEMS_PER_PAGE : CARD_ITEMS_PER_PAGE;

    /**
     * API에서 데이터 가져오기
     * TODO: [React Query 도입 시 변경]
     * - useQuery로 대체하면 캐싱, 자동 리페치가 자동화됨
     */
    const { items, isLoading, error, pagination, refetch, updateItemLocally } = useItemData({
        filter: toApiFilter(filterType),
        keyword: searchQuery || undefined,
        page: currentPage, // API도 1-based
        size: itemsPerPage,
    });

    // 아이템 액션 (즐겨찾기 토글, 재고 변경)
    const { handleToggleFavorite, handleStockChange } = useItemActions({
        items,
        updateItemLocally,
        refetch,
    });

    useEffect(() => {
        setHeaderTitle("상품관리");
    }, [setHeaderTitle]);

    // 페이지 변경 핸들러
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // 스크롤 맨 위로
        const scrollContainer = document.querySelector("[data-radix-scroll-area-viewport]");
        if (scrollContainer) {
            scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    // 아이템 클릭 핸들러 (상세 모달)
    // TODO: 모달 기능은 별도 작업 필요 (ItemListItem 타입에 맞게 수정)
    const handleItemClick = (item: ItemListItem) => {
        console.log("Item clicked:", item);
        // TODO: 상세 모달 열기
    };

    // 상품 등록 핸들러
    // TODO: 모달 기능은 별도 작업 필요
    const handleOpenCreateModal = () => {
        console.log("Open create modal");
        // TODO: 생성 모달 열기
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

    if (error) {
        return (
            <div className="p-10">
                <div className="flex items-center justify-center h-64">
                    <p className="text-red-500">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-10">
            <ItemListHeader filterType={filterType} setFilterType={setFilterType} />

            <ItemListStats
                filterType={filterType}
                filteredCount={pagination.totalElements}
                totalCount={pagination.totalElements}
                currentPage={currentPage}
                totalPages={pagination.totalPages}
            />

            <ItemListContainer
                items={items}
                viewMode={viewMode}
                filterType={filterType}
                searchQuery={searchQuery}
                onItemClick={handleItemClick}
                onToggleFavorite={handleToggleFavorite}
                onStockChange={handleStockChange}
            />

            <ListPageFooter
                currentPage={currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
                actionButton={{
                    label: "+ 상품등록",
                    onClick: handleOpenCreateModal,
                }}
            />

            {/* TODO: 모달 기능 추가 예정
            <ItemModalManager ... />
            <ItemAlertDialogs ... />
            */}
        </div>
    );
}

export default function ItemList() {
    return (
        <Suspense
            fallback={
                <div className="p-10">
                    <div className="flex items-center justify-center h-64">
                        <p className="text-muted-foreground">상품 목록을 불러오는 중...</p>
                    </div>
                </div>
            }
        >
            <ItemListContent />
        </Suspense>
    );
}
