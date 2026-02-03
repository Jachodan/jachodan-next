"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import CommonModal from "@/components/common/CommonModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { type BoardFormData, type BoardType, BOARD_TYPE } from "@/types/board";
import { getImageUrl } from "@/lib/utils/board";

interface BoardFormModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: BoardFormData) => void;
    mode?: "create" | "edit";
    initialData?: (Partial<BoardFormData> & { imageId?: number }) | null;
    defaultBoardType?: BoardType;
}

export default function BoardFormModal({
    open,
    onClose,
    onSave,
    mode = "create",
    initialData,
    defaultBoardType = "자유게시판",
}: BoardFormModalProps) {
    const [formData, setFormData] = useState<BoardFormData>({
        title: "",
        content: "",
        boardType: defaultBoardType,
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isEditMode = mode === "edit";

    useEffect(() => {
        if (open && initialData) {
            setFormData({
                title: initialData.title ?? "",
                content: initialData.content ?? "",
                boardType: initialData.boardType ?? defaultBoardType,
                writerId: initialData.writerId,
            });
            if (initialData.imageId) {
                setImagePreview(getImageUrl(initialData.imageId));
            } else {
                setImagePreview(null);
            }
        } else if (open && !initialData) {
            setFormData({
                title: "",
                content: "",
                boardType: defaultBoardType,
            });
            setImagePreview(null);
        }
    }, [open, initialData, defaultBoardType]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData((prev) => ({ ...prev, file }));
            setFileName(file.name);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setFormData((prev) => ({ ...prev, file: undefined }));
        setImagePreview(null);
        setFileName(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSave = () => {
        onSave(formData);
        toast.success(isEditMode ? "게시글이 수정되었습니다." : "게시글이 등록되었습니다.");
        handleClose();
    };

    const handleClose = () => {
        setFormData({
            title: "",
            content: "",
            boardType: defaultBoardType,
        });
        setImagePreview(null);
        setFileName(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        onClose();
    };

    return (
        <CommonModal
                open={open}
                onClose={handleClose}
                title={isEditMode ? "게시글 수정" : "게시글 작성"}
                size="lg"
                footer={
                    <>
                        <Button variant="outline" onClick={handleClose}>
                            취소
                        </Button>
                        <Button onClick={handleSave} disabled={!formData.title || !formData.content}>
                            {isEditMode ? "저장" : "등록"}
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    {!isEditMode && (
                        <div className="space-y-2">
                            <Label htmlFor="boardType">게시판 분류</Label>
                            <Select
                                value={formData.boardType}
                                onValueChange={(value) =>
                                    setFormData((prev) => ({ ...prev, boardType: value as BoardType }))
                                }
                            >
                                <SelectTrigger id="boardType">
                                    <SelectValue placeholder="분류 선택" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {BOARD_TYPE.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="title">제목</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                            placeholder="제목을 입력하세요"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">내용</Label>
                        <textarea
                            id="content"
                            value={formData.content}
                            onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                            placeholder="내용을 입력하세요"
                            className="w-full min-h-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>이미지 첨부</Label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        {imagePreview ? (
                            <div className="relative rounded-md border border-input overflow-hidden">
                                <div className="relative w-full aspect-video bg-muted">
                                    <Image
                                        src={imagePreview}
                                        alt="미리보기"
                                        fill
                                        unoptimized
                                        className="object-contain"
                                    />
                                </div>
                                <div className="flex items-center justify-between px-3 py-2 bg-muted/50 border-t">
                                    <span className="text-xs text-muted-foreground truncate">
                                        {fileName}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="text-xs text-destructive hover:underline shrink-0 ml-2"
                                    >
                                        삭제
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full rounded-md border border-dashed border-input py-6 flex flex-col items-center gap-1 text-muted-foreground hover:bg-muted/50 transition-colors"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="17 8 12 3 7 8" />
                                    <line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                                <span className="text-sm">클릭하여 이미지를 첨부하세요</span>
                            </button>
                        )}
                    </div>
                </div>
            </CommonModal>
    );
}
