// 근로기록부
export const WORK_STATUS = ["ON", "OFF", "DAYOFF", "COVER", "LATE", "NOSHOW"] as const;
export type WorkStatus = (typeof WORK_STATUS)[number];

// 근무 상태 레이블 (한글 표시용)
export const WORK_STATUS_LABEL: Record<WorkStatus, string> = {
    ON: "출근",
    OFF: "퇴근",
    DAYOFF: "휴가",
    COVER: "대타",
    LATE: "지각",
    NOSHOW: "결근",
};
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