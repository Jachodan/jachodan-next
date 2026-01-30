import type { BoardType } from "@/types/board";

const BOARD_TYPE_MAP: Record<BoardType, string> = {
    "공지사항": "NOTICE",
    "자유게시판": "BOARD",
    "익명게시판": "GUEST",
};

const BOARD_TYPE_REVERSE_MAP: Record<string, BoardType> = {
    NOTICE: "공지사항",
    BOARD: "자유게시판",
    GUEST: "익명게시판",
};

/** 프론트 타입 → API enum */
export function toBoardApiType(type: BoardType): string {
    return BOARD_TYPE_MAP[type];
}

/** API enum → 프론트 타입 */
export function fromBoardApiType(apiType: string): BoardType {
    return BOARD_TYPE_REVERSE_MAP[apiType] ?? "자유게시판";
}

/** 이미지 ID로 프록시 이미지 URL 생성 */
export function getImageUrl(imageId: number): string {
    return `/api/backend/img/find/${imageId}`;
}
