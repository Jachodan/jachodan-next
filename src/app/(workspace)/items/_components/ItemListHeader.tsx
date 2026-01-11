"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useItemListStore } from "@/stores/itemListStore";
import { LayoutList, LayoutGrid, X } from "lucide-react";

export default function ItemListHeader() {
    const {
        filterType,
        setFilterType,
        searchQuery,
        setSearchQuery,
        excludeZero,
        setExcludeZero,
        viewMode,
        setViewMode,
    } = useItemListStore();

    return (
        <div className="flex item-center justify-between gap-4 pb-6">
            <div className="flex flex-wrap gap-4">
                <div className="flex gap-2 items-center">
                    <label htmlFor="filter" className="whitespace-nowrap">
                        필터
                    </label>
                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger id="filter">
                            <SelectValue placeholder="상품필터" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="all">전체보기</SelectItem>
                                <SelectItem value="request">요청사항</SelectItem>
                                <SelectItem value="lowStock">재고부족</SelectItem>
                                <SelectItem value="favorite">즐겨찾기</SelectItem>
                                <SelectItem value="deadStock">악성재고</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex gap-2 items-center">
                    <label htmlFor="search" className="whitespace-nowrap">
                        검색
                    </label>
                    <div className="relative">
                        <Input
                            id="search"
                            placeholder="상품명 검색"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pr-8"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="검색어 지우기"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
                <div className="flex gap-2 items-center">
                    <Checkbox
                        id="excludeZero"
                        checked={excludeZero}
                        onCheckedChange={setExcludeZero}
                    />
                    <label
                        htmlFor="excludeZero"
                        className="text-sm text-muted-foreground cursor-pointer select-none whitespace-nowrap"
                    >
                        0건제외
                    </label>
                </div>
            </div>

            <div className="flex gap-2">
                <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                    aria-label="리스트 보기"
                    className="shrink-0"
                >
                    <LayoutList className="w-4 h-4" />
                </Button>
                <Button
                    variant={viewMode === "card" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("card")}
                    aria-label="카드 보기"
                    className="shrink-0"
                >
                    <LayoutGrid className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
