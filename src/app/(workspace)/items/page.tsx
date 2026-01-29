"use client";

import { Suspense } from "react";
import { useLayout } from "@/components/layouts/provider/LayoutProvider";
import { useEffect } from "react";
import { getItems } from "@/lib/api";
import ItemListHeader from "./_components/ItemListHeader";
import { useItemListStore } from "@/stores/itemListStore";
import ListPageFooter from "@/components/common/ListPageFooter";
import { useFilteredItems } from "@/hooks/useFilteredItems";
import { usePagination } from "@/hooks/usePagination";
import { useItemData } from "@/hooks/useItemData";
import { useItemModal } from "@/hooks/useItemModal";
import { useItemActions } from "./_hooks/useItemActions";
import ItemListStats from "./_components/ItemListStats";
import ItemListContainer from "./_components/ItemListContainer";
import ItemModalManager from "./_components/ItemModalManager";
import ItemAlertDialogs from "./_components/ItemAlertDialogs";
import { useUrlFilterSync } from "@/hooks/useUrlFilterSync";

const LIST_ITEMS_PER_PAGE = 8;
const CARD_ITEMS_PER_PAGE = 10;

function ItemListContent() {
    const { setHeaderTitle } = useLayout();
    const { filterType, setFilterType } = useUrlFilterSync();
    const { searchQuery, excludeZero, viewMode, currentPage, setCurrentPage } = useItemListStore();

    const { items, requests, isLoading, updateItem, addItem, deleteItem } = useItemData();

    // 모달 관련 상태 및 핸들러
    const {
        modalOpen,
        modalMode,
        selectedItem,
        formData,
        showSaveAlert,
        showDeleteAlert,
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
    } = useItemModal({ updateItem, addItem, deleteItem });

    // 아이템 액션
    const { handleToggleFavorite, handleStockChange, getItemRequests } = useItemActions({
        items,
        requests,
        updateItem,
    });

    useEffect(() => {
        setHeaderTitle("상품관리");
    }, [setHeaderTitle]);

    // API 테스트용 (콘솔에서 확인 후 삭제)
    useEffect(() => {
        const testApi = async () => {
            console.log("🔄 API 테스트 시작...");
            const result = await getItems({ storeId: 1 });
            console.log("📦 API 응답:", result);
        };
        testApi();
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

    // 현재 선택된 아이템의 최신 정보 가져오기
    const currentSelectedItem = selectedItem ? items.find((item) => item.itemId === selectedItem.itemId) : null;

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
            <ItemListHeader filterType={filterType} setFilterType={setFilterType} />

            <ItemListStats
                filterType={filterType}
                filteredCount={filteredItems.length}
                totalCount={items.length}
                currentPage={currentPage}
                totalPages={totalPages}
            />

            <ItemListContainer
                items={paginatedItems}
                viewMode={viewMode}
                filterType={filterType}
                searchQuery={searchQuery}
                excludeZero={excludeZero}
                onItemClick={handleOpenDetailModal}
                onToggleFavorite={handleToggleFavorite}
                onStockChange={handleStockChange}
                getItemRequests={getItemRequests}
            />

            <ListPageFooter
                currentPage={currentPage}
                totalPages={totalPages}
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
                currentSelectedItem={currentSelectedItem ?? null}
                onClose={handleCloseModal}
                onModeChange={handleModeChange}
                onFormChange={handleFormChange}
                onToggleFavorite={() => selectedItem && handleToggleFavorite(selectedItem.itemId)}
                onDelete={handleDelete}
                onSave={handleSave}
            />

            <ItemAlertDialogs
                showSaveAlert={showSaveAlert}
                showDeleteAlert={showDeleteAlert}
                itemName={formData?.itemName || selectedItem?.itemName}
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
