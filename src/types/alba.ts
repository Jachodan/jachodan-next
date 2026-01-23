import type { Alba as AlbaBase, AlbaStatus } from "@/types/user";
import type { ScheduleDays, WorkStatus } from "@/types/work";

// 기본 Alba 타입 재export
export type { AlbaStatus };
export { ALBA_STATUS } from "@/types/user";

// 알바 정보 + 근무 정보 (클라이언트에서 사용)
export interface Alba extends Omit<AlbaBase, "storeId" | "imageId" | "createdAt" | "updatedAt" | "isActive" | "albaPhone"> {
    albaPhone: string;
    workDays: ScheduleDays[];
    workStatus?: WorkStatus;
}

// 알바 폼 데이터 (생성/수정용)
export interface AlbaFormData {
    albaName: string;
    albaPhone: string;
    workDays: ScheduleDays[];
    albaEmail: string;
    profileImage?: File;
}
