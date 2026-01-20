export const SCHEDULE_CONSTANTS = {
    ITEMS_PER_PAGE: 6,
    DEFAULT_START_TIME: "00:00",
    DEFAULT_END_TIME: "00:00",
} as const;

export const ATTENDANCE_LABELS = {
    none: "",
    checkedIn: "출석",
    checkedOut: "퇴근",
} as const;

export const ATTENDANCE_COLORS = {
    checkedIn: {
        text: "text-red-600",
        border: "border-red-600",
    },
    checkedOut: {
        text: "text-purple-600",
        border: "border-purple-600",
    },
} as const;
