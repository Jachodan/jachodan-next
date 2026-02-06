import { api } from "./client";
import type { AlbaListItemResponse, RegisterAlbaRequest, RegisterAlbaResponse } from "@/types/alba";

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

    return api.get<AlbaListItemResponse[]>(endpoint);
}

/**
 * 알바 등록
 * POST /alba/register
 */
export async function registerAlba(data: RegisterAlbaRequest) {
    const queryParams = new URLSearchParams();

    queryParams.append("albaName", data.albaName);
    queryParams.append("albaPhone", data.albaPhone);
    queryParams.append("albaStatus", data.albaStatus);
    queryParams.append("storeId", String(data.storeId));

    if (data.albaId !== undefined) {
        queryParams.append("albaId", String(data.albaId));
    }
    if (data.imageId !== undefined) {
        queryParams.append("imageId", String(data.imageId));
    }
    if (data.imagePath) {
        queryParams.append("imagePath", data.imagePath);
    }
    if (data.originName) {
        queryParams.append("originName", data.originName);
    }
    if (data.workId !== undefined) {
        queryParams.append("workId", String(data.workId));
    }

    const queryString = queryParams.toString();
    const endpoint = `/alba/register?${queryString}`;

    // 파일이 있는 경우 FormData 사용
    if (data.file) {
        const formData = new FormData();
        formData.append("file", data.file);

        return api.postFormData<RegisterAlbaResponse>(endpoint, formData);
    }

    return api.post<RegisterAlbaResponse>(endpoint, {});
}
