import { Work, SCHEDULE_DAYS } from "@/types/work";
import { Alba } from "@/types/user";

const sampleAlbaNames = ["김민수", "이서연", "박지훈", "최유진", "정하늘"];

export const generateMockAlbas = (count: number = 5, storeId: number = 1): Alba[] => {
    return Array.from({ length: count }, (_, index) => ({
        albaId: index + 1,
        storeId,
        albaName: sampleAlbaNames[index % sampleAlbaNames.length],
        albaPhone: `010-${String(Math.floor(Math.random() * 9000) + 1000)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        albaStatus: "재직" as const,
        createdAt: new Date().toISOString(),
        isActive: true,
    }));
};

export const generateMockWorks = (albas: Alba[], weekStartDate?: Date): Work[] => {
    const works: Work[] = [];
    const startDate = weekStartDate || getWeekStartDate(new Date());

    albas.forEach((alba) => {
        SCHEDULE_DAYS.forEach((_, dayIndex) => {
            const workDate = new Date(startDate);
            workDate.setDate(startDate.getDate() + dayIndex);

            const isWorkDay = Math.random() > 0.3;
            const today = new Date();
            const isPast = workDate <= today;

            if (isWorkDay && isPast) {
                const status = Math.random() > 0.1 ? "출근" : "지각";

                works.push({
                    workId: works.length + 1,
                    albaId: alba.albaId,
                    workDate: workDate.toISOString().split("T")[0],
                    workIn: `${8 + Math.floor(Math.random() * 2)}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
                    workOut: status === "출근" ? `${17 + Math.floor(Math.random() * 2)}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}` : undefined,
                    workStatus: status,
                });
            } else if (!isWorkDay && isPast) {
                works.push({
                    workId: works.length + 1,
                    albaId: alba.albaId,
                    workDate: workDate.toISOString().split("T")[0],
                    workStatus: "휴무",
                });
            }
        });
    });

    return works;
};

function getWeekStartDate(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - day);
    d.setHours(0, 0, 0, 0);
    return d;
}

export const mockAlbas = generateMockAlbas(5, 1);
export const mockWorks = generateMockWorks(mockAlbas);
