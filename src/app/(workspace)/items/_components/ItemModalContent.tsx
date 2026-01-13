"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ItemWithStock } from "@/types/item";
import { Trash2, Edit } from "lucide-react";
import FavoriteButton from "@/components/common/FavoriteButton";
import { Label } from "@/components/ui/label";
import Image from "next/image";

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
    item?: ItemWithStock | null;
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
    onSave,
}: ItemModalContentProps) {
    // 초기 데이터를 계산
    const getInitialData = (): ItemFormData => {
        if (mode === "create") {
            return {
                itemName: "",
                stockAmount: 0,
                bufferAmount: 0,
            };
        } else if ((mode === "detail" || mode === "edit") && item) {
            return {
                itemId: item.itemId,
                itemName: item.itemName,
                stockAmount: item.stock.stockAmount ?? 0,
                bufferAmount: item.buffer?.bufferAmount ?? 0,
                imageId: item.imageId,
            };
        }
        return {
            itemName: "",
            stockAmount: 0,
            bufferAmount: 0,
        };
    };

    const [formData, setFormData] = useState<ItemFormData>(getInitialData);
    const [imagePreview, setImagePreview] = useState<string | null>(
        mode !== "create" && item?.imageId ? `/api/images/${item.imageId}` : null
    );

    // 부모 컴포넌트에 초기 데이터 전달 (마운트 시 한 번만)
    useEffect(() => {
        onFormChange(formData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const newData = { ...formData, imageFile: file };
            setFormData(newData);
            onFormChange(newData);

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (field: keyof ItemFormData, value: string | number) => {
        const newData = { ...formData, [field]: value };
        setFormData(newData);
        onFormChange(newData);
    };

    return (
        <div className="space-y-4">
            {/* 상세보기 모드 레이아웃 */}
            {mode === "detail" && item ? (
                <>
                    {/* 이미지 */}
                    <div>
                        {imagePreview ? (
                            <div className="relative w-full aspect-square bg-muted rounded-md overflow-hidden">
                                <Image src={imagePreview} alt="상품 이미지" fill className="object-cover" />
                            </div>
                        ) : (
                            <div className="w-full aspect-square bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                                이미지 없음
                            </div>
                        )}
                    </div>

                    {/* 상품명과 즐겨찾기 */}
                    <div className="flex items-center justify-center gap-2">
                        <div className="text-2xl font-bold">{formData.itemName || "-"}</div>
                        <FavoriteButton isPin={item.isPin} onToggle={() => onToggleFavorite?.()} size={24} />
                    </div>

                    {/* 재고 수량 */}
                    <div className="flex items-center justify-center">
                        <p>
                            <span className="text-lg font-semibold">{formData.stockAmount}개</span>
                            <span className="text-sm text-muted-foreground">
                                {" "}
                                / {formData.bufferAmount ?? 0}개 (적정재고)
                            </span>
                        </p>
                    </div>
                </>
            ) : (
                <>
                    {/* 생성/수정 모드 레이아웃 */}
                    {/* 이미지 업로드 및 미리보기 */}
                    <div className="space-y-2">
                        <Label>상품 이미지</Label>
                        <div className="flex flex-col gap-2">
                            {imagePreview ? (
                                <div className="relative w-full aspect-square bg-muted rounded-md overflow-hidden">
                                    <Image src={imagePreview} alt="상품 이미지" fill className="object-cover" />
                                </div>
                            ) : (
                                <div className="w-full aspect-square bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                                    이미지 없음
                                </div>
                            )}
                            <Input type="file" accept="image/*" onChange={handleImageChange} />
                        </div>
                    </div>

                    {/* 상품명 */}
                    <div className="space-y-2">
                        <Label htmlFor="itemName">상품명</Label>
                        <Input
                            id="itemName"
                            value={formData.itemName}
                            onChange={(e) => handleInputChange("itemName", e.target.value)}
                            placeholder="상품명을 입력하세요"
                        />
                    </div>

                    {/* 재고 수량 */}
                    <div className="space-y-2">
                        <Label htmlFor="stockAmount">재고 수량 {mode === "create" && "(실제재고)"}</Label>
                        <Input
                            id="stockAmount"
                            type="number"
                            min="0"
                            value={formData.stockAmount}
                            onChange={(e) => handleInputChange("stockAmount", Number(e.target.value))}
                            placeholder="재고 수량을 입력하세요"
                        />
                    </div>

                    {/* 적정 수량 (등록 시에는 표시하지 않음) */}
                    {mode !== "create" && (
                        <div className="space-y-2">
                            <Label htmlFor="bufferAmount">적정 수량</Label>
                            <Input
                                id="bufferAmount"
                                type="number"
                                min="0"
                                value={formData.bufferAmount}
                                onChange={(e) => handleInputChange("bufferAmount", Number(e.target.value))}
                                placeholder="적정 수량을 입력하세요"
                            />
                        </div>
                    )}
                </>
            )}

            {/* 마지막 수정일 (상세 모드에서만) */}
            {mode === "detail" && item && (
                <div className="flex justify-end">
                    <div className="text-xs text-muted-foreground">
                        <p>
                            마지막 수정일:{" "}
                            {item.updatedAt ? new Date(item.updatedAt).toLocaleString("ko-KR") : "정보 없음"}
                        </p>
                        {/* TODO: 입고/출고 정보는 StockLog */}
                    </div>
                </div>
            )}

            {/* 버튼들 */}
            {mode === "detail" ? (
                <div className="flex gap-2 pt-4">
                    <Button variant="outline" className="flex-1" onClick={() => onModeChange?.("edit")}>
                        <Edit className="h-4 w-4 mr-2" />
                        수정
                    </Button>
                    <Button variant="destructive" className="flex-1" onClick={onDelete}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        삭제
                    </Button>
                </div>
            ) : (
                <div className="flex gap-2 pt-4">
                    {mode === "edit" && (
                        <Button variant="outline" className="flex-1" onClick={() => onModeChange?.("detail")}>
                            취소
                        </Button>
                    )}
                    <Button className="flex-1" onClick={onSave}>
                        {mode === "create" ? "등록" : "저장"}
                    </Button>
                </div>
            )}
        </div>
    );
}
