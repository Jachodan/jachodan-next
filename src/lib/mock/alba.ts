import type { AlbaStatus } from "@/types/user";
import type { ScheduleDays, WorkStatus } from "@/types/work";

export interface Alba {
    albaId: number;
    albaName: string;
    albaStatus: AlbaStatus;
    albaPhone: string;
    workDays: ScheduleDays[];
    workStatus?: WorkStatus;
}

const sampleLastNames = ["김", "이", "박", "최", "정", "강", "조", "윤", "장", "임", "한", "오", "신", "전", "홍"];
const sampleFirstNames = [
    "민수",
    "서연",
    "지훈",
    "유진",
    "하늘",
    "민지",
    "서준",
    "채원",
    "지우",
    "수빈",
    "동현",
    "소율",
    "현우",
    "은아",
    "지민",
    "민재",
    "승우",
    "예린",
    "지환",
    "수아",
];

const workDaysPatterns: ScheduleDays[][] = [
    ["월", "화", "수", "목", "금"], // 평일 전체
    ["월", "수", "금"], // 격일
    ["화", "목", "토"], // 격일 2
    ["금", "토", "일"], // 주말 포함
    ["토", "일"], // 주말만
    ["월", "화", "수"], // 주 3일
    ["수", "목", "금", "토"], // 주 4일
    ["월", "화", "목", "금"], // 평일 4일
    ["화", "수", "목", "금", "토"], // 5일 근무
    ["월", "수", "금", "일"], // 주 4일 분산
    ["목", "금", "토", "일"], // 후반부 4일
    ["월", "화", "수", "목", "금", "토"], // 주 6일
    ["일"], // 일요일만
];

export const generateMockAlbaList = (count: number = 20): Alba[] => {
    return Array.from({ length: count }, (_, index) => {
        const albaId = index + 1;
        const lastName = sampleLastNames[index % sampleLastNames.length];
        const firstName = sampleFirstNames[index % sampleFirstNames.length];
        const albaName = `${lastName}${firstName}`;

        // 알바 상태 분포: 재직 60%, 단기 25%, 퇴사 15%
        let albaStatus: AlbaStatus;
        const statusRandom = Math.random();
        if (statusRandom < 0.6) {
            albaStatus = "재직";
        } else if (statusRandom < 0.85) {
            albaStatus = "단기";
        } else {
            albaStatus = "퇴사";
        }

        // 전화번호 생성 (010-XXXX-XXXX)
        const middle = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
        const last = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
        const albaPhone = `010-${middle}-${last}`;

        // 퇴사자는 근무일과 근무상태 없음
        if (albaStatus === "퇴사") {
            return {
                albaId,
                albaName,
                albaStatus,
                albaPhone,
                workDays: [],
            };
        }

        // 근무일 패턴 선택
        const workDays = workDaysPatterns[index % workDaysPatterns.length];

        // 근무상태 분포: 출근 50%, 휴무 20%, 퇴근 15%, 대타 8%, 지각 5%, 결근 2%
        let workStatus: WorkStatus;
        const workStatusRandom = Math.random();
        if (workStatusRandom < 0.5) {
            workStatus = "출근";
        } else if (workStatusRandom < 0.7) {
            workStatus = "휴무";
        } else if (workStatusRandom < 0.85) {
            workStatus = "퇴근";
        } else if (workStatusRandom < 0.93) {
            workStatus = "대타";
        } else if (workStatusRandom < 0.98) {
            workStatus = "지각";
        } else {
            workStatus = "결근";
        }

        return {
            albaId,
            albaName,
            albaStatus,
            albaPhone,
            workDays,
            workStatus,
        };
    });
};

// 기본 목 데이터 (20명)
export const mockAlbaList = generateMockAlbaList(20);
