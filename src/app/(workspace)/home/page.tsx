"use client";

import { useLayout } from "@/components/layouts/provider/LayoutProvider";
import { useEffect } from "react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { NoticeSection } from "./_components/NoticeSection";
import { RequestSection } from "./_components/RequestSection";
import { LowStockAlert } from "./_components/LowStockAlert";
import { FavoriteItems } from "./_components/FavoriteItems";
import { AttendanceSection } from "./_components/AttendanceSection";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
    const { setHeaderTitle } = useLayout();
    const {
        notices,
        pendingRequests,
        lowStockItems,
        favoriteItems,
        works,
        albas,
        isLoading,
    } = useDashboardData();

    useEffect(() => {
        setHeaderTitle("대시보드");
    }, [setHeaderTitle]);

    if (isLoading) {
        return (
            <div className="p-6 space-y-6">
                <Skeleton className="h-20 w-full" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Skeleton className="h-64" />
                    <Skeleton className="h-64" />
                    <Skeleton className="h-64" />
                    <Skeleton className="h-64" />
                </div>
            </div>
        );
    }

    return (
        <div className="px-[120px] py-10 space-y-6">
            {/* 공지 섹션 */}
            <NoticeSection notices={notices} />

            {/* 메인 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 재고 요청 */}
                <RequestSection requests={pendingRequests} />

                {/* 재고부족 알림 */}
                <LowStockAlert items={lowStockItems} />

                {/* 자주쓰는 재고 */}
                <FavoriteItems items={favoriteItems} />

                {/* 알바생 출퇴근 */}
                <AttendanceSection works={works} albas={albas} />
            </div>
        </div>
    );
}
