"use client";

import { Suspense } from "react";
import { useLayout } from "@/components/layouts/provider/LayoutProvider";
import { useEffect } from "react";
import ItemListHeader from "./_components/ItemListHeader";
import { useItemListStore } from "@/stores/itemListStore";
import ListPageFooter from "@/components/common/ListPageFooter";
import { useItemData } from "@/hooks/useItemData";
import { useItemActions } from "./_hooks/useItemActions";
import { useItemModal } from "@/hooks/useItemModal";
import ItemListStats from "./_components/ItemListStats";
import ItemListContainer from "./_components/ItemListContainer";
import ItemModalManager from "./_components/ItemModalManager";
import ItemAlertDialogs from "./_components/ItemAlertDialogs";
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

    // 모달 관리 훅
    const {
        modalOpen,
        modalMode,
        selectedItem,
        showSaveAlert,
        showDeleteAlert,
        isLoading: isModalLoading,
        handleOpenCreateModal,
        handleOpenDetailModal,
        handleCloseModal,
        handleModeChange,
        handleFormChange,
        handleSave,
        handleSaveConfirm,
        handleDelete,
        handleDeleteConfirm,
        setShowSaveAlert,
        setShowDeleteAlert,
    } = useItemModal({ refetch });

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

    // 아이템 클릭 핸들러 (상세 모달) - API에서 상세 정보를 가져옴
    const handleItemClick = (item: ItemListItem) => {
        handleOpenDetailModal(item.itemId);
    };

    // 즐겨찾기 토글 (모달에서)
    const handleModalToggleFavorite = () => {
        if (selectedItem) {
            handleToggleFavorite(selectedItem.itemId);
        }
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

            <ItemModalManager
                open={modalOpen}
                mode={modalMode}
                selectedItem={selectedItem}
                currentSelectedItem={selectedItem}
                isLoading={isModalLoading}
                onClose={handleCloseModal}
                onModeChange={handleModeChange}
                onFormChange={handleFormChange}
                onToggleFavorite={handleModalToggleFavorite}
                onDelete={handleDelete}
                onSave={handleSave}
            />

            <ItemAlertDialogs
                showSaveAlert={showSaveAlert}
                showDeleteAlert={showDeleteAlert}
                itemName={selectedItem?.itemName}
                onSaveAlertChange={setShowSaveAlert}
                onDeleteAlertChange={setShowDeleteAlert}
                onSaveConfirm={handleSaveConfirm}
                onDeleteConfirm={handleDeleteConfirm}
            />
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
