"use client";

import { useState } from "react";
import { REQUEST_TYPES, REQUEST_STATUS, type RequestType } from "@/types/itemRequest";
import {
    RequestTable,
    RequestTableHeader,
    RequestTableBody,
    RequestTableHead,
    RequestTableRow,
    RequestTableCell,
} from "@/components/ui/request-table";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ListPageHeader from "@/components/common/ListPageHeader";
import ListPageFooter from "@/components/common/ListPageFooter";

export default function RequestPage() {
    const [typeFilter, setTypeFilter] = useState<RequestType | "전체">("전체");
    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 3; // 임시 값 (실제 데이터 연결 시 itemsPerPage = 8로 계산)

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
                        <RequestTableRow className="hover:bg-gray-50">
                            <RequestTableCell className="py-4">
                                <div className="flex justify-center">
                                    <Select defaultValue="입고요청">
                                        <SelectTrigger size="sm">
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
                                <span className="text-sm text-gray-900">샘플 상품</span>
                            </RequestTableCell>
                            <RequestTableCell className="py-4 text-center">
                                <span className="text-sm text-gray-900">10</span>
                            </RequestTableCell>
                            <RequestTableCell className="py-4 text-center text-sm text-gray-500">
                                2026-01-16
                            </RequestTableCell>
                            <RequestTableCell className="py-4 text-center">
                                <span className="text-sm text-gray-900">홍길동</span>
                            </RequestTableCell>
                            <RequestTableCell className="py-4">
                                <div className="flex justify-center">
                                    <Select defaultValue="대기">
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
        </div>
    );
}
