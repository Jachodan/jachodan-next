"use client";

import { useLayout } from "@/components/layouts/provider/LayoutProvider";
import { useEffect } from "react";

export default function DashboardPage() {
    const { setHeaderTitle } = useLayout();

    useEffect(() => {
        setHeaderTitle("대시보드");
    }, [setHeaderTitle]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">대시보드</h1>
            <p className="text-muted-foreground">
                아하 홈페이지이잇
            </p>
        </div>
    );
}
