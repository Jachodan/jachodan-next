export type AttendanceStatus = "none" | "checkedIn" | "checkedOut";

export interface AttendanceState {
    status: AttendanceStatus;
    startTime: string;
    endTime: string;
}

export interface Employee {
    id: number;
    name: string;
    position?: string;
    profileImage?: string;
}

export interface EmployeeAttendance extends Employee {
    attendance: AttendanceState;
}
