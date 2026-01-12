import { useEffect, useMemo } from "react";

interface UsePaginationParams<T> {
    items: T[];
    itemsPerPage: number;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    scrollToTop?: boolean;
    scrollSelector?: string;
}

interface UsePaginationReturn<T> {
    paginatedItems: T[];
    totalPages: number;
    handlePageChange: (page: number) => void;
}

export function usePagination<T>({
    items,
    itemsPerPage,
    currentPage,
    setCurrentPage,
    scrollToTop = true,
    scrollSelector = "[data-radix-scroll-area-viewport]",
}: UsePaginationParams<T>): UsePaginationReturn<T> {
    const totalPages = Math.ceil(items.length / itemsPerPage);

    const paginatedItems = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return items.slice(startIndex, endIndex);
    }, [items, currentPage, itemsPerPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);

        if (scrollToTop) {
            const scrollContainer = document.querySelector(scrollSelector);
            if (scrollContainer) {
                scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
            }
        }
    };

    // 페이지 범위 초과 시 첫 페이지로 리셋
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        }
    }, [currentPage, totalPages, setCurrentPage]);

    return {
        paginatedItems,
        totalPages,
        handlePageChange,
    };
}
