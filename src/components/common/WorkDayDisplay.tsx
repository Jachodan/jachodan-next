"use client";

import { SCHEDULE_DAYS, type ScheduleDays } from "@/types/work";
import { cn } from "@/lib/utils";

type DisplayMode = "all" | "selected";

interface WorkDayDisplayProps {
    days: ScheduleDays[];
    mode?: DisplayMode;
    size?: "sm" | "md";
    selectable?: boolean;
    onToggle?: (day: ScheduleDays) => void;
    className?: string;
}

const SIZE_CLASSES = {
    sm: "w-6 h-6 text-xs",
    md: "w-10 h-10 text-sm",
};

export default function WorkDayDisplay({
    days,
    mode = "all",
    size = "sm",
    selectable = false,
    onToggle,
    className,
}: WorkDayDisplayProps) {
    const displayDays = mode === "all" ? SCHEDULE_DAYS : days;

    const isSelected = (day: ScheduleDays) => days.includes(day);

    const handleClick = (day: ScheduleDays) => {
        if (selectable && onToggle) {
            onToggle(day);
        }
    };

    return (
        <div className={cn("flex gap-1", mode === "all" && "justify-center", className)}>
            {displayDays.map((day) => {
                const selected = isSelected(day);
                const Component = selectable ? "button" : "div";

                return (
                    <Component
                        key={day}
                        type={selectable ? "button" : undefined}
                        onClick={selectable ? () => handleClick(day) : undefined}
                        className={cn(
                            "flex items-center justify-center border rounded",
                            SIZE_CLASSES[size],
                            selected
                                ? "bg-black text-white border-black"
                                : "bg-white text-gray-400 border-gray-200",
                            selectable && !selected && "hover:border-gray-400 transition-colors",
                        )}
                    >
                        {day}
                    </Component>
                );
            })}
        </div>
    );
}
