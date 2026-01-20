"use client";

import { useLayout } from "@/components/layouts/provider/LayoutProvider";
import { useAttendance } from "@/hooks/useAttendance";
import { useDateFormat } from "@/hooks/useDateFormat";
import { useEffect, useState } from "react";
import DateTimeDisplay from "./_components/DateTimeDisplay";
import EmployeeCardGrid from "./_components/EmployeeCardGrid";
import ScheduleCalendar from "./_components/ScheduleCalendar";

export default function SchedulePage() {
    const { setHeaderTitle } = useLayout();
    const { formatDate, formatTime } = useDateFormat();
    const {
        paginatedCards,
        currentPage,
        totalPages,
        handleCardClick,
        handlePageChange,
        getActualIndex,
    } = useAttendance();

    const today = new Date();
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(today);

    useEffect(() => {
        setHeaderTitle("스케줄관리");
    }, [setHeaderTitle]);

    return (
        <div className="flex h-full items-stretch p-10">
            <div className="flex w-full gap-6">
                {/* 왼쪽: 캘린더 영역 */}
                <ScheduleCalendar selectedDate={selectedDate} onSelect={setSelectedDate} />

                {/* 오른쪽: 날짜/시간 및 직원 카드 영역 */}
                <div className="flex w-1/2 flex-col gap-6">
                    {/* 상단: 선택된 날짜와 시간 */}
                    <DateTimeDisplay
                        date={formatDate(selectedDate || today)}
                        time={formatTime(today)}
                    />

                    {/* 하단: 직원 카드 그리드 */}
                    <EmployeeCardGrid
                        cards={paginatedCards}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onCardClick={handleCardClick}
                        onPageChange={handlePageChange}
                        getActualIndex={getActualIndex}
                    />
                </div>
            </div>
        </div>
    );
}
