"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LayoutList, X } from "lucide-react";

export interface FilterOption<T = string> {
    value: T;
    label: string;
}

export interface FilterConfig<T = string> {
    label?: string;
    value: T;
    options: FilterOption<T>[];
    onChange: (value: T) => void;
    placeholder?: string;
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

    // 단일 필터 (하위 호환성을 위해 유지)
    filterLabel?: string;
    filterValue?: FilterType;
    filterOptions?: FilterOption<FilterType>[];
    onFilterChange?: (value: FilterType) => void;
    filterPlaceholder?: string;

    // 다중 필터 (새로운 방식)
    filters?: FilterConfig<FilterType>[];
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

    filters,
    searchLabel = "검색",
    searchValue,
    onSearchChange,
    searchPlaceholder = "검색",
    checkboxOptions,
    viewMode,
    viewModeOptions,
    onViewModeChange,
}: ListPageHeaderProps<FilterType, ViewModeType>) {
    // 다중 필터가 있으면 사용, 없으면 단일 필터 사용 (하위 호환성)
    const filterConfigs: FilterConfig<FilterType>[] = filters || (filterValue !== undefined && filterOptions && onFilterChange
        ? [{
            label: filterLabel,
            value: filterValue,
            options: filterOptions,
            onChange: onFilterChange,
            placeholder: filterPlaceholder,
        }]
        : []);

    return (
        <div className="flex items-center justify-between gap-4 pb-6">
            <div className="flex flex-wrap gap-4">
                {/* 필터들 (단일 또는 다중) */}
                {filterConfigs.map((filter, index) => (
                    <div key={index} className="flex gap-2 items-center">
                        {filter.label && (
                            <label htmlFor={`filter-${index}`} className="whitespace-nowrap">
                                {filter.label}
                            </label>
                        )}
                        <Select
                            value={filter.value as string}
                            onValueChange={(value) => filter.onChange(value as any)}
                        >
                            <SelectTrigger id={`filter-${index}`}>
                                <SelectValue placeholder={filter.placeholder || "선택"} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {filter.options.map((option) => (
                                        <SelectItem key={option.value as string} value={option.value as string}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                ))}


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
                        <Checkbox id={option.id} checked={option.checked} onCheckedChange={option.onCheckedChange} />
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
