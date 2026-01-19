"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Alba } from "@/lib/mock/alba";
import type { WorkStatus } from "@/types/work";

interface AlbaTooltipProps {
    alba: Alba;
    children: React.ReactNode;
}

const workStatusColors: Record<WorkStatus, string> = {
    출근: "bg-blue-100 text-blue-800",
    휴무: "bg-gray-100 text-gray-800",
    대타: "bg-purple-100 text-purple-800",
    지각: "bg-yellow-100 text-yellow-800",
    결근: "bg-red-100 text-red-800",
    퇴근: "bg-green-100 text-green-800",
};

export default function AlbaTooltip({ alba, children }: AlbaTooltipProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
            <TooltipContent side="top" sideOffset={5} className="bg-white text-foreground border shadow-lg p-4 w-64">
                <div className="space-y-3">
                    {/* 상태 배지 */}
                    <div className="flex items-center gap-2">
                        <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                alba.albaStatus === "재직"
                                    ? "bg-green-100 text-green-800"
                                    : alba.albaStatus === "단기"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-800"
                            }`}
                        >
                            {alba.albaStatus}
                        </span>
                        {alba.albaStatus !== "퇴사" && alba.workStatus && (
                            <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                    workStatusColors[alba.workStatus]
                                }`}
                            >
                                {alba.workStatus}
                            </span>
                        )}
                    </div>

                    {/* 프로필 */}
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center shrink-0">
                            <span className="text-lg font-bold text-muted-foreground">{alba.albaName.charAt(0)}</span>
                        </div>
                        <div>
                            <p className="font-semibold text-sm">{alba.albaName}</p>
                            {alba.albaPhone && <p className="text-xs text-muted-foreground">{alba.albaPhone}</p>}
                        </div>
                    </div>

                    {/* 근무요일 */}
                    {alba.workDays.length > 0 && (
                        <div>
                            <p className="text-xs text-muted-foreground mb-1">근무요일</p>
                            <div className="flex gap-1">
                                {alba.workDays.map((day) => (
                                    <div
                                        key={day}
                                        className="flex items-center justify-center w-6 h-6 text-xs border rounded bg-black text-white border-black"
                                    >
                                        {day}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </TooltipContent>
        </Tooltip>
    );
}
