import { ItemWithStock } from "@/types/item";
import { ItemRequest } from "@/types/itemRequest";
import FavoriteButton from "@/components/common/FavoriteButton";
import ItemRequestIndicator from "./ItemRequestIndicator";
import { formatStockInfo } from "@/lib/utils/item";

interface ItemCardViewProps {
    item: ItemWithStock;
    requests: ItemRequest[];
    onToggleFavorite: (itemId: number) => void;
}

const StockInfo = ({ item }: { item: ItemWithStock }) => (
    <p className="text-sm text-muted-foreground">{formatStockInfo(item)}</p>
);

export default function ItemCardView({ item, requests, onToggleFavorite }: ItemCardViewProps) {
    return (
        <div>
            <div className="relative aspect-square bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">
                {item.imageId ? "이미지" : "No Image"}
                <ItemRequestIndicator requests={requests} variant="card" />
            </div>
            <div className="flex items-center justify-between">
                <p className="font-medium text-lg truncate flex-1">{item.itemName}</p>
                <FavoriteButton isPin={item.isPin} onToggle={() => onToggleFavorite(item.itemId)} size={16} />
            </div>
            <StockInfo item={item} />
        </div>
    );
}
