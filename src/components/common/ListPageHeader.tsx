"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LayoutList, LayoutGrid, X } from "lucide-react";

export interface FilterOption<T = string> {
    value: T;
    label: string;
}

export interface CheckboxOption {
    id: string;
    label: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
}

export interface ViewModeOption<T = string> {
    mode: T;
    icon: typeof LayoutList;
    label: string;
}

interface ListPageHeaderProps<FilterType = string, ViewModeType = string> {
    // 필터
    filterLabel?: string;
    filterValue: FilterType;
    filterOptions: FilterOption<FilterType>[];
    onFilterChange: (value: FilterType) => void;
    filterPlaceholder?: string;

    // 검색
    searchLabel?: string;
    searchValue: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder?: string;

    // 체크박스 (선택적)
    checkboxOptions?: CheckboxOption[];

    // 뷰 모드 (선택적)
    viewMode?: ViewModeType;
    viewModeOptions?: ViewModeOption<ViewModeType>[];
    onViewModeChange?: (mode: ViewModeType) => void;
}

export default function ListPageHeader<FilterType = string, ViewModeType = string>({
    filterLabel = "필터",
    filterValue,
    filterOptions,
    onFilterChange,
    filterPlaceholder = "필터 선택",
    searchLabel = "검색",
    searchValue,
    onSearchChange,
    searchPlaceholder = "검색",
    checkboxOptions,
    viewMode,
    viewModeOptions,
    onViewModeChange,
}: ListPageHeaderProps<FilterType, ViewModeType>) {
    return (
        <div className="flex item-center justify-between gap-4 pb-6">
            <div className="flex flex-wrap gap-4">
                {/* 필터 Select */}
                <div className="flex gap-2 items-center">
                    <label htmlFor="filter" className="whitespace-nowrap">
                        {filterLabel}
                    </label>
                    <Select
                        value={filterValue as string}
                        onValueChange={(value) => onFilterChange(value as FilterType)}
                    >
                        <SelectTrigger id="filter">
                            <SelectValue placeholder={filterPlaceholder} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {filterOptions.map((option) => (
                                    <SelectItem key={option.value as string} value={option.value as string}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* 검색 Input */}
                <div className="flex gap-2 items-center">
                    <label htmlFor="search" className="whitespace-nowrap">
                        {searchLabel}
                    </label>
                    <div className="relative">
                        <Input
                            id="search"
                            placeholder={searchPlaceholder}
                            value={searchValue}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pr-8"
                        />
                        {searchValue && (
                            <button
                                onClick={() => onSearchChange("")}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="검색어 지우기"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* 체크박스 옵션들 */}
                {checkboxOptions?.map((option) => (
                    <div key={option.id} className="flex gap-2 items-center">
                        <Checkbox
                            id={option.id}
                            checked={option.checked}
                            onCheckedChange={option.onCheckedChange}
                        />
                        <label
                            htmlFor={option.id}
                            className="text-sm text-muted-foreground cursor-pointer select-none whitespace-nowrap"
                        >
                            {option.label}
                        </label>
                    </div>
                ))}
            </div>

            {/* 뷰 모드 버튼 */}
            {viewModeOptions && viewMode !== undefined && onViewModeChange && (
                <div className="flex gap-2">
                    {viewModeOptions.map(({ mode, icon: Icon, label }) => (
                        <Button
                            key={mode as string}
                            variant={viewMode === mode ? "default" : "outline"}
                            size="icon"
                            onClick={() => onViewModeChange(mode)}
                            aria-label={label}
                            className="shrink-0"
                        >
                            <Icon className="w-4 h-4" />
                        </Button>
                    ))}
                </div>
            )}
        </div>
    );
}
