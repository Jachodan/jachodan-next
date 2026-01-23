import { useState } from "react";
import { type Alba, type AlbaFormData } from "@/types/alba";

export const useAlbaList = (initialList: Alba[]) => {
    const [albaList, setAlbaList] = useState<Alba[]>(initialList);

    const addAlba = (data: AlbaFormData) => {
        const newAlbaId = albaList.length > 0 ? Math.max(...albaList.map((alba) => alba.albaId)) + 1 : 1;

        const newAlba: Alba = {
            albaId: newAlbaId,
            albaName: data.albaName,
            albaStatus: "재직",
            albaPhone: data.albaPhone,
            workDays: data.workDays,
            workStatus: "휴무",
        };

        setAlbaList((prev) => [...prev, newAlba]);
    };

    const updateAlba = (targetId: number, data: AlbaFormData) => {
        setAlbaList((prev) =>
            prev.map((alba) => {
                if (alba.albaId !== targetId) return alba;

                const hasWorkDays = data.workDays.length > 0;
                const wasRetired = alba.albaStatus === "퇴사";

                if (!hasWorkDays) {
                    return {
                        ...alba,
                        albaName: data.albaName,
                        albaPhone: data.albaPhone,
                        workDays: data.workDays,
                        albaStatus: "퇴사" as const,
                        workStatus: undefined,
                    };
                }

                if (wasRetired && hasWorkDays) {
                    return {
                        ...alba,
                        albaName: data.albaName,
                        albaPhone: data.albaPhone,
                        workDays: data.workDays,
                        albaStatus: "재직" as const,
                        workStatus: "휴무" as const,
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
