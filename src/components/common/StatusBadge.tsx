"use client";

import type { AlbaStatus } from "@/types/user";
import type { WorkStatus } from "@/types/work";
import { getEmploymentStatusClass, getWorkStatusClass } from "@/types/albaStatus";
import { cn } from "@/lib/utils";

type BadgeType = "employment" | "work";

interface StatusBadgeProps {
    type: BadgeType;
    status: AlbaStatus | WorkStatus;
    size?: "sm" | "md";
    clickable?: boolean;
    onClick?: (e: React.MouseEvent) => void;
    className?: string;
}

const SIZE_CLASSES = {
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
};

export default function StatusBadge({
    type,
    status,
    size = "sm",
    clickable = false,
    onClick,
    className,
}: StatusBadgeProps) {
    const colorClass =
        type === "employment"
            ? getEmploymentStatusClass(status as AlbaStatus, clickable)
            : getWorkStatusClass(status as WorkStatus, clickable);

    const Component = clickable ? "button" : "span";

    return (
        <Component
            className={cn(
                "inline-flex items-center rounded-full font-medium",
                SIZE_CLASSES[size],
                colorClass,
                clickable && "transition-colors cursor-pointer",
                className,
            )}
            onClick={onClick}
        >
            {status}
        </Component>
    );
}
