import type { Alba as AlbaBase, AlbaStatus } from "@/types/user";
import { ALBA_STATUS, ALBA_STATUS_LABEL } from "@/types/user";
import type { ScheduleDays, WorkStatus } from "@/types/work";
import { WORK_STATUS, WORK_STATUS_LABEL } from "@/types/work";

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
    ...ALBA_STATUS.map((status) => ({ value: status, label: ALBA_STATUS_LABEL[status] })),
];

// 근무상태 필터 옵션
export const WORK_STATUS_FILTER_OPTIONS: FilterOption<WorkStatus | "전체">[] = [
    { value: "전체", label: "전체" },
    ...WORK_STATUS.map((status) => ({ value: status, label: WORK_STATUS_LABEL[status] })),
];

// GET /alba/list - API 원본 응답 아이템
export interface AlbaListItemResponse {
    albaId: number;
    albaName: string;
    albaPhone: string;
    albaStatus: AlbaStatus;
    workDate: string;
    workId: number;
    workStatus: WorkStatus;
}

// 클라이언트에서 사용하는 알바 리스트 아이템 (workDays 변환 포함)
export interface AlbaListItem extends AlbaListItemResponse {
    workDays: ScheduleDays[];
}

// POST /alba/register - 알바 등록 요청
export interface RegisterAlbaRequest {
    albaId?: number;
    albaName: string;
    albaPhone: string;
    albaStatus: string;
    file?: File;
    imageId?: number;
    imagePath?: string;
    originName?: string;
    storeId: number;
    workId?: number;
}

// POST /alba/register - 알바 등록 응답
export interface RegisterAlbaResponse {
    albaId: number;
    albaName: string;
    albaPhone: string;
    albaStatus: string;
    imageId: number;
    imagePath: string;
    originName: string;
    storeId: number;
    workId: number;
}
