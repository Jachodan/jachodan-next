"use client";

import { useState, useCallback, useEffect } from "react";
import { type RequestType, type RequestStatus } from "@/types/itemRequest";
import { getPaginatedRequests, updateRequest } from "@/lib/mock/itemRequests";

const PAGE_SIZE = 10;

export function useRequestList() {
    const [typeFilter, setTypeFilter] = useState<RequestType | "전체">("전체");
    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [, setUpdateKey] = useState(0);

    const triggerUpdate = useCallback(() => {
        setUpdateKey((prev) => prev + 1);
    }, []);

    const { data: requests, totalPages } = getPaginatedRequests(currentPage, PAGE_SIZE, typeFilter, searchValue);

    // 페이지 범위 검증: 필터 적용 후 totalPages가 줄어들면 currentPage 조정
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const handleTypeFilterChange = (value: RequestType | "전체") => {
        setTypeFilter(value);
        setCurrentPage(1);
    };

    const handleSearchValueChange = (value: string) => {
        setSearchValue(value);
        setCurrentPage(1);
    };

    const handleRequestTypeChange = (requestId: number, newType: RequestType) => {
        updateRequest({ requestId, requestType: newType });
    };

    const handleRequestStatusChange = (requestId: number, newStatus: RequestStatus) => {
        updateRequest({ requestId, requestStatus: newStatus });
    };

    return {
        // 필터 상태
        typeFilter,
        setTypeFilter: handleTypeFilterChange,
        searchValue,
        setSearchValue: handleSearchValueChange,

        // 페이지네이션
        currentPage,
        setCurrentPage,
        totalPages,

        // 데이터
        requests,

        // 핸들러
        handleRequestTypeChange,
        handleRequestStatusChange,
        triggerUpdate,
    };
}
