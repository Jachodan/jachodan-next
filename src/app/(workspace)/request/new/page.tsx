"use client";

import { useEffect, useState } from "react";
import type { AlbaListItemResponse } from "@/types/alba";
import { getAlbaList } from "@/lib/api/alba";
import { useItemSelection } from "./_hooks/useItemSelection";
import { useRequestForm } from "./_hooks/useRequestForm";
import ItemSelector from "./_components/ItemSelector";
import RequestFormTable from "./_components/RequestFormTable";

export default function RequestCreatePage() {
    const [albaList, setAlbaList] = useState<AlbaListItemResponse[]>([]);

    const { searchValue, setSearchValue, selectedItemIds, setSelectedItemIds, filteredItems, getItemById, allItems } =
        useItemSelection();

    const {
        requestItems,
        isSubmitting,
        addItemFromCheckbox,
        removeItemByItemId,
        addManualRow,
        updateRequestItem,
        selectItemForManualRow,
        removeRowAndGetItemId,
        handleCancel,
        handleSubmit,
    } = useRequestForm();

    useEffect(() => {
        getAlbaList().then((res) => {
            if (res.data) setAlbaList(res.data);
        });
    }, []);

    // 체크박스 토글 핸들러
    const handleCheckboxChange = (itemId: number, checked: boolean) => {
        if (checked) {
            setSelectedItemIds((prev) => [...prev, itemId]);
            const item = getItemById(itemId);
            if (item) {
                addItemFromCheckbox(item.itemId, item.itemName);
            }
        } else {
            setSelectedItemIds((prev) => prev.filter((id) => id !== itemId));
            removeItemByItemId(itemId);
        }
    };

    // 행 삭제 핸들러 (selectedItemIds도 같이 업데이트)
    const handleRemoveRow = (id: string) => {
        const itemId = removeRowAndGetItemId(id);
        if (itemId !== null) {
            setSelectedItemIds((prev) => prev.filter((id) => id !== itemId));
        }
    };

    return (
        <div className="h-full p-10 overflow-hidden">
            <div className="flex gap-6 h-[calc(100vh-140px)]">
                <ItemSelector
                    searchValue={searchValue}
                    onSearchChange={setSearchValue}
                    filteredItems={filteredItems}
                    selectedItemIds={selectedItemIds}
                    onCheckboxChange={handleCheckboxChange}
                />

                <RequestFormTable
                    requestItems={requestItems}
                    allItems={allItems}
                    albaList={albaList}
                    onUpdateItem={updateRequestItem}
                    onSelectItemForManualRow={selectItemForManualRow}
                    onRemoveRow={handleRemoveRow}
                    onAddManualRow={addManualRow}
                    onCancel={handleCancel}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                />
            </div>
        </div>
    );
}
