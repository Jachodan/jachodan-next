"use client";

import { useState } from "react";
import { updateRequest, type ItemRequestWithDetails } from "@/lib/mock/itemRequests";

export interface UseRequestModalOptions {
    onUpdate?: () => void;
}

export function useRequestModal(options?: UseRequestModalOptions) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<ItemRequestWithDetails | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editItemId, setEditItemId] = useState<number | null>(null);
    const [editAmount, setEditAmount] = useState<number | undefined>(undefined);

    const handleRowClick = (request: ItemRequestWithDetails) => {
        setSelectedRequest(request);
        setIsModalOpen(true);
        setIsEditMode(false);
    };

    const handleEditClick = () => {
        if (selectedRequest) {
            setEditItemId(selectedRequest.itemId);
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
        if (selectedRequest && editItemId) {
            const updated = updateRequest({
                requestId: selectedRequest.requestId,
                itemId: editItemId,
                requestAmount: editAmount,
            });

            if (updated) {
                setSelectedRequest(updated);
                options?.onUpdate?.();
            }
        }
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

        // 핸들러
        handleRowClick,
        handleEditClick,
        handleCancelEdit,
        handleSaveEdit,
        handleModalClose,
    };
}
