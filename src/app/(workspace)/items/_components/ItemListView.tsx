import { ItemListItem } from "@/types/item";
import FavoriteButton from "@/components/common/FavoriteButton";
import StockInfo from "@/components/common/StockInfo";
import StockControl, { StockInOutParams } from "@/components/common/StockControl";
import ItemRequestIndicator from "./ItemRequestIndicator";

interface ItemListViewProps {
    item: ItemListItem;
    onToggleFavorite: (itemId: number) => void;
    onStockInOut: (itemId: number, stockId: number, params: StockInOutParams) => void;
}

export default function ItemListView({ item, onToggleFavorite, onStockInOut }: ItemListViewProps) {
    return (
        <>
            {/* 왼쪽 섹션: 이미지 + 아이템명 */}
            <div className="flex items-center gap-4 flex-1">
                <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground shrink-0">
                    {item.imageId ? "이미지" : "No"}
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{item.itemName}</p>
                        <FavoriteButton isPin={item.isPinned} onToggle={() => onToggleFavorite(item.itemId)} size={18} />
                    </div>
                    <StockInfo item={item} />
                </div>
            </div>

            {/* 중간 섹션: 입고요청 메시지 */}
            <div className="flex-1 flex items-center justify-center">
                <ItemRequestIndicator item={item} variant="list" />
            </div>

            {/* 오른쪽 섹션: 재고 수량 조절 */}
            <div className="flex-1 flex items-center justify-end">
                <StockControl
                    itemName={item.itemName}
                    currentStock={item.stockAmount}
                    onStockInOut={(params) => onStockInOut(item.itemId, item.stockId, params)}
                    variant="list"
                />
            </div>
        </>
    );
}
