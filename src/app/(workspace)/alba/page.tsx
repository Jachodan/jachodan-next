"use client";

import { useLayout } from "@/components/layouts/provider/LayoutProvider";
import { useEffect } from "react";

export default function AlbaPage() {
    const { setHeaderTitle } = useLayout();

    useEffect(() => {
        setHeaderTitle("알바 관리");
    }, [setHeaderTitle]);

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold mb-4">알바관리 페이지</h1>
                <p className="text-muted-foreground">알바 관리 기능이 여기에 추가됩니다.</p>
            </div>
        </div>
    );
}
