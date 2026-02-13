"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import StatusBadge from "@/components/common/StatusBadge";
import WorkDayDisplay from "@/components/common/WorkDayDisplay";
import type { AlbaListItem } from "@/types/alba";

interface AlbaTooltipProps {
    alba: AlbaListItem;
    children: React.ReactNode;
}

export default function AlbaTooltip({ alba, children }: AlbaTooltipProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
            <TooltipContent side="top" sideOffset={5} className="bg-white text-foreground border shadow-lg p-4 w-64">
                <div className="space-y-3">
                    {/* 상태 배지 */}
                    <div className="flex items-center gap-2">
                        <StatusBadge type="employment" status={alba.albaStatus} />
                        {alba.albaStatus !== "RESIGN" && alba.workStatus && (
                            <StatusBadge type="work" status={alba.workStatus} />
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
                            <WorkDayDisplay days={alba.workDays} mode="selected" size="sm" />
                        </div>
                    )}
                </div>
            </TooltipContent>
        </Tooltip>
    );
}
