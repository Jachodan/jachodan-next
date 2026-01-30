"use client";

import Image from "next/image";
import CommonModal from "@/components/common/CommonModal";
import { Button } from "@/components/ui/button";
import type { Board } from "@/types/board";
import { getImageUrl } from "@/lib/utils/board";

interface BoardDetailModalProps {
    open: boolean;
    board: Board | null;
    onClose: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

function formatDateTime(dateString: string) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}.${month}.${day} ${hours}:${minutes}`;
}

export default function BoardDetailModal({ open, board, onClose, onEdit, onDelete }: BoardDetailModalProps) {
    if (!board) return null;

    return (
        <CommonModal
            open={open}
            onClose={onClose}
            title={board.title}
            size="lg"
            footer={
                <>
                    {onDelete && (
                        <Button variant="destructive" onClick={onDelete}>
                            삭제
                        </Button>
                    )}
                    {onEdit && (
                        <Button variant="outline" onClick={onEdit}>
                            수정
                        </Button>
                    )}
                    <Button onClick={onClose}>닫기</Button>
                </>
            }
        >
            <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground border-b pb-3">
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{board.boardType}</span>
                    <span>작성자: {board.writer ?? "익명"}</span>
                    <span>{formatDateTime(board.updatedAt ?? board.createdAt)}</span>
                </div>
                <div className="min-h-[120px] whitespace-pre-wrap text-sm leading-relaxed">
                    {board.content || "내용이 없습니다."}
                </div>
                {board.imageId && (
                    <div className="relative w-full aspect-video rounded-md overflow-hidden bg-muted">
                        <Image
                            src={getImageUrl(board.imageId)}
                            alt="첨부 이미지"
                            fill
                            unoptimized
                            className="object-contain"
                        />
                    </div>
                )}
            </div>
        </CommonModal>
    );
}
