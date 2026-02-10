import { api } from "./client";
import type {
    GetItemsParams,
    ItemListResponse,
    CreateItemRequest,
    CreateItemResponse,
    ItemDetailResponse,
    UpdateItemRequest,
    StockInOutRequest,
    StockInOutResponse,
    StockAdjustRequest,
    StockAdjustResponse,
} from "@/types/item";

// 임시 storeId (추후 실제 로그인 사용자의 storeId로 교체)
const DEFAULT_STORE_ID = 1;

/**
 * 아이템 목록 조회
 * GET /stores/{storeId}/items
 */
export async function getItems(params: Partial<GetItemsParams> = {}) {
    const storeId = params.storeId ?? DEFAULT_STORE_ID;
    const queryParams = new URLSearchParams();

    if (params.excludeZero) queryParams.append("excludeZero", "true");
    if (params.filter) queryParams.append("filter", params.filter);
    if (params.keyword) queryParams.append("keyword", params.keyword);
    if (params.page !== undefined)
        queryParams.append("page", String(params.page));
    if (params.size !== undefined)
        queryParams.append("size", String(params.size));

    const queryString = queryParams.toString();
    const endpoint = `/stores/${storeId}/items${queryString ? `?${queryString}` : ""}`;

    return api.get<ItemListResponse>(endpoint);
}

/**
 * 아이템 생성
 * POST /stores/{storeId}/items
 */
export async function createItem(
    data: CreateItemRequest,
    storeId: number = DEFAULT_STORE_ID
) {
    return api.post<CreateItemResponse>(`/stores/${storeId}/items`, data);
}

/**
 * 아이템 상세 조회
 * GET /stores/{storeId}/items/{itemId}
 */
export async function getItemDetail(
    itemId: number,
    storeId: number = DEFAULT_STORE_ID
) {
    return api.get<ItemDetailResponse>(`/stores/${storeId}/items/${itemId}`);
}

/**
 * 아이템 수정
 * PUT /stores/{storeId}/items/{itemId}
 */
export async function updateItem(
    itemId: number,
    data: UpdateItemRequest,
    storeId: number = DEFAULT_STORE_ID
) {
    return api.put<void>(`/stores/${storeId}/items/${itemId}`, data);
}

/**
 * 아이템 삭제
 * DELETE /stores/{storeId}/items/{itemId}
 */
export async function deleteItem(
    itemId: number,
    storeId: number = DEFAULT_STORE_ID
) {
    return api.delete<void>(`/stores/${storeId}/items/${itemId}`);
}

/**
 * 아이템 즐겨찾기 토글
 * PATCH /stores/{storeId}/items/{itemId}/pin
 */
export async function toggleItemPin(
    itemId: number,
    storeId: number = DEFAULT_STORE_ID
) {
    return api.patch<void>(`/stores/${storeId}/items/${itemId}/pin`);
}

/**
 * 재고 입고 처리
 * POST /stores/{storeId}/items/{itemId}/stock/in
 */
export async function stockIn(
    itemId: number,
    data: StockInOutRequest,
    storeId: number = DEFAULT_STORE_ID
) {
    return api.post<StockInOutResponse>(
        `/stores/${storeId}/items/${itemId}/stock/in`,
        data,
        { asJson: true }
    );
}

/**
 * 재고 출고 처리
 * POST /stores/{storeId}/items/{itemId}/stock/out
 */
export async function stockOut(
    itemId: number,
    data: StockInOutRequest,
    storeId: number = DEFAULT_STORE_ID
) {
    return api.post<StockInOutResponse>(
        `/stores/${storeId}/items/${itemId}/stock/out`,
        data,
        { asJson: true }
    );
}

/**
 * 재고 직접 조정
 * POST /stores/{storeId}/items/{itemId}/stock/adjust
 */
export async function stockAdjust(
    itemId: number,
    data: StockAdjustRequest,
    storeId: number = DEFAULT_STORE_ID
) {
    return api.post<StockAdjustResponse>(
        `/stores/${storeId}/items/${itemId}/stock/adjust`,
        data,
        { asJson: true }
    );
}
