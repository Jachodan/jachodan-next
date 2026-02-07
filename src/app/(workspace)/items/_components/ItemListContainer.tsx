import { cn } from "@/lib/utils";
import { FilterType, getItemListEmptyMessage } from "@/lib/utils/item";
import { ItemListItem, ViewMode } from "@/types/item";
import ItemCardView from "./ItemCardView";
import ItemListView from "./ItemListView";
import { StockInOutParams } from "@/components/common/StockControl";

interface ItemListContainerProps {
    items: ItemListItem[];
    viewMode: ViewMode;
    filterType: FilterType;
    searchQuery: string;
    onItemClick: (item: ItemListItem) => void;
    onToggleFavorite: (itemId: number) => void;
    onStockInOut: (itemId: number, stockId: number, params: StockInOutParams) => void;
}

export default function ItemListContainer({
    items,
    viewMode,
    filterType,
    searchQuery,
    onItemClick,
    onToggleFavorite,
    onStockInOut,
}: ItemListContainerProps) {
    return (
        <div
            className={cn(
                "grid gap-4",
                viewMode === "card"
                    ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
                    : "grid-cols-1"
            )}
        >
            {items.length === 0 ? (
                <div
                    className={cn(
                        "text-center py-12 text-muted-foreground",
                        viewMode === "card" && "col-span-full"
                    )}
                >
                    {getItemListEmptyMessage(filterType, searchQuery)}
                </div>
            ) : (
                items.map((item) => (
                    <div
                        key={item.itemId}
                        className={cn(
                            "border rounded-lg p-4 transition-shadow cursor-pointer",
                            viewMode === "card"
                                ? "hover:shadow-md"
                                : "hover:shadow-sm flex items-center gap-4"
                        )}
                        onClick={() => onItemClick(item)}
                    >
                        {viewMode === "card" ? (
                            <ItemCardView
                                item={item}
                                onToggleFavorite={onToggleFavorite}
                                onStockInOut={onStockInOut}
                            />
                        ) : (
                            <ItemListView
                                item={item}
                                onToggleFavorite={onToggleFavorite}
                                onStockInOut={onStockInOut}
                            />
                        )}
                    </div>
                ))
            )}
        </div>
    );
}
