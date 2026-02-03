"use client";

import { ItemDetailResponse } from "@/types/item";
import { useItemForm } from "./hooks/useItemForm";
import { useImagePreview } from "./hooks/useImagePreview";
import { ItemDetailView } from "./components/ItemDetailView";
import { ItemFormView } from "./components/ItemFormView";
import { ItemDetailActions } from "./components/ItemDetailActions";

export interface ItemFormData {
    itemId?: number;
    itemName: string;
    stockAmount: number;
    bufferAmount?: number;
    imageId?: number;
    imageFile?: File;
}

interface ItemModalContentProps {
    mode: "create" | "detail" | "edit";
    item?: ItemDetailResponse | null;
    onModeChange?: (mode: "detail" | "edit") => void;
    onFormChange: (data: ItemFormData) => void;
    onToggleFavorite?: () => void;
    onDelete?: () => void;
    onSave?: () => void;
}

export default function ItemModalContent({
    mode,
    item,
    onModeChange,
    onFormChange,
    onToggleFavorite,
    onDelete,
}: ItemModalContentProps) {
    const { formData, handleInputChange, handleFileChange } = useItemForm({
        mode,
        item,
        onFormChange,
    });

    const { imagePreview, handleImageChange } = useImagePreview({
        initialImageId: mode !== "create" && item?.imageId ? item.imageId : undefined,
    });

    const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleImageChange(file, handleFileChange);
        }
    };

    return (
        <div className="space-y-4">
            {/* 상세보기 모드 레이아웃 */}
            {mode === "detail" && item ? (
                <>
                    <ItemDetailView
                        formData={formData}
                        item={item}
                        imagePreview={imagePreview}
                        onToggleFavorite={onToggleFavorite}
                    />

                    {/* 마지막 입출고 */}
                    <div className="flex justify-end">
                        <div className="text-xs text-muted-foreground">
                            <p>
                                마지막 {item.lastLogType === "IN" ? "입고" : "출고"}:{" "}
                                {item.lastLogAt ? new Date(item.lastLogAt).toLocaleString("ko-KR") : "정보 없음"}
                            </p>
                        </div>
                    </div>

                    <ItemDetailActions onEdit={() => onModeChange?.("edit")} onDelete={() => onDelete?.()} />
                </>
            ) : (
                <ItemFormView
                    mode={mode === "create" ? "create" : "edit"}
                    formData={formData}
                    imagePreview={imagePreview}
                    onInputChange={handleInputChange}
                    onImageChange={handleImageInputChange}
                />
            )}
        </div>
    );
}
