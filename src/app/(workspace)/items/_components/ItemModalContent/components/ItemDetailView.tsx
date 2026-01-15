import Image from "next/image";
import FavoriteButton from "@/components/common/FavoriteButton";
import { ItemFormData } from "../hooks/useItemForm";
import { ItemWithStock } from "@/types/item";

interface ItemDetailViewProps {
    formData: ItemFormData;
    item: ItemWithStock;
    imagePreview: string | null;
    onToggleFavorite?: () => void;
}

export function ItemDetailView({ formData, item, imagePreview, onToggleFavorite }: ItemDetailViewProps) {
    return (
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
    );
}
