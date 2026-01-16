"use client";

import { useLayout } from "@/components/layouts/provider/LayoutProvider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SCHEDULE_DAYS, type ScheduleDays, type WorkStatus } from "@/types/work";
import { useEffect } from "react";

export default function AlbaPage() {
    const { setHeaderTitle } = useLayout();

    useEffect(() => {
        setHeaderTitle("알바관리");
    }, [setHeaderTitle]);

    // 임시 더미 데이터
    const albaList: Array<{
        albaId: number;
        albaName: string;
        albaStatus: "재직" | "단기" | "퇴사";
        albaPhone: string;
        workDays: ScheduleDays[];
        workStatus?: WorkStatus;
    }> = [
        {
            albaId: 1,
            albaName: "김철수",
            albaStatus: "재직",
            albaPhone: "010-1234-5678",
            workDays: ["월", "화", "수"],
            workStatus: "출근",
        },
        {
            albaId: 2,
            albaName: "김철수",
            albaStatus: "재직",
            albaPhone: "010-1234-5678",
            workDays: ["월", "화", "수"],
            workStatus: "출근",
        },
        {
            albaId: 3,
            albaName: "이영희",
            albaStatus: "단기",
            albaPhone: "010-2345-6789",
            workDays: ["목", "금"],
            workStatus: "휴무",
        },
        {
            albaId: 4,
            albaName: "이영희",
            albaStatus: "단기",
            albaPhone: "010-2345-6789",
            workDays: ["목", "금"],
            workStatus: "휴무",
        },
        {
            albaId: 5,
            albaName: "박민수",
            albaStatus: "퇴사",
            albaPhone: "010-3456-7890",
            workDays: [],
        },
    ];

    return (
        <div className="p-10">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">알바관리</h1>
                <p className="text-sm text-muted-foreground">알바생 정보를 관리할 수 있습니다.</p>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead className="w-[100px] font-semibold text-center">고용</TableHead>
                            <TableHead className="w-[100px] font-semibold text-center">근무</TableHead>
                            <TableHead className="font-semibold text-center">이름</TableHead>
                            <TableHead className="font-semibold text-center">근무일</TableHead>
                            <TableHead className="font-semibold text-center">연락처</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {albaList.map((alba) => (
                            <TableRow key={alba.albaId}>
                                <TableCell className="py-4 text-center">
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
                                <TableCell className="py-4 text-center">
                                    {alba.albaStatus !== "퇴사" && alba.workStatus && (
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                alba.workStatus === "출근"
                                                    ? "bg-blue-100 text-blue-800"
                                                    : alba.workStatus === "휴무"
                                                    ? "bg-gray-100 text-gray-800"
                                                    : alba.workStatus === "대타"
                                                    ? "bg-purple-100 text-purple-800"
                                                    : alba.workStatus === "지각"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : alba.workStatus === "결근"
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-green-100 text-green-800"
                                            }`}
                                        >
                                            {alba.workStatus}
                                        </span>
                                    )}
                                    {alba.albaStatus === "퇴사" && <span className="text-xs text-gray-400">-</span>}
                                </TableCell>
                                <TableCell className="py-4 font-medium text-center">{alba.albaName}</TableCell>
                                <TableCell className="py-4">
                                    <div className="flex gap-1 justify-center">
                                        {SCHEDULE_DAYS.map((day) => (
                                            <div
                                                key={day}
                                                className={`flex items-center justify-center w-6 h-6 text-xs border rounded ${
                                                    alba.workDays.includes(day)
                                                        ? "bg-black text-white border-black"
                                                        : "bg-white text-gray-400 border-gray-200"
                                                }`}
                                            >
                                                {day}
                                            </div>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell className="py-4 text-center">{alba.albaPhone}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
