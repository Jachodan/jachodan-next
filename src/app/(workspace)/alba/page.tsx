"use client";

import { useLayout } from "@/components/layouts/provider/LayoutProvider";
import ListPageFooter from "@/components/common/ListPageFooter";
import ListPageHeader from "@/components/common/ListPageHeader";
import { type AlbaFormData, type AlbaStatus } from "@/types/alba";
import { type WorkStatus } from "@/types/work";
import { EMPLOYMENT_FILTER_OPTIONS, WORK_STATUS_FILTER_OPTIONS } from "@/types/alba";
import { useEffect } from "react";
import { useAlbaData } from "@/hooks/useAlbaData";
import { registerAlba } from "@/lib/api";
import { useAlbaFilter } from "@/hooks/useAlbaFilter";
import { useAlbaModal } from "@/hooks/useAlbaModal";
import { usePagination } from "@/hooks/usePagination";
import { useAlbaPageFilters } from "./_hooks/useAlbaPageFilters";
import AlbaTable from "./_components/AlbaTable";
import AlbaFormModal from "./_components/AlbaFormModal";
import AlbaDetailModal from "./_components/AlbaDetailModal";

export default function AlbaPage() {
    const { setHeaderTitle } = useLayout();
    const itemsPerPage = 10;

    // 알바 리스트 API 데이터
    const { albaList, isLoading, error, refetch } = useAlbaData({ storeId: 1 });

    // 필터 상태 관리
    const {
        employmentFilter,
        workStatusFilter,
        searchValue,
        currentPage,
        setCurrentPage,
        handleEmploymentFilterChange,
        handleWorkStatusFilterChange,
        handleSearchChange,
    } = useAlbaPageFilters();

    // 모달 상태 관리
    const {
        isCreateModalOpen,
        isEditModalOpen,
        isDetailModalOpen,
        selectedAlba,
        openCreateModal,
        openDetailModal,
        openEditModal,
        closeCreateModal,
        closeDetailModal,
        closeEditModal,
    } = useAlbaModal();

    // 필터링
    const filteredAlbaList = useAlbaFilter({
        albaList,
        employmentFilter,
        workStatusFilter,
        searchValue,
    });

    // 페이지네이션
    const {
        paginatedItems: paginatedAlbaList,
        totalPages,
        handlePageChange,
    } = usePagination({
        items: filteredAlbaList,
        itemsPerPage,
        currentPage,
        setCurrentPage,
        scrollToTop: false,
    });

    useEffect(() => {
        setHeaderTitle("알바관리");
    }, [setHeaderTitle]);

    const handleAddAlba = async (data: AlbaFormData) => {
        const result = await registerAlba({
            albaName: data.albaName,
            albaPhone: data.albaPhone,
            albaStatus: "STAFF",
            storeId: 1,
            file: data.profileImage,
        });

        if (result.error) {
            console.error("알바 등록 실패:", result.error);
            return;
        }

        closeCreateModal();
        refetch();
    };

    const handleAlbaUpdate = (data: AlbaFormData) => {
        if (!selectedAlba) return;
        // TODO: API 연결 후 구현
        console.log("알바 수정:", selectedAlba.albaId, data);
        closeEditModal();
        refetch();
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-10">
                <p>로딩 중...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center p-10">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-10">
            <ListPageHeader
                filters={[
                    {
                        label: "고용상태",
                        value: employmentFilter,
                        options: EMPLOYMENT_FILTER_OPTIONS,
                        onChange: (value) => handleEmploymentFilterChange(value as AlbaStatus | "전체"),
                        placeholder: "고용상태 선택",
                    },
                    {
                        label: "근무상태",
                        value: workStatusFilter,
                        options: WORK_STATUS_FILTER_OPTIONS,
                        onChange: (value) => handleWorkStatusFilterChange(value as WorkStatus | "전체"),
                        placeholder: "근무상태 선택",
                    },
                ]}
                searchLabel="검색"
                searchValue={searchValue}
                onSearchChange={handleSearchChange}
                searchPlaceholder="이름으로 검색"
            />

            <AlbaTable albaList={paginatedAlbaList} onRowClick={openDetailModal} />

            <ListPageFooter
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                actionButton={{
                    label: "알바등록",
                    onClick: openCreateModal,
                    variant: "outline",
                }}
            />

            <AlbaFormModal
                open={isCreateModalOpen}
                onClose={closeCreateModal}
                onSave={handleAddAlba}
                storeName="자초단"
            />
            <AlbaFormModal
                open={isEditModalOpen}
                onClose={closeEditModal}
                onSave={handleAlbaUpdate}
                storeName="자초단"
                mode="edit"
                initialData={
                    selectedAlba
                        ? {
                              albaName: selectedAlba.albaName,
                              albaPhone: selectedAlba.albaPhone,
                              workDays: selectedAlba.workDays,
                              albaEmail: "",
                          }
                        : null
                }
            />
            <AlbaDetailModal
                open={isDetailModalOpen}
                alba={selectedAlba}
                onClose={closeDetailModal}
                onEdit={openEditModal}
            />
        </div>
    );
}
