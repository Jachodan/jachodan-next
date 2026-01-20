import { AttendanceState, Employee, EmployeeAttendance } from "@/types/schedule";
import { SCHEDULE_CONSTANTS } from "@/constants/schedule";

const sampleEmployeeNames = ["김민수", "이서연", "박지훈", "최유진", "정하늘", "강도윤", "윤서준", "임지우", "한예진", "송민호"];

export const generateMockEmployees = (count: number = 10): Employee[] => {
    return Array.from({ length: count }, (_, index) => ({
        id: index + 1,
        name: sampleEmployeeNames[index % sampleEmployeeNames.length],
        position: index % 3 === 0 ? "매니저" : "알바",
    }));
};

export const generateInitialAttendance = (): AttendanceState => ({
    status: "none",
    startTime: SCHEDULE_CONSTANTS.DEFAULT_START_TIME,
    endTime: SCHEDULE_CONSTANTS.DEFAULT_END_TIME,
});

export const generateMockEmployeeAttendances = (count: number = 10): EmployeeAttendance[] => {
    const employees = generateMockEmployees(count);
    return employees.map((employee) => ({
        ...employee,
        attendance: generateInitialAttendance(),
    }));
};

export const mockEmployees = generateMockEmployees(10);
export const mockEmployeeAttendances = generateMockEmployeeAttendances(10);
