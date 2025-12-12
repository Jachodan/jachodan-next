// 근로기록부
export interface Work {
    workId: number;
    albaId: number;
    workIn?: string;
    workOut?: string;
    workDate?: string;
    workStatus: string; // 알바 근태 : 출근, 휴무, 대타, 지각, 결근.. 
}

// 근무자 근무요일
export type ScheduleTime = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

export interface Schedule {
    scheduleId: number;
    albaId: number;
    scheduleTime: ScheduleTime[];
}