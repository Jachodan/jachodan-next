export const BOARD_TYPE = ["공지사항", "자유게시판", "익명게시판"] as const;
export type BoardType = (typeof BOARD_TYPE)[number];

export interface Board {
    boardId: number;
    imageId?: number;
    boardType: BoardType;
    title: string;
    content?: string;
    writer?: string; // 익명게시판 존재
    isPin: boolean;
    isDel: boolean;
    createdAt: string;
    updatedAt?: string;
}