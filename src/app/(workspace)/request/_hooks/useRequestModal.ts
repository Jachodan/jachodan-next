"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { type RequestListItem, type ItemListItem } from "@/types/item";
import { getItems, getRequestDetail } from "@/lib/api";

export interface UseRequestModalOptions {
    onUpdate?: () => void;
}

export function useRequestModal(options?: UseRequestModalOptions) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<RequestListItem | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editItemId, setEditItemId] = useState<number | null>(null);
    const [editAmount, setEditAmount] = useState<number | undefined>(undefined);
    const [itemOptions, setItemOptions] = useState<ItemListItem[]>([]);

    // 모달이 열릴 때 아이템 목록 조회
    useEffect(() => {
        if (!isModalOpen) return;

        const fetchItems = async () => {
            const result = await getItems({ storeId: 1, size: 100 }); // TODO: 세션에서 storeId 가져올 예정
            if (result.data) {
                setItemOptions(result.data.content);
            }
        };
        fetchItems();
    }, [isModalOpen]);

    const handleRowClick = async (request: RequestListItem) => {
        setSelectedRequest(request);
        setIsModalOpen(true);
        setIsEditMode(false);

        const result = await getRequestDetail(request.requestId, 1); // TODO: 세션에서 storeId 가져올 예정
        if (result.data) {
            setSelectedRequest({
                ...request,
                ...result.data,
            });
        }
    };

    const handleEditClick = () => {
        if (selectedRequest) {
            // 아이템 목록에서 itemName으로 매칭하여 itemId 설정
            const matchedItem = itemOptions.find(
                (item) => item.itemName === selectedRequest.itemName
            );
            setEditItemId(matchedItem?.itemId ?? null);
            setEditAmount(selectedRequest.requestAmount);
            setIsEditMode(true);
        }
    };

    const handleCancelEdit = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setIsModalOpen(false);
        setIsEditMode(false);
        setEditItemId(null);
        setEditAmount(undefined);
    };

    const handleSaveEdit = (e?: React.MouseEvent) => {
        e?.stopPropagation();

        if (!selectedRequest || editItemId == null) {
            toast.error("요청 정보가 올바르지 않습니다.");
            return;
        }

        if (editAmount == null || !Number.isFinite(editAmount) || editAmount < 1) {
            toast.error("수량은 1 이상의 숫자여야 합니다.");
            return;
        }

        // TODO: 요청 수정 API 연결 예정
        options?.onUpdate?.();
        toast.success("요청이 수정되었습니다.");

        setIsModalOpen(false);
        setIsEditMode(false);
        setEditItemId(null);
        setEditAmount(undefined);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
        setEditItemId(null);
        setEditAmount(undefined);
    };

    return {
        // 모달 상태
        isModalOpen,
        selectedRequest,
        isEditMode,

        // 편집 상태
        editItemId,
        setEditItemId,
        editAmount,
        setEditAmount,

        // 아이템 목록 (수정 모달 드롭다운용)
        itemOptions,

        // 핸들러
        handleRowClick,
        handleEditClick,
        handleCancelEdit,
        handleSaveEdit,
        handleModalClose,
    };
}
