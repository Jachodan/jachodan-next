"use client";

import { useState, useCallback, useEffect } from "react";
import { type RequestType, type RequestStatus, type RequestListItem } from "@/types/item";
import { getRequests, updateRequestStatus } from "@/lib/api";
import { toast } from "sonner";

const PAGE_SIZE = 10;

export function useRequestList() {
    const [typeFilter, setTypeFilter] = useState<RequestType | "ALL">("ALL");
    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [requests, setRequests] = useState<RequestListItem[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRequests = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await getRequests({
                storeId: 1, // TODO: 세션에서 가져올 예정
                page: currentPage,
                size: PAGE_SIZE,
                type: typeFilter === "ALL" ? undefined : typeFilter,
            });

            if (result.data) {
                let filteredContent = result.data.content;

                // API에 검색 파라미터가 없으므로 클라이언트 사이드 필터링
                if (searchValue.trim()) {
                    const query = searchValue.toLowerCase();
                    filteredContent = filteredContent.filter((r) =>
                        r.itemName.toLowerCase().includes(query)
                    );
                }

                setRequests(filteredContent);
                setTotalPages(result.data.totalPages);
            } else {
                setError(result.error || "요청 목록을 불러오는데 실패했습니다.");
            }
        } catch {
            setError("네트워크 오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, typeFilter, searchValue]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const handleTypeFilterChange = (value: RequestType | "ALL") => {
        setTypeFilter(value);
        setCurrentPage(1);
    };

    const handleSearchValueChange = (value: string) => {
        setSearchValue(value);
        setCurrentPage(1);
    };

    // TODO: 요청 수정 API 연결 시 구현
    const handleRequestTypeChange = (_requestId: number, _newType: RequestType) => {
        // updateRequest API 연결 예정
    };

    const handleRequestStatusChange = async (requestId: number, newStatus: RequestStatus) => {
        const result = await updateRequestStatus(requestId, {
            requestStatus: newStatus,
        });

        if (result.error) {
            toast.error("요청 상태 변경에 실패했습니다.");
            return;
        }

        toast.success("요청 상태가 변경되었습니다.");
        fetchRequests();
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
        isLoading,
        error,

        // 핸들러
        handleRequestTypeChange,
        handleRequestStatusChange,
        triggerUpdate: fetchRequests,
    };
}
