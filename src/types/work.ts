// 근로기록부
export const WORK_STATUS = ["출근", "휴무", "대타", "지각", "결근", "퇴근"] as const;
export type WorkStatus = (typeof WORK_STATUS)[number];
export interface Work {
    workId: number;
    albaId: number;
    workIn?: string;
    workOut?: string;
    workDate?: string;
    workStatus: WorkStatus;
}

// 근무자 근무요일
export const SCHEDULE_DAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;
export type ScheduleDays = (typeof SCHEDULE_DAYS)[number];

export interface Schedule {
    scheduleId: number;
    albaId: number;
    scheduleDay?: ScheduleDays[];
}