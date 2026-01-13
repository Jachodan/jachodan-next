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
import { useItemModal } from "@/hooks/useItemModal";
import ItemCardView from "./_components/ItemCardView";
import ItemListView from "./_components/ItemListView";
import CommonModal from "@/components/common/CommonModal";
import ItemModalContent from "./_components/ItemModalContent";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const LIST_ITEMS_PER_PAGE = 8;
const CARD_ITEMS_PER_PAGE = 10;

export default function ItemList() {
    const { setHeaderTitle } = useLayout();
    const { filterType, searchQuery, excludeZero, viewMode, currentPage, setCurrentPage } = useItemListStore();

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

    // 현재 선택된 아이템의 최신 정보 가져오기
    const currentSelectedItem = selectedItem ? items.find((item) => item.itemId === selectedItem.itemId) : null;

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
                            onClick={() => handleOpenDetailModal(item)}
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
                    onClick: handleOpenCreateModal,
                }}
            />

            {/* 아이템 모달 */}
            <CommonModal
                open={modalOpen}
                onClose={handleCloseModal}
                title={
                    modalMode === "create"
                        ? "상품 등록"
                        : modalMode === "edit"
                        ? "상품 수정"
                        : selectedItem?.itemName ?? "상품 상세"
                }
                size="md"
                footer={
                    modalMode === "detail" ? (
                        <Button variant="outline" onClick={handleCloseModal}>
                            닫기
                        </Button>
                    ) : (
                        <>
                            <Button variant="outline" onClick={handleCloseModal}>
                                취소
                            </Button>
                            <Button onClick={handleSave}>{modalMode === "create" ? "등록" : "저장"}</Button>
                        </>
                    )
                }
            >
                <ItemModalContent
                    key={`${modalMode}-${selectedItem?.itemId || "create"}`}
                    mode={modalMode}
                    item={currentSelectedItem || selectedItem}
                    onModeChange={handleModeChange}
                    onFormChange={handleFormChange}
                    onToggleFavorite={() => selectedItem && handleToggleFavorite(selectedItem.itemId)}
                    onDelete={handleDelete}
                    onSave={handleSave}
                />
            </CommonModal>

            {/* 수정 확인 Alert */}
            <AlertDialog open={showSaveAlert} onOpenChange={setShowSaveAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>상품 수정</AlertDialogTitle>
                        <AlertDialogDescription>
                            {formData?.itemName}의 정보를 수정하시겠습니까?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>취소</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSaveConfirm}>확인</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* 삭제 확인 Alert */}
            <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>상품 삭제</AlertDialogTitle>
                        <AlertDialogDescription>
                            {selectedItem?.itemName}을(를) 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>취소</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            삭제
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
