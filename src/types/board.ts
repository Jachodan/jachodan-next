export type BoardType = "공지사항" | "자유게시판" | "익명게시판" ;

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