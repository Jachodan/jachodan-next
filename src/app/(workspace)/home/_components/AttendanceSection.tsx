"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Work, SCHEDULE_DAYS } from "@/types/work";
import { Alba } from "@/types/user";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface AttendanceSectionProps {
    works: Work[];
    albas: Alba[];
}

export function AttendanceSection({ works, albas }: AttendanceSectionProps) {
    const today = new Date();
    const todayDayIndex = today.getDay();

    // 오늘 출근한 알바생 수 계산
    const todayDateStr = today.toISOString().split("T")[0];
    const todayWorks = works.filter(
        (w) => w.workDate === todayDateStr && w.workStatus === "출근"
    );

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">알바생 출퇴근</CardTitle>
                    <Link href="/settings" className="text-primary">
                        <ChevronRight className="h-5 w-5" />
                    </Link>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* 요일 헤더 */}
                    <div className="grid grid-cols-7 gap-1 text-center">
                        {SCHEDULE_DAYS.map((day, index) => (
                            <div
                                key={day}
                                className={`text-xs font-medium py-1 ${
                                    index === 0
                                        ? "text-red-500"
                                        : index === 6
                                        ? "text-blue-500"
                                        : "text-muted-foreground"
                                }`}
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* 출퇴근 표시 */}
                    <div className="grid grid-cols-7 gap-1">
                        {SCHEDULE_DAYS.map((_, index) => {
                            const isToday = index === todayDayIndex;
                            const isPast = index < todayDayIndex;

                            return (
                                <div key={index} className="flex justify-center">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                            isToday
                                                ? "bg-primary text-primary-foreground"
                                                : isPast
                                                ? "bg-muted"
                                                : "bg-muted/50"
                                        }`}
                                    >
                                        {isPast && !isToday && (
                                            <span className="text-xs text-muted-foreground">
                                                {Math.floor(Math.random() * 3) + 1}
                                            </span>
                                        )}
                                        {isToday && (
                                            <span className="text-xs">{todayWorks.length}</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* 알바생 목록 (스켈레톤) */}
                    <div className="space-y-2 pt-2">
                        {albas.slice(0, 4).map((alba) => (
                            <div
                                key={alba.albaId}
                                className="h-8 bg-muted/50 rounded animate-pulse"
                            />
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
