"use client";

import StatusBadge from "@/components/common/StatusBadge";
import WorkDayDisplay from "@/components/common/WorkDayDisplay";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type Alba } from "@/types/alba";
import AlbaTooltip from "./AlbaTooltip";

interface AlbaTableProps {
    albaList: Alba[];
    onRowClick: (alba: Alba) => void;
}

export default function AlbaTable({ albaList, onRowClick }: AlbaTableProps) {
    return (
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
                        <AlbaTooltip key={alba.albaId} alba={alba}>
                            <TableRow onClick={() => onRowClick(alba)} className="cursor-pointer hover:bg-gray-50">
                                <TableCell className="py-4 text-center">
                                    <StatusBadge type="employment" status={alba.albaStatus} />
                                </TableCell>
                                <TableCell className="py-4 text-center">
                                    {alba.albaStatus !== "퇴사" && alba.workStatus && (
                                        <StatusBadge type="work" status={alba.workStatus} />
                                    )}
                                    {alba.albaStatus === "퇴사" && <span className="text-xs text-gray-400">-</span>}
                                </TableCell>
                                <TableCell className="py-4 font-medium text-center tooltip-anchor">
                                    {alba.albaName}
                                </TableCell>
                                <TableCell className="py-4">
                                    <WorkDayDisplay days={alba.workDays} mode="all" size="sm" />
                                </TableCell>
                                <TableCell className="py-4 text-center">{alba.albaPhone}</TableCell>
                            </TableRow>
                        </AlbaTooltip>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
