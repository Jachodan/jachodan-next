"use client";

import { useLayout } from "@/components/layouts/provider/LayoutProvider";
import ListPageFooter from "@/components/common/ListPageFooter";
import ListPageHeader from "@/components/common/ListPageHeader";
import StatusBadge from "@/components/common/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SCHEDULE_DAYS, type WorkStatus } from "@/types/work";
import type { AlbaStatus } from "@/types/user";
import { useEffect, useState } from "react";
import { mockAlbaList, type Alba } from "@/lib/mock/alba";
import AlbaFormModal, { type AlbaFormData } from "./_components/AlbaFormModal";
import AlbaDetailModal from "./_components/AlbaDetailModal";
import AlbaTooltip from "./_components/AlbaTooltip";

export default function AlbaPage() {
    const { setHeaderTitle } = useLayout();
    const [employmentFilter, setEmploymentFilter] = useState<AlbaStatus | "전체">("전체");
    const [workStatusFilter, setWorkStatusFilter] = useState<WorkStatus | "전체">("전체");
    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedAlba, setSelectedAlba] = useState<Alba | null>(null);
    const [albaList, setAlbaList] = useState<Alba[]>(mockAlbaList);
    const itemsPerPage = 10;

    useEffect(() => {
        setHeaderTitle("알바관리");
    }, [setHeaderTitle]);

    // 필터링 및 검색 로직
    const filteredAlbaList = albaList
        .filter((alba) => {
            // 고용상태 필터
            const matchesEmployment = employmentFilter === "전체" || alba.albaStatus === employmentFilter;

            // 근무상태 필터 (퇴사자는 근무상태가 없으므로 필터링 제외)
            const matchesWorkStatus =
                workStatusFilter === "전체" || alba.albaStatus === "퇴사" || alba.workStatus === workStatusFilter;

            // 검색어 필터 (이름만)
            const matchesSearch = searchValue === "" || alba.albaName.toLowerCase().includes(searchValue.toLowerCase());

            return matchesEmployment && matchesWorkStatus && matchesSearch;
        })
        .sort((a, b) => {
            // 퇴사자를 마지막으로 정렬
            if (a.albaStatus === "퇴사" && b.albaStatus !== "퇴사") return 1;
            if (a.albaStatus !== "퇴사" && b.albaStatus === "퇴사") return -1;
            return 0;
        });

    // 페이지네이션 계산
    const totalPages = Math.ceil(filteredAlbaList.length / itemsPerPage);
    // 현재 페이지가 총 페이지 수를 초과하면 첫 페이지로 조정
    const validCurrentPage = currentPage > totalPages && totalPages > 0 ? 1 : currentPage;
    const startIndex = (validCurrentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedAlbaList = filteredAlbaList.slice(startIndex, endIndex);

    // 페이지 변경 핸들러 (필터 변경 시 첫 페이지로 이동)
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleEmploymentFilterChange = (value: AlbaStatus | "전체") => {
        setEmploymentFilter(value);
        setCurrentPage(1);
    };

    const handleWorkStatusFilterChange = (value: WorkStatus | "전체") => {
        setWorkStatusFilter(value);
        setCurrentPage(1);
    };

    const handleSearchChange = (value: string) => {
        setSearchValue(value);
        setCurrentPage(1);
    };

    const handleAlbaSave = (data: AlbaFormData) => {
        // 새로운 알바 ID 생성 (현재 최대 ID + 1)
        const newAlbaId = albaList.length > 0 ? Math.max(...albaList.map((alba) => alba.albaId)) + 1 : 1;

        // 새 알바 객체 생성
        const newAlba: Alba = {
            albaId: newAlbaId,
            albaName: data.albaName,
            albaStatus: "재직", // 신규 등록은 기본적으로 재직
            albaPhone: data.albaPhone,
            workDays: data.workDays,
            workStatus: "휴무", // 기본 근무상태는 휴무
        };

        // 알바 리스트에 추가
        setAlbaList((prev) => [...prev, newAlba]);

        console.log("알바 추가 완료:", newAlba);
    };

    const handleRowClick = (alba: Alba) => {
        setSelectedAlba(alba);
        setIsDetailModalOpen(true);
    };

    const handleDetailModalClose = () => {
        setIsDetailModalOpen(false);
        setSelectedAlba(null);
    };

    const handleEditAlba = () => {
        setIsDetailModalOpen(false);
        setIsEditModalOpen(true);
    };

    const handleAlbaUpdate = (data: AlbaFormData) => {
        if (!selectedAlba) return;

        setAlbaList((prev) =>
            prev.map((alba) => {
                if (alba.albaId !== selectedAlba.albaId) return alba;

                const hasWorkDays = data.workDays.length > 0;
                const wasRetired = alba.albaStatus === "퇴사";

                // 근무일이 없으면 퇴사 처리
                if (!hasWorkDays) {
                    return {
                        ...alba,
                        albaName: data.albaName,
                        albaPhone: data.albaPhone,
                        workDays: data.workDays,
                        albaStatus: "퇴사",
                        workStatus: undefined,
                    };
                }

                // 퇴사자가 근무일이 생기면 재직으로 변경
                if (wasRetired && hasWorkDays) {
                    return {
                        ...alba,
                        albaName: data.albaName,
                        albaPhone: data.albaPhone,
                        workDays: data.workDays,
                        albaStatus: "재직",
                        workStatus: "휴무",
                    };
                }

                // 일반 수정
                return {
                    ...alba,
                    albaName: data.albaName,
                    albaPhone: data.albaPhone,
                    workDays: data.workDays,
                };
            })
        );
    };

    const handleEditModalClose = () => {
        setIsEditModalOpen(false);
        setSelectedAlba(null);
    };

    // 고용상태 필터 옵션
    const employmentOptions = [
        { value: "전체" as const, label: "전체" },
        { value: "재직" as const, label: "재직" },
        { value: "단기" as const, label: "단기" },
        { value: "퇴사" as const, label: "퇴사" },
    ];

    // 근무상태 필터 옵션
    const workStatusOptions = [
        { value: "전체" as const, label: "전체" },
        { value: "출근" as const, label: "출근" },
        { value: "휴무" as const, label: "휴무" },
        { value: "대타" as const, label: "대타" },
        { value: "지각" as const, label: "지각" },
        { value: "결근" as const, label: "결근" },
        { value: "퇴근" as const, label: "퇴근" },
    ];

    return (
        <div className="p-10">
            <ListPageHeader
                filters={[
                    {
                        label: "고용상태",
                        value: employmentFilter,
                        options: employmentOptions,
                        onChange: (value) => handleEmploymentFilterChange(value as AlbaStatus | "전체"),
                        placeholder: "고용상태 선택",
                    },
                    {
                        label: "근무상태",
                        value: workStatusFilter,
                        options: workStatusOptions,
                        onChange: (value) => handleWorkStatusFilterChange(value as WorkStatus | "전체"),
                        placeholder: "근무상태 선택",
                    },
                ]}
                searchLabel="검색"
                searchValue={searchValue}
                onSearchChange={handleSearchChange}
                searchPlaceholder="이름으로 검색"
            />

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead className="w-[100px] font-semibold text-center">고용</TableHead>
                            <TableHead className="w-[100px] font-semibold text-center">근무</TableHead>
                            <TableHead className="font-semibold text-center">이름</TableHead>
                            <TableHead className="font-semibold text-center">근무일</TableHead>
                            <TableHead className="font-semibold text-center">연락처</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedAlbaList.map((alba) => (
                            <AlbaTooltip key={alba.albaId} alba={alba}>
                                <TableRow onClick={() => handleRowClick(alba)} className="cursor-pointer hover:bg-gray-50">
                                    <TableCell className="py-4 text-center">
                                        <StatusBadge type="employment" status={alba.albaStatus} />
                                    </TableCell>
                                    <TableCell className="py-4 text-center">
                                        {alba.albaStatus !== "퇴사" && alba.workStatus && (
                                            <StatusBadge
                                                type="work"
                                                status={alba.workStatus}
                                                clickable
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // TODO: 근무상태 변경 모달 또는 드롭다운
                                                }}
                                            />
                                        )}
                                        {alba.albaStatus === "퇴사" && <span className="text-xs text-gray-400">-</span>}
                                    </TableCell>
                                    <TableCell className="py-4 font-medium text-center tooltip-anchor">{alba.albaName}</TableCell>
                                    <TableCell className="py-4">
                                        <div className="flex gap-1 justify-center">
                                            {SCHEDULE_DAYS.map((day) => (
                                                <div
                                                    key={day}
                                                    className={`flex items-center justify-center w-6 h-6 text-xs border rounded ${
                                                        alba.workDays.includes(day)
                                                            ? "bg-black text-white border-black"
                                                            : "bg-white text-gray-400 border-gray-200"
                                                    }`}
                                                >
                                                    {day}
                                                </div>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4 text-center">{alba.albaPhone}</TableCell>
                                </TableRow>
                            </AlbaTooltip>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <ListPageFooter
                currentPage={validCurrentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                actionButton={{
                    label: "알바 추가",
                    onClick: () => setIsModalOpen(true),
                    variant: "outline",
                }}
            />

            <AlbaFormModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleAlbaSave} storeName="자초단" />
            <AlbaFormModal
                open={isEditModalOpen}
                onClose={handleEditModalClose}
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
            <AlbaDetailModal open={isDetailModalOpen} alba={selectedAlba} onClose={handleDetailModalClose} onEdit={handleEditAlba} />
        </div>
    );
}
