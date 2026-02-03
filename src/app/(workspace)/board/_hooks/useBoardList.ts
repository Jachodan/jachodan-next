import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { type Board, type BoardFormData, type BoardType } from "@/types/board";
import { toBoardApiType, fromBoardApiType } from "@/lib/utils/board";

interface BoardListResponse {
    content: Board[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

interface UseBoardListParams {
    page: number;
    size: number;
    type?: BoardType | "전체";
}

export const useBoardList = ({ page, size, type }: UseBoardListParams) => {
    const { data: session } = useSession();
    const storeId = session?.storeId ?? 1;

    const [boardList, setBoardList] = useState<Board[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchBoards = useCallback(async () => {
        if (!storeId) return;

        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: String(page),
                size: String(size),
            });

            if (type && type !== "전체") {
                params.set("type", toBoardApiType(type));
            }

            const res = await fetch(
                `/api/backend/stores/${storeId}/boards?${params.toString()}`
            );

            if (!res.ok) throw new Error("게시글 목록 조회 실패");

            const data: BoardListResponse = await res.json();

            // API 응답의 boardType을 프론트 타입으로 변환
            const boards = data.content.map((board) => ({
                ...board,
                boardType: fromBoardApiType(board.boardType as unknown as string),
            }));

            setBoardList(boards);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
        } catch (error) {
            console.error("게시글 목록 조회 에러:", error);
        } finally {
            setLoading(false);
        }
    }, [storeId, page, size, type]);

    useEffect(() => {
        fetchBoards();
    }, [fetchBoards]);

    const createBoard = async (data: BoardFormData) => {
        if (!storeId) return;

        try {
            const apiType = toBoardApiType(data.boardType);
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("content", data.content);
            if (data.writerId) {
                formData.append("writerId", String(data.writerId));
            }
            if (data.file) {
                formData.append("file", data.file);
            }

            const res = await fetch(
                `/api/backend/stores/${storeId}/boards?type=${apiType}`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!res.ok) throw new Error("게시글 등록 실패");

            await fetchBoards();
        } catch (error) {
            console.error("게시글 등록 에러:", error);
        }
    };

    const updateBoard = async (boardId: number, data: BoardFormData) => {
        if (!storeId) return;

        try {
            const res = await fetch(
                `/api/backend/stores/${storeId}/boards/${boardId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title: data.title,
                        content: data.content,
                        writerId: data.writerId,
                    }),
                }
            );

            if (!res.ok) throw new Error("게시글 수정 실패");

            await fetchBoards();
        } catch (error) {
            console.error("게시글 수정 에러:", error);
        }
    };

    const deleteBoard = async (boardId: number) => {
        if (!storeId) return;

        try {
            const res = await fetch(
                `/api/backend/stores/${storeId}/boards/${boardId}`,
                { method: "DELETE" }
            );

            if (!res.ok) throw new Error("게시글 삭제 실패");

            await fetchBoards();
        } catch (error) {
            console.error("게시글 삭제 에러:", error);
        }
    };

    const fetchBoardDetail = async (boardId: number): Promise<Board | null> => {
        if (!storeId) return null;

        try {
            const res = await fetch(
                `/api/backend/stores/${storeId}/boards/${boardId}`
            );

            if (!res.ok) throw new Error("게시글 상세 조회 실패");

            const data = await res.json();
            return {
                ...data,
                boardType: fromBoardApiType(data.boardType as unknown as string),
            };
        } catch (error) {
            console.error("게시글 상세 조회 에러:", error);
            return null;
        }
    };

    return {
        boardList,
        totalPages,
        totalElements,
        loading,
        createBoard,
        updateBoard,
        deleteBoard,
        fetchBoardDetail,
        refetch: fetchBoards,
    };
};
