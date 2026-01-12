import { ItemWithStock } from "@/types/item";
import { formatStockInfo } from "@/lib/utils/item";

interface StockInfoProps {
    item: ItemWithStock;
}

export default function StockInfo({ item }: StockInfoProps) {
    return <p className="text-sm text-muted-foreground">{formatStockInfo(item)}</p>;
}
