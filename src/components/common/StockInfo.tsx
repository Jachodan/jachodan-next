import { ItemListItem } from "@/types/item";
import { formatStockAmount } from "@/lib/utils/item";

interface StockInfoProps {
    item: ItemListItem;
}

export default function StockInfo({ item }: StockInfoProps) {
    return <p className="text-sm text-muted-foreground">{formatStockAmount(item.stockAmount)}</p>;
}
