// 요청사항 카테고리
export const REQUEST_TYPES = ["입고요청", "발주금지", "폐기요청", "유통기한확인"] as const;
export type RequestType = (typeof REQUEST_TYPES)[number];

// 요청사항 처리 상태
export const REQUEST_STATUS = ["확인중", "대기", "반려", "승인", "완료", "취소"] as const;
export type RequestStatus = (typeof REQUEST_STATUS)[number];

// 요청 게시판
export interface Request {
    requestId: number;
    stockId: number;
    albaId: number;
    imageId?: number;
    requestAmount?: number;
    requestDate: string;
    requestType: RequestType;
    requestStatus: RequestStatus;
    createdAt: string;
    updatedAt?: string;
}