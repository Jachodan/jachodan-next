export type LoginType = "KAKAO" | "NAVER" | "GOOGLE" | "EMAIL";
export interface User {
    userId: number;
    storeId: number;
    userName: string;
    userEmail: string;
    userPhone: string;
    regDate: string;
    loginType: LoginType;
}

export type AlbaStatus = "재직" | "단기" | "퇴사";
export interface Alba {
    albaId: number;
    storeId: number;
    albaName: string;
    albaPhone?: string;
    albaStatus: AlbaStatus;
}

export interface Boss {
    bossId: number;
    storeId: number;
}