import { api } from "./client";
import type { AlbaListItem } from "@/types/alba";

/**
 * 알바 리스트 조회
 * GET /alba/list
 */
export async function getAlbaList(storeId?: number) {
    const queryParams = new URLSearchParams();

    if (storeId !== undefined) {
        queryParams.append("storeId", String(storeId));
    }

    const queryString = queryParams.toString();
    const endpoint = `/alba/list${queryString ? `?${queryString}` : ""}`;

    return api.get<AlbaListItem[]>(endpoint);
}
