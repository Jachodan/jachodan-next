"use client";

import CustomPagination from "@/components/common/CustomPagination";
import { useLayout } from "@/components/layouts/provider/LayoutProvider";
import { Calendar } from "@/components/ui/calendar";
import { SCHEDULE_CONSTANTS } from "@/constants/schedule";
import { mockEmployeeAttendances } from "@/lib/mock/schedule";
import { AttendanceState } from "@/types/schedule";
import { useEffect, useState } from "react";

export default function SchedulePage() {
    const { setHeaderTitle } = useLayout();
    const today = new Date();
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(today);
    const [currentPage, setCurrentPage] = useState(1);
    const [cardStates, setCardStates] = useState<AttendanceState[]>(
        mockEmployeeAttendances.map((employee) => employee.attendance)
    );

    const { ITEMS_PER_PAGE } = SCHEDULE_CONSTANTS;
    const totalPages = Math.ceil(cardStates.length / ITEMS_PER_PAGE);
    const paginatedCards = cardStates.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    useEffect(() => {
        setHeaderTitle("스케줄관리");
    }, [setHeaderTitle]);

    const formatTime = (date: Date) => {
        const timeString = date.toLocaleTimeString("en-US", {
            hour12: true,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
        // "02:33:33 AM" 형식을 "am 02:33:33" 형식으로 변환
        const [time, period] = timeString.split(" ");
        return `${period.toLowerCase()} ${time}`;
    };

    const formatShortTime = (date: Date) => {
        const timeString = date.toLocaleTimeString("en-US", {
            hour12: true,
            hour: "2-digit",
            minute: "2-digit",
        });
        const [time, period] = timeString.split(" ");
        return `${period.toLowerCase()} ${time}`;
    };

    const handleCardClick = (index: number) => {
        setCardStates((prev) => {
            const newStates = [...prev];
            const currentState = newStates[index];
            const now = new Date();

            if (currentState.status === "none") {
                // 출석 처리
                newStates[index] = {
                    ...currentState,
                    status: "checkedIn",
                    startTime: formatShortTime(now),
                };
            } else if (currentState.status === "checkedIn") {
                // 퇴근 처리
                newStates[index] = {
                    ...currentState,
                    status: "checkedOut",
                    endTime: formatShortTime(now),
                };
            }
            return newStates;
        });
    };

    return (
        <div className="flex h-full items-stretch p-10">
            <div className="flex w-full gap-6">
                {/* 왼쪽: 캘린더 영역 */}
                <div className="w-1/2 flex">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        classNames={{
                            caption_label: "text-xl font-semibold",
                            month_caption: "flex items-center justify-center h-12 mb-2",
                        }}
                        className="w-full flex-1 rounded-lg border bg-white p-6 shadow-sm flex flex-col **:data-[slot=calendar]:flex-1 **:data-[slot=calendar]:flex **:data-[slot=calendar]:flex-col [&_.rdp-months]:flex-1 [&_.rdp-month]:h-full [&_.rdp-month]:flex [&_.rdp-month]:flex-col [&_.rdp-month_table]:flex-1 [&_.rdp-tbody]:h-full [&_.rdp-week]:flex-1 [&_.rdp-table]:w-full [&_.rdp-table]:h-full [&_.rdp-table]:flex [&_.rdp-table]:flex-col [&_.rdp-cell]:text-center [&_.rdp-day]:w-full [&_.rdp-day]:h-full [&_.rdp-head_th]:w-full [&_.rdp-head_th]:pb-2 [&_.rdp-head_th]:text-base [&_.rdp-button]:w-full [&_.rdp-button]:h-full [&_.rdp-button]:text-lg"
                    />
                </div>

                {/* 오른쪽: 날짜/시간 및 직원 카드 영역 */}
                <div className="flex w-1/2 flex-col gap-6">
                    {/* 상단: 선택된 날짜와 시간 */}
                    <div className="flex flex-col items-center justify-center gap-2">
                        <div className="text-2xl text-muted-foreground">{formatDate(selectedDate || today)}</div>
                        <div className="text-4xl font-bold">{formatTime(today)}</div>
                    </div>

                    {/* 하단: 직원 카드 그리드 (3x2) */}
                    <div className="rounded-lg border bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold">근무 직원</h2>
                        <div className="grid grid-cols-3 gap-4">
                            {paginatedCards.map((card, index) => {
                                const actualIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
                                return (
                                    <div
                                        key={actualIndex}
                                        onClick={() => handleCardClick(actualIndex)}
                                        className="aspect-4/5 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col cursor-pointer hover:bg-gray-100 transition-colors relative"
                                    >
                                        <div className="flex-1 flex items-center justify-center relative">
                                            {card.status === "checkedIn" && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="bg-transparent text-red-600 px-8 py-4 rounded-full text-2xl font-bold shadow-lg transform rotate-12 border-4 border-red-600">
                                                        출석
                                                    </div>
                                                </div>
                                            )}
                                            {card.status === "checkedOut" && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="bg-transparent text-purple-600 px-8 py-4 rounded-full text-2xl font-bold shadow-lg transform rotate-12 border-4 border-purple-600">
                                                        퇴근
                                                    </div>
                                                </div>
                                            )}
                                            <p className="text-gray-400">직원 카드 {actualIndex + 1}</p>
                                        </div>
                                        <div className="bg-gray-200 px-3 py-2 rounded-b-lg text-center text-sm text-gray-700">
                                            {card.startTime} - {card.endTime}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* 페이지네이션 */}
                        <div className="mt-4 pt-4 border-t">
                            <CustomPagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
