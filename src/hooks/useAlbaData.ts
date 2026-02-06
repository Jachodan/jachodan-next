import { useState, useEffect, useCallback } from "react";
import type { AlbaListItem, AlbaListItemResponse } from "@/types/alba";
import type { ScheduleDays } from "@/types/work";
import { SCHEDULE_DAYS } from "@/types/work";
import { getAlbaList } from "@/lib/api";

interface UseAlbaDataParams {
    storeId?: number;
}

interface UseAlbaDataReturn {
    albaList: AlbaListItem[];
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

/**
 * workDate 문자열을 workDays 배열로 변환
 * 예: "월,화,수" -> ["월", "화", "수"]
 */
function parseWorkDate(workDate: string): ScheduleDays[] {
    if (!workDate) return [];

    return workDate
        .split(",")
        .map((day) => day.trim() as ScheduleDays)
        .filter((day) => SCHEDULE_DAYS.includes(day));
}

/**
 * API 응답을 클라이언트 타입으로 변환
 */
function transformAlbaResponse(response: AlbaListItemResponse): AlbaListItem {
    return {
        ...response,
        workDays: parseWorkDate(response.workDate),
    };
}

/**
 * 알바 목록 데이터 훅
 * GET /alba/list
 */
export function useAlbaData({ storeId }: UseAlbaDataParams = {}): UseAlbaDataReturn {
    const [albaList, setAlbaList] = useState<AlbaListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAlbaList = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await getAlbaList(storeId);

            if (result.data) {
                const transformedData = result.data.map(transformAlbaResponse);
                setAlbaList(transformedData);
            } else {
                setError(result.error || "데이터를 불러오는데 실패했습니다.");
            }
        } catch (err) {
            setError("네트워크 오류가 발생했습니다.");
            console.error("Failed to fetch alba list:", err);
        } finally {
            setIsLoading(false);
        }
    }, [storeId]);

    useEffect(() => {
        fetchAlbaList();
    }, [fetchAlbaList]);

    return {
        albaList,
        isLoading,
        error,
        refetch: fetchAlbaList,
    };
}
