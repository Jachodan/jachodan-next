"use client";

import { useState, useCallback } from "react";
import { type RequestType, type RequestStatus } from "@/types/itemRequest";
import { getPaginatedRequests, updateRequest } from "@/lib/mock/itemRequests";

const PAGE_SIZE = 10;

export function useRequestList() {
    const [typeFilter, setTypeFilter] = useState<RequestType | "전체">("전체");
    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [, forceUpdate] = useState({});

    // 매번 새로운 데이터를 가져옴
    const { data: requests, totalPages } = getPaginatedRequests(currentPage, PAGE_SIZE, typeFilter, searchValue);

    const triggerUpdate = useCallback(() => {
        forceUpdate({});
    }, []);

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
        setTypeFilter,
        searchValue,
        setSearchValue,

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
