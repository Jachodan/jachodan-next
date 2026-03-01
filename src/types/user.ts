export type LoginType = "KAKAO" | "NAVER" | "GOOGLE" | "EMAIL";
// 가게 계정(사장님)
export interface User {
    userId: number;
    userName: string;
    userEmail: string;
    userPhone: string;
    createdAt: string;
    updatedAt?: string;
    isActive: boolean;
    loginType: LoginType;
}

// 알바생 정보
export const ALBA_STATUS = ["STAFF", "PART", "RESIGN"] as const;
export type AlbaStatus = (typeof ALBA_STATUS)[number];

// 알바 상태 레이블 (한글 표시용)
export const ALBA_STATUS_LABEL: Record<AlbaStatus, string> = {
    STAFF: "직원",
    PART: "단기",
    RESIGN: "퇴사",
};
export interface Alba {
    albaId: number;
    storeId: number;
    imageId?: number;
    albaName: string;
    albaStatus: AlbaStatus;
    albaPhone?: string;
    createdAt: string;
    updatedAt?: string;
    isActive: boolean;
}
