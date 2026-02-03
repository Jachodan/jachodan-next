import type { AlbaStatus } from "@/types/alba";
import type { WorkStatus } from "@/types/work";
import { cn } from "@/lib/utils";

// 색상 팔레트 정의
type ColorKey = "green" | "blue" | "gray" | "purple" | "yellow" | "red";

const COLOR_VARIANTS: Record<ColorKey, { base: string; hover: string }> = {
    green: { base: "bg-green-100 text-green-800", hover: "hover:bg-green-200" },
    blue: { base: "bg-blue-100 text-blue-800", hover: "hover:bg-blue-200" },
    gray: { base: "bg-gray-100 text-gray-800", hover: "hover:bg-gray-200" },
    purple: { base: "bg-purple-100 text-purple-800", hover: "hover:bg-purple-200" },
    yellow: { base: "bg-yellow-100 text-yellow-800", hover: "hover:bg-yellow-200" },
    red: { base: "bg-red-100 text-red-800", hover: "hover:bg-red-200" },
};

// 상태별 색상 키 매핑
const EMPLOYMENT_COLOR_MAP: Record<AlbaStatus, ColorKey> = {
    재직: "green",
    단기: "blue",
    퇴사: "gray",
};

const WORK_STATUS_COLOR_MAP: Record<WorkStatus, ColorKey> = {
    출근: "blue",
    휴무: "gray",
    대타: "purple",
    지각: "yellow",
    결근: "red",
    퇴근: "green",
};

// 클래스 생성 헬퍼 함수
export const getEmploymentStatusClass = (status: AlbaStatus, withHover = false) => {
    const colorKey = EMPLOYMENT_COLOR_MAP[status];
    const variant = COLOR_VARIANTS[colorKey];
    return cn(variant.base, withHover && variant.hover);
};

export const getWorkStatusClass = (status: WorkStatus, withHover = false) => {
    const colorKey = WORK_STATUS_COLOR_MAP[status];
    const variant = COLOR_VARIANTS[colorKey];
    return cn(variant.base, withHover && variant.hover);
};
