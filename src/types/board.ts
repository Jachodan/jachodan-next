export const BOARD_TYPE = ["공지사항", "자유게시판", "익명게시판"] as const;
export type BoardType = (typeof BOARD_TYPE)[number];

export const BOARD_TYPE_FILTER_OPTIONS = [
    { value: "전체", label: "전체" },
    { value: "공지사항", label: "공지사항" },
    { value: "자유게시판", label: "자유게시판" },
    { value: "익명게시판", label: "익명게시판" },
] as const;

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

export interface BoardFormData {
    title: string;
    content: string;
    writerId?: number;
    boardType: BoardType;
    file?: File;
}