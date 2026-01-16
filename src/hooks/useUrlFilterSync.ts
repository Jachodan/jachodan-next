"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { useItemListStore } from "@/stores/itemListStore";
import { FilterType, isValidFilterType } from "@/lib/utils/item";

export function useUrlFilterSync() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const { filterType, setFilterType: setStoreFilterType } = useItemListStore();
    const isInitialMount = useRef(true);

    // 마운트 시 URL에서 필터 읽어서 store에 반영
    useEffect(() => {
        if (isInitialMount.current) {
            const urlFilter = searchParams.get("filter");
            if (isValidFilterType(urlFilter) && urlFilter !== filterType) {
                setStoreFilterType(urlFilter);
            }
            isInitialMount.current = false;
        }
    }, [searchParams, filterType, setStoreFilterType]);

    // 필터 변경 시 store 업데이트 + URL 업데이트
    const setFilterType = useCallback(
        (filter: FilterType) => {
            setStoreFilterType(filter);

            const params = new URLSearchParams(searchParams.toString());
            if (filter === "all") {
                params.delete("filter");
            } else {
                params.set("filter", filter);
            }

            const queryString = params.toString();
            const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
            router.replace(newUrl, { scroll: false });
        },
        [searchParams, pathname, router, setStoreFilterType]
    );

    return {
        filterType,
        setFilterType,
    };
}
