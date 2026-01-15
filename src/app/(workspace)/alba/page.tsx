"use client";

import { useLayout } from "@/components/layouts/provider/LayoutProvider";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useEffect } from "react";

export default function AlbaPage() {
    const { setHeaderTitle } = useLayout();

    useEffect(() => {
        setHeaderTitle("알바관리");
    }, [setHeaderTitle]);

    // 임시 더미 데이터
    const albaList = [
        {
            albaId: 1,
            albaName: "김철수",
            albaStatus: "재직" as const,
            albaPhone: "010-1234-5678",
            workDays: "월, 화, 수",
        },
        {
            albaId: 2,
            albaName: "이영희",
            albaStatus: "단기" as const,
            albaPhone: "010-2345-6789",
            workDays: "목, 금",
        },
        {
            albaId: 3,
            albaName: "박민수",
            albaStatus: "퇴사" as const,
            albaPhone: "010-3456-7890",
            workDays: "-",
        },
    ];

    return (
        <div className="p-10">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">알바관리</h1>
                <p className="text-sm text-muted-foreground">
                    알바생 정보를 관리할 수 있습니다.
                </p>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">상태</TableHead>
                            <TableHead>이름</TableHead>
                            <TableHead>근무일</TableHead>
                            <TableHead className="text-right">연락처</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {albaList.map((alba) => (
                            <TableRow key={alba.albaId}>
                                <TableCell>
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            alba.albaStatus === "재직"
                                                ? "bg-green-100 text-green-800"
                                                : alba.albaStatus === "단기"
                                                ? "bg-blue-100 text-blue-800"
                                                : "bg-gray-100 text-gray-800"
                                        }`}
                                    >
                                        {alba.albaStatus}
                                    </span>
                                </TableCell>
                                <TableCell className="font-medium">
                                    {alba.albaName}
                                </TableCell>
                                <TableCell>{alba.workDays}</TableCell>
                                <TableCell className="text-right">
                                    {alba.albaPhone}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
