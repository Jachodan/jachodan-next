import { ItemWithStock } from "@/types/item";
import { ItemRequest } from "@/types/itemRequest";
import FavoriteButton from "@/components/common/FavoriteButton";
import StockInfo from "@/components/common/StockInfo";
import StockControl from "@/components/common/StockControl";
import ItemRequestIndicator from "./ItemRequestIndicator";

interface ItemListViewProps {
    item: ItemWithStock;
    requests: ItemRequest[];
    onToggleFavorite: (itemId: number) => void;
    onStockChange: (itemId: number, newStock: number) => void;
}

export default function ItemListView({ item, requests, onToggleFavorite, onStockChange }: ItemListViewProps) {
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
                        <FavoriteButton isPin={item.isPin} onToggle={() => onToggleFavorite(item.itemId)} size={18} />
                    </div>
                    <StockInfo item={item} />
                </div>
            </div>

            {/* 중간 섹션: 입고요청 메시지 */}
            <div className="flex-1 flex items-center justify-center">
                <ItemRequestIndicator requests={requests} variant="list" />
            </div>

            {/* 오른쪽 섹션: 재고 수량 조절 */}
            <div className="flex-1 flex items-center justify-end">
                <StockControl
                    itemName={item.itemName}
                    currentStock={item.stock.stockAmount ?? 0}
                    onStockChange={(newStock) => onStockChange(item.itemId, newStock)}
                    variant="list"
                />
            </div>
        </>
    );
}
