import type { Alba as AlbaBase, AlbaStatus } from "@/types/user";
import { ALBA_STATUS } from "@/types/user";
import type { ScheduleDays, WorkStatus } from "@/types/work";
import { WORK_STATUS } from "@/types/work";

// 기본 Alba 타입 재export
export type { AlbaStatus };
export { ALBA_STATUS };

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

// 필터 옵션 타입
interface FilterOption<T> {
    value: T;
    label: string;
}

// 고용상태 필터 옵션
export const EMPLOYMENT_FILTER_OPTIONS: FilterOption<AlbaStatus | "전체">[] = [
    { value: "전체", label: "전체" },
    ...ALBA_STATUS.map((status) => ({ value: status, label: status })),
];

// 근무상태 필터 옵션
export const WORK_STATUS_FILTER_OPTIONS: FilterOption<WorkStatus | "전체">[] = [
    { value: "전체", label: "전체" },
    ...WORK_STATUS.map((status) => ({ value: status, label: status })),
];
