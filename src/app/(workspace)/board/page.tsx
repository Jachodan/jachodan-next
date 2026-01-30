"use client";

import { useEffect, useState } from "react";
import { useLayout } from "@/components/layouts/provider/LayoutProvider";
import ListPageFooter from "@/components/common/ListPageFooter";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { type Board, type BoardType, type BoardFormData, BOARD_TYPE_FILTER_OPTIONS } from "@/types/board";
import { useBoardList } from "./_hooks/useBoardList";
import { useBoardPageFilters } from "./_hooks/useBoardPageFilters";
import BoardTable from "./_components/BoardTable";
import BoardDetailModal from "./_components/BoardDetailModal";
import BoardFormModal from "./_components/BoardFormModal";

export default function BoardPage() {
    const { setHeaderTitle } = useLayout();
    const itemsPerPage = 10;

    // 필터 상태 관리
    const {
        boardTypeFilter,
        searchValue,
        currentPage,
        setCurrentPage,
        handleBoardTypeFilterChange,
        handleSearchChange,
    } = useBoardPageFilters();

    // 게시글 리스트 관리 (서버 사이드 페이지네이션)
    const {
        boardList,
        totalPages,
        loading,
        createBoard,
        updateBoard,
        deleteBoard,
        fetchBoardDetail,
    } = useBoardList({
        page: currentPage,
        size: itemsPerPage,
        type: boardTypeFilter,
    });

    // 모달 상태 관리
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);

    useEffect(() => {
        setHeaderTitle("게시판");
    }, [setHeaderTitle]);

    // 모달 핸들러
    const openDetailModal = async (board: Board) => {
        const detail = await fetchBoardDetail(board.boardId);
        setSelectedBoard(detail ?? board);
        setIsDetailModalOpen(true);
    };

    const openEditModal = () => {
        setIsDetailModalOpen(false);
        setIsEditModalOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedBoard) return;
        await deleteBoard(selectedBoard.boardId);
        setIsDetailModalOpen(false);
        setSelectedBoard(null);
    };

    const handleUpdate = async (data: BoardFormData) => {
        if (!selectedBoard) return;
        await updateBoard(selectedBoard.boardId, data);
    };

    const handleCreate = async (data: BoardFormData) => {
        await createBoard(data);
    };

    const closeDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedBoard(null);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedBoard(null);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="p-10">
            <div className="flex items-center justify-between pb-6">
                <div className="flex items-center divide-x divide-border">
                    {BOARD_TYPE_FILTER_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => handleBoardTypeFilterChange(opt.value as BoardType | "전체")}
                            className={`px-4 text-sm transition-colors ${
                                boardTypeFilter === opt.value
                                    ? "text-foreground font-semibold"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
                <div className="relative">
                    <Input
                        placeholder="제목으로 검색"
                        value={searchValue}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-52 pr-8"
                    />
                    {searchValue && (
                        <button
                            onClick={() => handleSearchChange("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            <BoardTable boardList={boardList} onRowClick={openDetailModal} />

            <ListPageFooter
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                actionButton={{
                    label: "글쓰기",
                    onClick: () => setIsCreateModalOpen(true),
                    variant: "outline",
                }}
            />

            <BoardFormModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSave={handleCreate}
            />

            <BoardFormModal
                open={isEditModalOpen}
                onClose={closeEditModal}
                onSave={handleUpdate}
                mode="edit"
                initialData={
                    selectedBoard
                        ? {
                              title: selectedBoard.title,
                              content: selectedBoard.content ?? "",
                              boardType: selectedBoard.boardType,
                              imageId: selectedBoard.imageId,
                          }
                        : null
                }
            />

            <BoardDetailModal
                open={isDetailModalOpen}
                board={selectedBoard}
                onClose={closeDetailModal}
                onEdit={openEditModal}
                onDelete={handleDelete}
            />
        </div>
    );
}
