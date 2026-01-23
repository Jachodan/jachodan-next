import { useState } from "react";
import { type AlbaStatus } from "@/types/alba";
import { type WorkStatus } from "@/types/work";

export const useAlbaPageFilters = () => {
    const [employmentFilter, setEmploymentFilter] = useState<AlbaStatus | "전체">("전체");
    const [workStatusFilter, setWorkStatusFilter] = useState<WorkStatus | "전체">("전체");
    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const resetPage = () => setCurrentPage(1);

    const handleEmploymentFilterChange = (value: AlbaStatus | "전체") => {
        setEmploymentFilter(value);
        resetPage();
    };

    const handleWorkStatusFilterChange = (value: WorkStatus | "전체") => {
        setWorkStatusFilter(value);
        resetPage();
    };

    const handleSearchChange = (value: string) => {
        setSearchValue(value);
        resetPage();
    };

    return {
        employmentFilter,
        workStatusFilter,
        searchValue,
        currentPage,
        setCurrentPage,
        handleEmploymentFilterChange,
        handleWorkStatusFilterChange,
        handleSearchChange,
    };
};
