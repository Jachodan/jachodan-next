"use client";

import { useRouter } from "next/navigation";
import { REQUEST_TYPE, REQUEST_TYPE_LABEL, type RequestType } from "@/types/item";
import ListPageHeader from "@/components/common/ListPageHeader";
import ListPageFooter from "@/components/common/ListPageFooter";
import { useRequestList } from "./_hooks/useRequestList";
import { useRequestModal } from "./_hooks/useRequestModal";
import RequestListTable from "./_components/RequestListTable";
import RequestDetailModal from "./_components/RequestDetailModal";

export default function RequestPage() {
    const router = useRouter();

    const {
        typeFilter,
        setTypeFilter,
        searchValue,
        setSearchValue,
        currentPage,
        setCurrentPage,
        totalPages,
        requests,
        handleRequestTypeChange,
        handleRequestStatusChange,
        triggerUpdate,
    } = useRequestList();

    const {
        isModalOpen,
        selectedRequest,
        isEditMode,
        editItemId,
        setEditItemId,
        editAmount,
        setEditAmount,
        itemOptions,
        handleRowClick,
        handleEditClick,
        handleCancelEdit,
        handleSaveEdit,
        handleModalClose,
    } = useRequestModal({ onUpdate: triggerUpdate });

    const filterOptions = [
        { value: "ALL" as const, label: "전체" },
        ...REQUEST_TYPE.map((type) => ({ value: type, label: REQUEST_TYPE_LABEL[type] })),
    ];

    return (
        <div className="p-10">
            <ListPageHeader
                filterLabel="요청유형"
                filterValue={typeFilter}
                filterOptions={filterOptions}
                onFilterChange={(value) => setTypeFilter(value as RequestType | "ALL")}
                filterPlaceholder="유형 선택"
                searchLabel="검색"
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                searchPlaceholder="상품명 검색"
            />

            <RequestListTable
                requests={requests}
                onRowClick={handleRowClick}
                onRequestTypeChange={handleRequestTypeChange}
                onRequestStatusChange={handleRequestStatusChange}
            />

            <ListPageFooter
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                actionButton={{
                    label: "상품등록",
                    onClick: () => router.push("/request/new"),
                    variant: "outline",
                }}
            />

            <RequestDetailModal
                open={isModalOpen}
                onClose={handleModalClose}
                selectedRequest={selectedRequest}
                isEditMode={isEditMode}
                editItemId={editItemId}
                editAmount={editAmount}
                itemOptions={itemOptions}
                onEditItemIdChange={setEditItemId}
                onEditAmountChange={setEditAmount}
                onEditClick={handleEditClick}
                onCancelEdit={handleCancelEdit}
                onSaveEdit={handleSaveEdit}
            />
        </div>
    );
}
