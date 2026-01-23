import { useState } from "react";
import type { Alba } from "@/types/alba";

export function useAlbaModal() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedAlba, setSelectedAlba] = useState<Alba | null>(null);

    const openCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const openDetailModal = (alba: Alba) => {
        setSelectedAlba(alba);
        setIsDetailModalOpen(true);
    };

    const openEditModal = () => {
        setIsDetailModalOpen(false);
        setIsEditModalOpen(true);
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
    };

    const closeDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedAlba(null);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedAlba(null);
    };

    const closeAllModals = () => {
        setIsCreateModalOpen(false);
        setIsEditModalOpen(false);
        setIsDetailModalOpen(false);
        setSelectedAlba(null);
    };

    return {
        // State
        isCreateModalOpen,
        isEditModalOpen,
        isDetailModalOpen,
        selectedAlba,
        // Handlers
        openCreateModal,
        openDetailModal,
        openEditModal,
        closeCreateModal,
        closeDetailModal,
        closeEditModal,
        closeAllModals,
    };
}
