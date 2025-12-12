export interface Board {
    boardId: number;
    imageId?: number;
    boardType: string;
    title: string;
    content?: string;
    writer: string;
    isPin: boolean;
}