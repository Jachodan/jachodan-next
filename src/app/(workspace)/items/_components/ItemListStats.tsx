import { FilterType } from "@/lib/utils/item";

interface ItemListStatsProps {
    filterType: FilterType;
    filteredCount: number;
    totalCount: number;
    currentPage: number;
    totalPages: number;
}

export default function ItemListStats({
    filterType,
    filteredCount,
    totalCount,
    currentPage,
    totalPages,
}: ItemListStatsProps) {
    return (
        <div className="flex items-center justify-between py-2">
            <p className="text-sm text-muted-foreground">
                {filterType === "all" ? "전체" : "필터링된"} {filteredCount}개 상품
                {filteredCount !== totalCount && (
                    <span className="text-muted-foreground/70"> (전체: {totalCount}개)</span>
                )}
            </p>
            {totalPages > 0 && (
                <p className="text-sm text-muted-foreground">
                    {currentPage} / {totalPages} 페이지
                </p>
            )}
        </div>
    );
}
