"use client";

import { useState, useCallback } from "react";
import { type RequestType, type RequestStatus } from "@/types/itemRequest";
import { getPaginatedRequests, updateRequest } from "@/lib/mock/itemRequests";

const PAGE_SIZE = 10;

export function useRequestList() {
    const [typeFilter, setTypeFilter] = useState<RequestType | "전체">("전체");
    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [refreshKey, setRefreshKey] = useState(0);

    // refreshKey 변경 시 리렌더링되어 새로운 데이터를 가져옴
    const { data: requests, totalPages } = getPaginatedRequests(currentPage, PAGE_SIZE, typeFilter, searchValue);

    const triggerUpdate = useCallback(() => {
        setRefreshKey((prev) => prev + 1);
    }, []);

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
        triggerUpdate();
    };

    const handleRequestStatusChange = (requestId: number, newStatus: RequestStatus) => {
        updateRequest({ requestId, requestStatus: newStatus });
        triggerUpdate();
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
