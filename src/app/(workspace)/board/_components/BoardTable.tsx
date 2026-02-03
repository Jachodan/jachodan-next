"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type Board } from "@/types/board";
import { Pin } from "lucide-react";

interface BoardTableProps {
    boardList: Board[];
    onRowClick: (board: Board) => void;
}

function formatDate(dateString: string) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
}

export default function BoardTable({ boardList, onRowClick }: BoardTableProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-50">
                        <TableHead className="w-[100px] font-semibold text-center">분류</TableHead>
                        <TableHead className="font-semibold text-center">제목</TableHead>
                        <TableHead className="w-[100px] font-semibold text-center">작성자</TableHead>
                        <TableHead className="w-[120px] font-semibold text-center">작성일</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {boardList.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                                게시글이 없습니다.
                            </TableCell>
                        </TableRow>
                    )}
                    {boardList.map((board) => (
                        <TableRow
                            key={board.boardId}
                            onClick={() => onRowClick(board)}
                            className="cursor-pointer hover:bg-gray-50"
                        >
                            <TableCell className="py-4 text-center">
                                <span className="text-xs text-muted-foreground">{board.boardType}</span>
                            </TableCell>
                            <TableCell className="py-4">
                                <div className="flex items-center gap-2">
                                    {board.isPin && <Pin className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                                    <span className={board.isPin ? "font-medium" : ""}>{board.title}</span>
                                </div>
                            </TableCell>
                            <TableCell className="py-4 text-center">
                                {board.writer ?? "익명"}
                            </TableCell>
                            <TableCell className="py-4 text-center text-sm text-muted-foreground">
                                {formatDate(board.updatedAt ?? board.createdAt)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
