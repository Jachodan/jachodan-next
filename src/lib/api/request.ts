import { api } from "./client";
import type { GetRequestsParams, RequestDetailResponse, RequestListResponse } from "@/types/item";

// 임시 storeId (추후 실제 로그인 사용자의 storeId로 교체)
const DEFAULT_STORE_ID = 1;

/**
 * 요청 목록 조회
 * GET /stores/{storeId}/requests
 */
export async function getRequests(params: Partial<GetRequestsParams> = {}) {
    const storeId = params.storeId ?? DEFAULT_STORE_ID;
    const queryParams = new URLSearchParams();

    if (params.page !== undefined)
        queryParams.append("page", String(params.page));
    if (params.size !== undefined)
        queryParams.append("size", String(params.size));
    if (params.requestStatus)
        queryParams.append("requestStatus", params.requestStatus);
    if (params.type) queryParams.append("type", params.type);

    const queryString = queryParams.toString();
    const endpoint = `/stores/${storeId}/requests${queryString ? `?${queryString}` : ""}`;

    return api.get<RequestListResponse>(endpoint);
}

/**
 * 요청 상세 조회
 * GET /stores/{storeId}/requests/{requestId}
 */
export async function getRequestDetail(
    requestId: number,
    storeId: number = DEFAULT_STORE_ID
) {
    return api.get<RequestDetailResponse>(
        `/stores/${storeId}/requests/${requestId}`
    );
}
