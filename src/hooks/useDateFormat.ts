import { useCallback } from "react";

export function useDateFormat() {
    const formatDate = useCallback((date: Date) => {
        return date.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }, []);

    const formatTime = useCallback((date: Date) => {
        const timeString = date.toLocaleTimeString("en-US", {
            hour12: true,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
        // "02:33:33 AM" 형식을 "am 02:33:33" 형식으로 변환
        const [time, period] = timeString.split(" ");
        return `${period.toLowerCase()} ${time}`;
    }, []);

    const formatShortTime = useCallback((date: Date) => {
        const timeString = date.toLocaleTimeString("en-US", {
            hour12: true,
            hour: "2-digit",
            minute: "2-digit",
        });
        const [time, period] = timeString.split(" ");
        return `${period.toLowerCase()} ${time}`;
    }, []);

    return {
        formatDate,
        formatTime,
        formatShortTime,
    };
}
