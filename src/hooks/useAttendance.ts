import { SCHEDULE_CONSTANTS } from "@/constants/schedule";
import { mockEmployeeAttendances } from "@/lib/mock/schedule";
import { AttendanceState } from "@/types/schedule";
import { useCallback, useState } from "react";
import { useDateFormat } from "./useDateFormat";
import { usePagination } from "./usePagination";

export function useAttendance() {
    const { formatShortTime } = useDateFormat();
    const [currentPage, setCurrentPage] = useState(1);
    const [cardStates, setCardStates] = useState<AttendanceState[]>(
        mockEmployeeAttendances.map((employee) => employee.attendance)
    );

    const { paginatedItems, totalPages, handlePageChange } = usePagination({
        items: cardStates,
        itemsPerPage: SCHEDULE_CONSTANTS.ITEMS_PER_PAGE,
        currentPage,
        setCurrentPage,
        scrollToTop: false,
    });

    const handleCardClick = useCallback(
        (index: number) => {
            setCardStates((prev) => {
                const newStates = [...prev];
                const currentState = newStates[index];
                const now = new Date();

                if (currentState.status === "none") {
                    newStates[index] = {
                        ...currentState,
                        status: "checkedIn",
                        startTime: formatShortTime(now),
                    };
                } else if (currentState.status === "checkedIn") {
                    newStates[index] = {
                        ...currentState,
                        status: "checkedOut",
                        endTime: formatShortTime(now),
                    };
                }
                return newStates;
            });
        },
        [formatShortTime]
    );

    const getActualIndex = useCallback(
        (index: number) => {
            return (currentPage - 1) * SCHEDULE_CONSTANTS.ITEMS_PER_PAGE + index;
        },
        [currentPage]
    );

    return {
        cardStates,
        paginatedCards: paginatedItems,
        currentPage,
        totalPages,
        handleCardClick,
        handlePageChange,
        getActualIndex,
    };
}
