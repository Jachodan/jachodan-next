import { useState } from "react";
import { type Alba, type AlbaFormData } from "@/types/alba";

export const useAlbaList = (initialList: Alba[]) => {
    const [albaList, setAlbaList] = useState<Alba[]>(initialList);

    const addAlba = (data: AlbaFormData) => {
        const newAlbaId = albaList.length > 0 ? Math.max(...albaList.map((alba) => alba.albaId)) + 1 : 1;

        const newAlba: Alba = {
            albaId: newAlbaId,
            albaName: data.albaName,
            albaStatus: "STAFF",
            albaPhone: data.albaPhone,
            workDays: data.workDays,
            workStatus: "DAYOFF",
        };

        setAlbaList((prev) => [...prev, newAlba]);
    };

    const updateAlba = (targetId: number, data: AlbaFormData) => {
        setAlbaList((prev) =>
            prev.map((alba) => {
                if (alba.albaId !== targetId) return alba;

                const hasWorkDays = data.workDays.length > 0;
                const wasRetired = alba.albaStatus === "RESIGN";

                if (!hasWorkDays) {
                    return {
                        ...alba,
                        albaName: data.albaName,
                        albaPhone: data.albaPhone,
                        workDays: data.workDays,
                        albaStatus: "RESIGN" as const,
                        workStatus: undefined,
                    };
                }

                if (wasRetired && hasWorkDays) {
                    return {
                        ...alba,
                        albaName: data.albaName,
                        albaPhone: data.albaPhone,
                        workDays: data.workDays,
                        albaStatus: "STAFF" as const,
                        workStatus: "DAYOFF" as const,
                    };
                }

                return {
                    ...alba,
                    albaName: data.albaName,
                    albaPhone: data.albaPhone,
                    workDays: data.workDays,
                };
            }),
        );
    };

    return { albaList, addAlba, updateAlba };
};
