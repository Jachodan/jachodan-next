import { create } from "zustand";
import { ViewMode } from "@/types/item";

// 필터 타입
export type FilterType = "all" | "request" | "lowStock" | "favorite" | "deadStock";

// Store 상태 타입
interface ItemListState {
    // 상태
    filterType: FilterType;
    searchQuery: string;
    excludeZero: boolean;
    viewMode: ViewMode;
    currentPage: number;

    // 액션
    setFilterType: (filter: FilterType) => void;
    setSearchQuery: (query: string) => void;
    setExcludeZero: (exclude: boolean) => void;
    setViewMode: (mode: ViewMode) => void;
    setCurrentPage: (page: number) => void;

    // 유틸리티
    resetFilters: () => void;
    resetToFirstPage: () => void;
}

// 초기 상태
const initialState = {
    filterType: "all" as FilterType,
    searchQuery: "",
    excludeZero: false,
    viewMode: "list" as ViewMode,
    currentPage: 1,
};

// Store 생성
export const useItemListStore = create<ItemListState>((set) => ({
    // 초기 상태
    ...initialState,

    // 액션들
    setFilterType: (filter) => set({ filterType: filter, currentPage: 1 }),

    setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),

    setExcludeZero: (exclude) => set({ excludeZero: exclude, currentPage: 1 }),

    setViewMode: (mode) => set({ viewMode: mode, currentPage: 1 }),

    setCurrentPage: (page) => set({ currentPage: page }),

    // 모든 필터 초기화
    resetFilters: () =>
        set({
            filterType: "all",
            searchQuery: "",
            excludeZero: false,
            currentPage: 1,
        }),

    // 페이지만 1로 리셋
    resetToFirstPage: () => set({ currentPage: 1 }),
}));
