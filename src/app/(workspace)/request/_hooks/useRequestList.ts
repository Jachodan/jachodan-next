"use client";

import { useState } from "react";
import { type RequestType, type RequestStatus } from "@/types/itemRequest";
import { getPaginatedRequests, updateRequest } from "@/lib/mock/itemRequests";

const PAGE_SIZE = 10;

export function useRequestList() {
    const [typeFilter, setTypeFilter] = useState<RequestType | "전체">("전체");
    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [updateTrigger, setUpdateTrigger] = useState(0);

    // updateTrigger를 사용하여 데이터 변경 시 리렌더링
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ = updateTrigger;
    const { data: requests, totalPages } = getPaginatedRequests(currentPage, PAGE_SIZE, typeFilter, searchValue);

    const handleRequestTypeChange = (requestId: number, newType: RequestType) => {
        updateRequest({ requestId, requestType: newType });
        setUpdateTrigger((prev) => prev + 1);
    };

    const handleRequestStatusChange = (requestId: number, newStatus: RequestStatus) => {
        updateRequest({ requestId, requestStatus: newStatus });
        setUpdateTrigger((prev) => prev + 1);
    };

    const triggerUpdate = () => {
        setUpdateTrigger((prev) => prev + 1);
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
