export type LoginType = "KAKAO" | "NAVER" | "GOOGLE" | "EMAIL";
// 가게 계정(사장님)
export interface User {
    userId: number;
    storeId: number;
    imageId?: number;
    userName: string;
    userEmail: string;
    userPhone: string;
    regDate: string;
    loginType: LoginType;
}

// 알바생 정보
export const ALBA_STATUS = ["재직", "단기", "퇴사"] as const;
export type AlbaStatus = (typeof ALBA_STATUS)[number];
export interface Alba {
    albaId: number;
    storeId: number;
    imageId?: number;
    albaName: string;
    albaPhone?: string;
    albaStatus: AlbaStatus;
}