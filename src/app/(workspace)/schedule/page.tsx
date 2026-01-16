"use client";

import { useLayout } from "@/components/layouts/provider/LayoutProvider";
import { useEffect, useState } from "react";

interface CardState {
    status: "none" | "checkedIn" | "checkedOut";
    startTime: string;
    endTime: string;
}

export default function SchedulePage() {
    const { setHeaderTitle } = useLayout();
    const today = new Date();
    const [cardStates, setCardStates] = useState<CardState[]>(
        Array.from({ length: 6 }).map(() => ({
            status: "none",
            startTime: "00:00",
            endTime: "00:00",
        }))
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
        <div className="flex h-full items-center justify-center p-10">
            <div className="flex w-full gap-6">
                {/* 왼쪽: 캘린더 영역 */}
                <div className="w-1/2">
                    <div className="rounded-lg border bg-white p-4 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold">캘린더</h2>
                        {/* 캘린더 컴포넌트 영역 - 추후 구현 */}
                        <div className="flex h-96 items-center justify-center border-2 border-dashed border-gray-300 rounded">
                            <p className="text-gray-400">캘린더 영역</p>
                        </div>
                    </div>
                </div>

                {/* 오른쪽: 날짜/시간 및 직원 카드 영역 */}
                <div className="flex w-1/2 flex-col gap-6">
                    {/* 상단: 오늘 날짜와 시간 */}
                    <div className="flex flex-col items-center justify-center gap-2">
                        <div className="text-2xl text-muted-foreground">{formatDate(today)}</div>
                        <div className="text-4xl font-bold">{formatTime(today)}</div>
                    </div>

                    {/* 하단: 직원 카드 그리드 (3x2) */}
                    <div className="rounded-lg border bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold">근무 직원</h2>
                        <div className="grid grid-cols-3 gap-4">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleCardClick(index)}
                                    className="aspect-4/5 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col cursor-pointer hover:bg-gray-100 transition-colors relative"
                                >
                                    <div className="flex-1 flex items-center justify-center relative">
                                        {cardStates[index].status === "checkedIn" && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="bg-transparent text-red-600 px-8 py-4 rounded-full text-2xl font-bold shadow-lg transform rotate-12 border-4 border-red-600">
                                                    출석
                                                </div>
                                            </div>
                                        )}
                                        {cardStates[index].status === "checkedOut" && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="bg-transparent text-purple-600 px-8 py-4 rounded-full text-2xl font-bold shadow-lg transform rotate-12 border-4 border-purple-600">
                                                    퇴근
                                                </div>
                                            </div>
                                        )}
                                        <p className="text-gray-400">직원 카드 {index + 1}</p>
                                    </div>
                                    <div className="bg-gray-200 px-3 py-2 rounded-b-lg text-center text-sm text-gray-700">
                                        {cardStates[index].startTime} - {cardStates[index].endTime}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
