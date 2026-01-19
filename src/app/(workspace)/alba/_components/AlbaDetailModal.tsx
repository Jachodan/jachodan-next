"use client";

import { useState } from "react";
import CommonModal from "@/components/common/CommonModal";
import { Button } from "@/components/ui/button";
import type { WorkStatus } from "@/types/work";
import type { Alba } from "@/lib/mock/alba";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AlbaDetailModalProps {
    open: boolean;
    alba: Alba | null;
    onClose: () => void;
    onEdit?: () => void;
}

const workStatusColors: Record<WorkStatus, { bg: string; text: string; badge: string }> = {
    출근: { bg: "bg-blue-50", text: "text-blue-700", badge: "bg-blue-100 text-blue-800" },
    휴무: { bg: "bg-gray-50", text: "text-gray-700", badge: "bg-gray-100 text-gray-800" },
    대타: { bg: "bg-purple-50", text: "text-purple-700", badge: "bg-purple-100 text-purple-800" },
    지각: { bg: "bg-yellow-50", text: "text-yellow-700", badge: "bg-yellow-100 text-yellow-800" },
    결근: { bg: "bg-red-50", text: "text-red-700", badge: "bg-red-100 text-red-800" },
    퇴근: { bg: "bg-green-50", text: "text-green-700", badge: "bg-green-100 text-green-800" },
};

export default function AlbaDetailModal({ open, alba, onClose, onEdit }: AlbaDetailModalProps) {
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleSlideChange = (direction: "prev" | "next") => {
        if (!alba) return;

        setCurrentSlide((prev) => {
            if (direction === "next") {
                return (prev + 1) % alba.workDays.length;
            } else {
                return prev === 0 ? alba.workDays.length - 1 : prev - 1;
            }
        });
    };

    const getVisibleWorkDays = () => {
        if (!alba || alba.workDays.length === 0) return [];

        const days = [];
        for (let i = 0; i < 3; i++) {
            const index = (currentSlide + i) % alba.workDays.length;
            days.push(alba.workDays[index]);
        }
        return days;
    };

    if (!alba) return null;

    const statusColor = alba.workStatus ? workStatusColors[alba.workStatus] : null;

    return (
        <CommonModal
            open={open}
            onClose={onClose}
            title="알바 정보"
            size="md"
            footer={
                <>
                    {onEdit && (
                        <Button variant="outline" onClick={onEdit}>
                            수정
                        </Button>
                    )}
                    <Button onClick={onClose}>닫기</Button>
                </>
            }
        >
            <div className="space-y-6">
                {/* 상단: 고용상태 (좌) + 근무상태 (우) */}
                <div className="flex items-center justify-end gap-2">
                    {/* 좌측: 고용상태 */}
                    <div>
                        <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                alba.albaStatus === "재직"
                                    ? "bg-green-100 text-green-800"
                                    : alba.albaStatus === "단기"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-800"
                            }`}
                        >
                            {alba.albaStatus}
                        </span>
                    </div>

                    {/* 우측: 근무상태 (퇴사자 제외) */}
                    {alba.albaStatus !== "퇴사" && alba.workStatus && statusColor && (
                        <div>
                            <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColor.badge}`}
                            >
                                {alba.workStatus}
                            </span>
                        </div>
                    )}
                </div>

                {/* 중앙: 프로필 이미지 */}
                <div className="flex justify-center pb-4">
                    <div className="w-48 h-48 bg-muted rounded-full flex items-center justify-center">
                        <span className="text-3xl font-bold text-muted-foreground">{alba.albaName.charAt(0)}</span>
                    </div>
                </div>

                {/* 하단: 정보 영역 */}
                <div className="grid grid-cols-2 gap-6">
                    {/* 좌하단: 이름 + 연락처 */}
                    <div className="space-y-3">
                        <div>
                            <p className="font-semibold text-2xl">{alba.albaName}</p>
                            <p className="text-lg">{alba.albaPhone}</p>
                        </div>
                    </div>

                    {/* 우하단: 근무요일 */}
                    <div className="space-y-2">
                        <p className="font-medium">근무요일</p>

                        {/* 캐러셀: 3개씩 보여주기 */}
                        <div className="relative flex items-center justify-center gap-2">
                            {/* 좌측 화살표 */}
                            {alba.workDays.length > 3 && (
                                <button
                                    onClick={() => handleSlideChange("prev")}
                                    className="bg-white shadow-md rounded-full p-1 hover:bg-gray-100"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                            )}

                            {/* 3개의 근무요일 표시 */}
                            <div className="flex gap-2">
                                {getVisibleWorkDays().map((day, index) => (
                                    <div
                                        key={`${day}-${index}`}
                                        className="flex items-center justify-center w-10 h-10 text-sm border rounded bg-black text-white border-black"
                                    >
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* 우측 화살표 */}
                            {alba.workDays.length > 3 && (
                                <button
                                    onClick={() => handleSlideChange("next")}
                                    className="bg-white shadow-md rounded-full p-1 hover:bg-gray-100"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </CommonModal>
    );
}
