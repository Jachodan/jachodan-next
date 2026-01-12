import { ItemWithStock } from "@/types/item";
import { ItemRequest } from "@/types/itemRequest";
import FavoriteButton from "@/components/common/FavoriteButton";
import StockInfo from "@/components/common/StockInfo";
import StockControl from "@/components/common/StockControl";
import ItemRequestIndicator from "./ItemRequestIndicator";

interface ItemCardViewProps {
    item: ItemWithStock;
    requests: ItemRequest[];
    onToggleFavorite: (itemId: number) => void;
    onStockChange: (itemId: number, newStock: number) => void;
}

export default function ItemCardView({ item, requests, onToggleFavorite, onStockChange }: ItemCardViewProps) {
    return (
        <div>
            <div className="relative aspect-square bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">
                {item.imageId ? "이미지" : "No Image"}
                <ItemRequestIndicator requests={requests} variant="card" />
            </div>
            <div className="flex items-center justify-between pt-2">
                <p className="font-medium text-lg truncate flex-1">{item.itemName}</p>
                <FavoriteButton isPin={item.isPin} onToggle={() => onToggleFavorite(item.itemId)} size={16} />
            </div>
            <StockInfo item={item} />
            <StockControl
                currentStock={item.stock.stockAmount ?? 0}
                onStockChange={(newStock) => onStockChange(item.itemId, newStock)}
                variant="card"
            />
        </div>
    );
}
