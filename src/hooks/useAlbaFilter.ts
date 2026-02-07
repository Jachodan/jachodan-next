import { useMemo } from "react";
import type { AlbaListItem, AlbaStatus } from "@/types/alba";
import type { WorkStatus } from "@/types/work";

interface UseAlbaFilterParams {
    albaList: AlbaListItem[];
    employmentFilter: AlbaStatus | "전체";
    workStatusFilter: WorkStatus | "전체";
    searchValue: string;
}

export function useAlbaFilter({
    albaList,
    employmentFilter,
    workStatusFilter,
    searchValue,
}: UseAlbaFilterParams) {
    return useMemo(() => {
        return albaList
            .filter((alba) => {
                // 고용상태 필터
                const matchesEmployment = employmentFilter === "전체" || alba.albaStatus === employmentFilter;

                // 근무상태 필터 (퇴사자는 근무상태가 없으므로 필터링 제외)
                const matchesWorkStatus =
                    workStatusFilter === "전체" || alba.albaStatus === "RESIGN" || alba.workStatus === workStatusFilter;

                // 검색어 필터 (이름만)
                const matchesSearch =
                    searchValue === "" || alba.albaName.toLowerCase().includes(searchValue.toLowerCase());

                return matchesEmployment && matchesWorkStatus && matchesSearch;
            })
            .sort((a, b) => {
                // 퇴사자를 마지막으로 정렬
                if (a.albaStatus === "RESIGN" && b.albaStatus !== "RESIGN") return 1;
                if (a.albaStatus !== "RESIGN" && b.albaStatus === "RESIGN") return -1;
                return 0;
            });
    }, [albaList, employmentFilter, workStatusFilter, searchValue]);
}
