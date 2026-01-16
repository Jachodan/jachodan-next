"use client";

import { useItemListStore } from "@/stores/itemListStore";
import ListPageHeader from "@/components/common/ListPageHeader";
import { LayoutList, LayoutGrid } from "lucide-react";
import { ViewMode } from "@/types/item";
import { FilterType } from "@/lib/utils/item";

interface ItemListHeaderProps {
    filterType: FilterType;
    setFilterType: (filter: FilterType) => void;
}

export default function ItemListHeader({ filterType, setFilterType }: ItemListHeaderProps) {
    const { searchQuery, setSearchQuery, excludeZero, setExcludeZero, viewMode, setViewMode } = useItemListStore();

    const filterOptions: Array<{ value: FilterType; label: string }> = [
        { value: "all", label: "전체보기" },
        { value: "request", label: "요청사항" },
        { value: "lowStock", label: "재고부족" },
        { value: "favorite", label: "즐겨찾기" },
        { value: "deadStock", label: "악성재고" },
    ];

    const viewModeOptions: Array<{
        mode: ViewMode;
        icon: typeof LayoutList;
        label: string;
    }> = [
        { mode: "list", icon: LayoutList, label: "리스트 보기" },
        { mode: "card", icon: LayoutGrid, label: "카드 보기" },
    ];

    const checkboxOptions = [
        {
            id: "excludeZero",
            label: "0건제외",
            checked: excludeZero,
            onCheckedChange: setExcludeZero,
        },
    ];

    return (
        <ListPageHeader<FilterType, ViewMode>
            filterLabel="필터"
            filterValue={filterType}
            filterOptions={filterOptions}
            onFilterChange={setFilterType}
            filterPlaceholder="상품필터"
            searchLabel="검색"
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="상품명 검색"
            checkboxOptions={checkboxOptions}
            viewMode={viewMode}
            viewModeOptions={viewModeOptions}
            onViewModeChange={setViewMode}
        />
    );
}
