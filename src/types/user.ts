export interface User {
    userId: number;
    storeId: number;
    userName: string;
    userEmail: string;
    userPhone: string;
}

export interface Alba {
    albaId: number;
    storeId: number;
    albaName: string;
    albaPhone?: string;
    albaStatus: string; // 알바 상태 : 퇴사, 단기, 근무..
}

export interface Boss {
    bossId: number;
    storeId: number;
}