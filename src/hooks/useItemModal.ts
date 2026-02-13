import { useState } from "react";
import { ItemDetailResponse } from "@/types/item";
import { ItemFormData } from "@/app/(workspace)/items/_components/ItemModalContent";
import { createItem, getItemDetail, updateItem, deleteItem } from "@/lib/api";

interface UseItemModalProps {
    refetch: () => Promise<void>;
    updateItemLocally?: (itemId: number, updates: Partial<{ isPinned: boolean }>) => void;
}

export function useItemModal({ refetch, updateItemLocally }: UseItemModalProps) {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "detail" | "edit">("create");
    const [selectedItem, setSelectedItem] = useState<ItemDetailResponse | null>(null);
    const [formData, setFormData] = useState<ItemFormData | null>(null);
    const [showSaveAlert, setShowSaveAlert] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleOpenCreateModal = () => {
        setModalMode("create");
        setSelectedItem(null);
        setModalOpen(true);
    };

    const handleOpenDetailModal = async (itemId: number) => {
        setModalMode("detail");
        setIsLoading(true);
        setModalOpen(true);

        const result = await getItemDetail(itemId);

        if (result.error) {
            console.error("Failed to fetch item detail:", result.error);
            setIsLoading(false);
            return;
        }

        setSelectedItem(result.data);
        setIsLoading(false);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        // 모달 닫힘 애니메이션 완료 후 상태 초기화
        setTimeout(() => {
            setSelectedItem(null);
            setFormData(null);
        }, 200);
    };

    const handleModeChange = (mode: "detail" | "edit") => {
        setModalMode(mode);
    };

    const handleFormChange = (data: ItemFormData) => {
        setFormData(data);
    };

    const handleSave = async () => {
        if (!formData) return;

        if (modalMode === "edit") {
            setShowSaveAlert(true);
        } else if (modalMode === "create") {
            // 아이템 생성 API 호출
            const result = await createItem({
                imageId: formData.imageId,
                itemName: formData.itemName,
                stockAmount: formData.stockAmount,
            });

            if (result.error) {
                console.error("Failed to create item:", result.error);
                // TODO: 에러 토스트 표시
                return;
            }

            console.log("Item created:", result.data);
            // 목록 리프레시
            await refetch();
            handleCloseModal();
        }
    };

    const handleSaveConfirm = async () => {
        if (!formData || !selectedItem) return;

        const result = await updateItem(selectedItem.itemId, {
            bufferAmount: formData.bufferAmount ?? selectedItem.bufferAmount,
            imageId: formData.imageId ?? selectedItem.imageId,
            isPinned: selectedItem.isPinned ?? false,
            itemName: formData.itemName,
            targetAmount: selectedItem.stockAmount,
        });

        if (result.error) {
            console.error("Failed to update item:", result.error);
            setShowSaveAlert(false);
            return;
        }

        // 목록 리프레시
        await refetch();
        setShowSaveAlert(false);
        handleCloseModal();
    };

    const handleToggleFavorite = async () => {
        if (!selectedItem) return;

        const newPinnedState = !(selectedItem.isPinned ?? false);

        // 낙관적 업데이트 - 모달 상태
        setSelectedItem({ ...selectedItem, isPinned: newPinnedState });

        const result = await updateItem(selectedItem.itemId, {
            bufferAmount: selectedItem.bufferAmount,
            imageId: selectedItem.imageId,
            isPinned: newPinnedState,
            itemName: selectedItem.itemName,
            targetAmount: 0,
        });

        if (result.error) {
            // 실패 시 롤백
            setSelectedItem({ ...selectedItem, isPinned: !newPinnedState });
            console.error("Failed to toggle favorite:", result.error);
            return;
        }

        // 목록 로컬 업데이트 (refetch 시 isLoading이 true가 되어 모달이 닫히는 문제 방지)
        updateItemLocally?.(selectedItem.itemId, { isPinned: newPinnedState });
    };

    const handleDelete = () => {
        setShowDeleteAlert(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedItem) return;

        const result = await deleteItem(selectedItem.itemId);

        if (result.error) {
            console.error("Failed to delete item:", result.error);
            setShowDeleteAlert(false);
            return;
        }

        // 목록 리프레시
        await refetch();
        setShowDeleteAlert(false);
        handleCloseModal();
    };

    return {
        // State
        modalOpen,
        modalMode,
        selectedItem,
        formData,
        showSaveAlert,
        showDeleteAlert,
        isLoading,
        // Handlers
        handleOpenCreateModal,
        handleOpenDetailModal,
        handleCloseModal,
        handleModeChange,
        handleFormChange,
        handleToggleFavorite,
        handleSave,
        handleSaveConfirm,
        handleDelete,
        handleDeleteConfirm,
        // Alert setters
        setShowSaveAlert,
        setShowDeleteAlert,
    };
}
