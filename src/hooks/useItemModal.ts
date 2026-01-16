import { useState } from "react";
import { ItemWithStock } from "@/types/item";
import { ItemFormData } from "@/app/(workspace)/items/_components/ItemModalContent";

interface UseItemModalProps {
    updateItem: (itemId: number, updates: Partial<ItemWithStock>) => void;
    addItem: (item: ItemWithStock) => void;
    deleteItem: (itemId: number) => void;
}

export function useItemModal({ updateItem, addItem, deleteItem }: UseItemModalProps) {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "detail" | "edit">("create");
    const [selectedItem, setSelectedItem] = useState<ItemWithStock | null>(null);
    const [formData, setFormData] = useState<ItemFormData | null>(null);
    const [showSaveAlert, setShowSaveAlert] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);

    const handleOpenCreateModal = () => {
        setModalMode("create");
        setSelectedItem(null);
        setModalOpen(true);
    };

    const handleOpenDetailModal = (item: ItemWithStock) => {
        setModalMode("detail");
        setSelectedItem(item);
        setModalOpen(true);
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

    const handleSave = () => {
        if (!formData) return;

        if (modalMode === "edit") {
            setShowSaveAlert(true);
        } else if (modalMode === "create") {
            // TODO: 실제 API 호출로 변경
            const timestamp = Date.now();
            const itemId = timestamp;
            const stockId = timestamp + 1;
            const bufferId = timestamp + 2;
            const createdAt = new Date().toISOString();

            addItem({
                itemId,
                itemName: formData.itemName,
                storeId: 1,
                createdAt,
                isActive: true,
                isPin: false,
                imageId: formData.imageId,
                stock: {
                    itemId,
                    stockId,
                    stockAmount: formData.stockAmount,
                    createdAt,
                },
                buffer: formData.bufferAmount
                    ? {
                          itemId,
                          bufferId,
                          bufferAmount: formData.bufferAmount,
                          createdAt,
                      }
                    : undefined,
            });
            handleCloseModal();
        }
    };

    const handleSaveConfirm = () => {
        if (!formData || !selectedItem) return;

        // TODO: 실제 API 호출로 변경
        updateItem(selectedItem.itemId, {
            itemName: formData.itemName,
            stock: {
                ...selectedItem.stock,
                stockAmount: formData.stockAmount,
            },
            buffer: formData.bufferAmount
                ? {
                      ...selectedItem.buffer,
                      bufferId: selectedItem.buffer?.bufferId ?? Date.now(),
                      itemId: selectedItem.itemId,
                      bufferAmount: formData.bufferAmount,
                      createdAt: selectedItem.buffer?.createdAt ?? new Date().toISOString(),
                  }
                : undefined,
            imageId: formData.imageId,
        });

        setShowSaveAlert(false);
        handleCloseModal();
    };

    const handleDelete = () => {
        setShowDeleteAlert(true);
    };

    const handleDeleteConfirm = () => {
        if (!selectedItem) return;

        // TODO: 실제 API 호출로 변경
        deleteItem(selectedItem.itemId);
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
