// 근로기록부
export type WorkStatus = "출근" | "휴무" | "대타" | "지각" | "결근" ;
export interface Work {
    workId: number;
    albaId: number;
    workIn?: string;
    workOut?: string;
    workDate?: string;
    workStatus: WorkStatus;
}

// 근무자 근무요일
export const SCHEDULE_DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const;
export type ScheduleDays = (typeof SCHEDULE_DAYS)[number];

export interface Schedule {
    scheduleId: number;
    albaId: number;
    scheduleDay: ScheduleDays[];
}