import { useState } from "react";
import { ItemDetailResponse } from "@/types/item";
import { ItemFormData } from "@/app/(workspace)/items/_components/ItemModalContent";
import { createItem, getItemDetail } from "@/lib/api";

interface UseItemModalProps {
    refetch: () => Promise<void>;
}

export function useItemModal({ refetch }: UseItemModalProps) {
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
        setSelectedItem(null);
        setFormData(null);
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

        // TODO: 아이템 수정 API 연결 필요
        console.log("Update item:", selectedItem.itemId, formData);

        // 목록 리프레시
        await refetch();
        setShowSaveAlert(false);
        handleCloseModal();
    };

    const handleDelete = () => {
        setShowDeleteAlert(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedItem) return;

        // TODO: 아이템 삭제 API 연결 필요
        console.log("Delete item:", selectedItem.itemId);

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
        handleSave,
        handleSaveConfirm,
        handleDelete,
        handleDeleteConfirm,
        // Alert setters
        setShowSaveAlert,
        setShowDeleteAlert,
    };
}
