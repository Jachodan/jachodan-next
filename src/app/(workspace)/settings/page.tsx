"use client";

import { useLayout } from "@/components/layouts/provider/LayoutProvider";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function SettingsPage() {
    const { setHeaderTitle } = useLayout();

    useEffect(() => {
        setHeaderTitle("설정");
    }, [setHeaderTitle]);

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold mb-4">설정 페이지</h1>
                <p className="text-muted-foreground">
                    아하 설정 페이지이잇
                </p>
            </div>

            <div className="space-y-2">
                <p className="text-sm font-medium">헤더 타이틀 변경 테스트:</p>
                <div className="flex gap-2">
                    <Button onClick={() => setHeaderTitle("설정")}>
                        설정
                    </Button>
                    <Button variant="outline" onClick={() => setHeaderTitle("프로필 설정")}>
                        프로필 설정
                    </Button>
                    <Button variant="outline" onClick={() => setHeaderTitle("알림 설정")}>
                        알림 설정
                    </Button>
                    <Button variant="secondary" onClick={() => setHeaderTitle("")}>
                        기본값으로 (워크스페이스)
                    </Button>
                </div>
            </div>
        </div>
    );
}
