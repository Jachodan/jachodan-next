"use client";

import { useState } from "react";
import { REQUEST_TYPES, REQUEST_STATUS, type RequestType, type RequestStatus } from "@/types/itemRequest";
import {
    RequestTable,
    RequestTableHeader,
    RequestTableBody,
    RequestTableHead,
    RequestTableRow,
    RequestTableCell,
} from "@/components/ui/request-table";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CommonModal from "@/components/common/CommonModal";
import ListPageHeader from "@/components/common/ListPageHeader";
import ListPageFooter from "@/components/common/ListPageFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getPaginatedRequests, mockItemNames, updateRequest, type ItemRequestWithDetails } from "@/lib/mock/itemRequests";

// 상품 목록 (드롭다운용)
const itemOptions = Object.entries(mockItemNames).map(([itemId, itemName]) => ({
    itemId: Number(itemId),
    itemName,
}));

const PAGE_SIZE = 10;

export default function RequestPage() {
    const [typeFilter, setTypeFilter] = useState<RequestType | "전체">("전체");
    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [updateTrigger, setUpdateTrigger] = useState(0);

    // updateTrigger를 사용하여 데이터 변경 시 리렌더링
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ = updateTrigger;
    const { data: requests, totalPages } = getPaginatedRequests(currentPage, PAGE_SIZE, typeFilter, searchValue);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<ItemRequestWithDetails | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editItemId, setEditItemId] = useState<number | null>(null);
    const [editAmount, setEditAmount] = useState<number | undefined>(undefined);

    const handleRowClick = (request: ItemRequestWithDetails) => {
        setSelectedRequest(request);
        setIsModalOpen(true);
        setIsEditMode(false);
    };

    const handleEditClick = () => {
        if (selectedRequest) {
            setEditItemId(selectedRequest.itemId);
            setEditAmount(selectedRequest.requestAmount);
            setIsEditMode(true);
        }
    };

    const handleCancelEdit = () => {
        setIsEditMode(false);
        setEditItemId(null);
        setEditAmount(undefined);
    };

    const handleSaveEdit = () => {
        if (selectedRequest && editItemId) {
            const updated = updateRequest({
                requestId: selectedRequest.requestId,
                itemId: editItemId,
                requestAmount: editAmount,
            });

            if (updated) {
                setSelectedRequest(updated);
            }
            setIsEditMode(false);
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
        setEditItemId(null);
        setEditAmount(undefined);
    };

    const handleRequestTypeChange = (requestId: number, newType: RequestType) => {
        updateRequest({ requestId, requestType: newType });
        setUpdateTrigger((prev) => prev + 1);
    };

    const handleRequestStatusChange = (requestId: number, newStatus: RequestStatus) => {
        updateRequest({ requestId, requestStatus: newStatus });
        setUpdateTrigger((prev) => prev + 1);
    };

    const filterOptions = [
        { value: "전체" as const, label: "전체" },
        ...REQUEST_TYPES.map((type) => ({ value: type, label: type })),
    ];

    return (
        <div className="p-10">
            <ListPageHeader
                filterLabel="요청유형"
                filterValue={typeFilter}
                filterOptions={filterOptions}
                onFilterChange={(value) => setTypeFilter(value as RequestType | "전체")}
                filterPlaceholder="유형 선택"
                searchLabel="검색"
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                searchPlaceholder="상품명 검색"
            />

            <div className="rounded-md border">
                <RequestTable>
                    <RequestTableHeader>
                        <RequestTableRow className="bg-gray-50">
                            <RequestTableHead className="font-semibold text-center">요청유형</RequestTableHead>
                            <RequestTableHead className="font-semibold text-center">상품명</RequestTableHead>
                            <RequestTableHead className="font-semibold text-center">수량</RequestTableHead>
                            <RequestTableHead className="font-semibold text-center">요청일</RequestTableHead>
                            <RequestTableHead className="font-semibold text-center">요청자</RequestTableHead>
                            <RequestTableHead className="font-semibold text-center">확인상태</RequestTableHead>
                        </RequestTableRow>
                    </RequestTableHeader>
                    <RequestTableBody>
                        {requests.map((request) => (
                            <RequestTableRow
                                key={request.requestId}
                                className="hover:bg-gray-50 cursor-pointer"
                                onClick={() => handleRowClick(request)}
                            >
                                <RequestTableCell className="py-4">
                                    <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
                                        <Select
                                            value={request.requestType}
                                            onValueChange={(value) => handleRequestTypeChange(request.requestId, value as RequestType)}
                                        >
                                            <SelectTrigger size="sm" className="w-[123px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {REQUEST_TYPES.map((type) => (
                                                        <SelectItem key={type} value={type}>
                                                            {type}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </RequestTableCell>
                                <RequestTableCell className="py-4 text-center">
                                    <span className="text-sm text-gray-900">{request.itemName}</span>
                                </RequestTableCell>
                                <RequestTableCell className="py-4 text-center">
                                    <span className="text-sm text-gray-900">{request.requestAmount ?? "-"}</span>
                                </RequestTableCell>
                                <RequestTableCell className="py-4 text-center text-sm text-gray-500">
                                    {request.requestDate}
                                </RequestTableCell>
                                <RequestTableCell className="py-4 text-center">
                                    <span className="text-sm text-gray-900">{request.requesterName}</span>
                                </RequestTableCell>
                                <RequestTableCell className="py-4">
                                    <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
                                        <Select
                                            value={request.requestStatus}
                                            onValueChange={(value) => handleRequestStatusChange(request.requestId, value as RequestStatus)}
                                        >
                                            <SelectTrigger size="sm">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {REQUEST_STATUS.map((status) => (
                                                        <SelectItem key={status} value={status}>
                                                            {status}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </RequestTableCell>
                            </RequestTableRow>
                        ))}
                    </RequestTableBody>
                </RequestTable>
            </div>

            <ListPageFooter
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                actionButton={{
                    label: "상품등록",
                    onClick: () => console.log("상품등록 클릭"),
                    variant: "outline",
                }}
            />

            <CommonModal
                open={isModalOpen}
                onClose={handleModalClose}
                title="요청사항"
                footer={
                    isEditMode ? (
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={handleCancelEdit}>
                                취소
                            </Button>
                            <Button onClick={handleSaveEdit}>
                                저장
                            </Button>
                        </div>
                    ) : (
                        <Button onClick={handleEditClick}>
                            수정
                        </Button>
                    )
                }
            >
                {selectedRequest && (
                    <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-2 items-center">
                            <span className="text-sm font-medium text-gray-500">요청 유형</span>
                            <span className="text-sm">{selectedRequest.requestType}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 items-center">
                            <span className="text-sm font-medium text-gray-500">상품명</span>
                            {isEditMode ? (
                                <Select
                                    value={editItemId?.toString()}
                                    onValueChange={(value) => setEditItemId(Number(value))}
                                >
                                    <SelectTrigger size="sm">
                                        <SelectValue placeholder="상품 선택" />
                                    </SelectTrigger>
                                    <SelectContent position="popper" className="max-h-60">
                                        <SelectGroup>
                                            {itemOptions.map((item) => (
                                                <SelectItem key={item.itemId} value={item.itemId.toString()}>
                                                    {item.itemName}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            ) : (
                                <span className="text-sm">{selectedRequest.itemName}</span>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-2 items-center">
                            <span className="text-sm font-medium text-gray-500">수량</span>
                            {isEditMode ? (
                                <Input
                                    type="number"
                                    value={editAmount ?? ""}
                                    onChange={(e) => setEditAmount(e.target.value ? Number(e.target.value) : undefined)}
                                    placeholder="수량 입력"
                                    className="h-8"
                                />
                            ) : (
                                <span className="text-sm">{selectedRequest.requestAmount ?? "-"}</span>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-2 items-center">
                            <span className="text-sm font-medium text-gray-500">요청일</span>
                            <span className="text-sm">{selectedRequest.requestDate}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 items-center">
                            <span className="text-sm font-medium text-gray-500">요청자</span>
                            <span className="text-sm">{selectedRequest.requesterName}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 items-center">
                            <span className="text-sm font-medium text-gray-500">처리 상태</span>
                            <span className="text-sm">{selectedRequest.requestStatus}</span>
                        </div>
                    </div>
                )}
            </CommonModal>
        </div>
    );
}
