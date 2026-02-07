import { ItemListItem } from "@/types/item";
import FavoriteButton from "@/components/common/FavoriteButton";
import StockInfo from "@/components/common/StockInfo";
import StockControl, { StockInOutParams } from "@/components/common/StockControl";
import ItemRequestIndicator from "./ItemRequestIndicator";

interface ItemCardViewProps {
    item: ItemListItem;
    onToggleFavorite: (itemId: number) => void;
    onStockInOut: (itemId: number, stockId: number, params: StockInOutParams) => void;
}

export default function ItemCardView({ item, onToggleFavorite, onStockInOut }: ItemCardViewProps) {
    return (
        <div>
            <div className="relative aspect-square bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">
                {item.imageId ? "이미지" : "No Image"}
                <ItemRequestIndicator item={item} variant="card" />
            </div>
            <div className="flex items-center justify-between pt-2">
                <p className="font-medium text-lg truncate flex-1">{item.itemName}</p>
                <FavoriteButton isPin={item.isPinned} onToggle={() => onToggleFavorite(item.itemId)} size={16} />
            </div>
            <StockInfo item={item} />
            <StockControl
                itemName={item.itemName}
                currentStock={item.stockAmount}
                onStockInOut={(params) => onStockInOut(item.itemId, item.stockId, params)}
                variant="card"
            />
        </div>
    );
}
