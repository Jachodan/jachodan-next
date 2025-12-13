export type RequestType = "입고요청" | "발주금지" | "폐기요청" | "유통기한확인";
export type RequestStatus = "확인중" | "대기" | "반려" | "승인" | "완료" ;

export interface Request {
    requestId: number;
    stockId: number;
    albaId: number;
    requestAmount?: number;
    requestDate: string;
    requestType: RequestType;
    requestStatus: RequestStatus;
    createdAt: string;
    updatedAt?: string;
}