import { useState } from "react";
import { type BoardType } from "@/types/board";

export const useBoardPageFilters = () => {
    const [boardTypeFilter, setBoardTypeFilter] = useState<BoardType | "전체">("전체");
    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const resetPage = () => setCurrentPage(1);

    const handleBoardTypeFilterChange = (value: BoardType | "전체") => {
        setBoardTypeFilter(value);
        resetPage();
    };

    const handleSearchChange = (value: string) => {
        setSearchValue(value);
        resetPage();
    };

    return {
        boardTypeFilter,
        searchValue,
        currentPage,
        setCurrentPage,
        handleBoardTypeFilterChange,
        handleSearchChange,
    };
};
