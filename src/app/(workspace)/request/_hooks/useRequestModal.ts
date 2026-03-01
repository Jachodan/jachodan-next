"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { type RequestListItem, type RequestType } from "@/types/item";
import { type AlbaListItemResponse } from "@/types/alba";
import { getRequestDetail, updateRequest, deleteRequest, getAlbaList } from "@/lib/api";

export interface UseRequestModalOptions {
    onUpdate?: () => void;
}

export function useRequestModal(options?: UseRequestModalOptions) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<RequestListItem | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editAmount, setEditAmount] = useState<number | undefined>(undefined);
    const [editRequestType, setEditRequestType] = useState<RequestType | undefined>(undefined);
    const [albaList, setAlbaList] = useState<AlbaListItemResponse[]>([]);

    useEffect(() => {
        const fetchAlbaList = async () => {
            const result = await getAlbaList(1); // TODO: 세션에서 storeId 가져올 예정
            if (result.data) {
                setAlbaList(result.data);
            }
        };
        fetchAlbaList();
    }, []);

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
            setEditAmount(selectedRequest.requestAmount);
            setEditRequestType(selectedRequest.requestType);
            setIsEditMode(true);
        }
    };

    const handleCancelEdit = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setIsModalOpen(false);
        setIsEditMode(false);
        setEditAmount(undefined);
        setEditRequestType(undefined);
    };

    const handleSaveEdit = async (e?: React.MouseEvent) => {
        e?.stopPropagation();

        if (!selectedRequest) {
            toast.error("요청 정보가 올바르지 않습니다.");
            return;
        }

        if (editAmount == null || !Number.isFinite(editAmount) || editAmount < 1) {
            toast.error("수량은 1 이상의 숫자여야 합니다.");
            return;
        }

        const matchedAlba = albaList.find(
            (alba) => alba.albaName === selectedRequest.albaName
        );
        if (!matchedAlba) {
            toast.error("요청자 정보를 찾을 수 없습니다.");
            return;
        }

        const result = await updateRequest(selectedRequest.requestId, {
            albaId: matchedAlba.albaId,
            requestAmount: editAmount,
            requestDate: selectedRequest.requestDate,
            requestType: editRequestType!,
        });

        if (result.error) {
            toast.error("요청 수정에 실패했습니다.");
            return;
        }
        options?.onUpdate?.();
        toast.success("요청이 수정되었습니다.");

        setIsModalOpen(false);
        setIsEditMode(false);
        setEditAmount(undefined);
        setEditRequestType(undefined);
    };

    const handleDelete = async () => {
        if (!selectedRequest) return;

        const result = await deleteRequest(selectedRequest.requestId);

        if (result.error) {
            toast.error("요청 삭제에 실패했습니다.");
            return;
        }

        options?.onUpdate?.();
        toast.success("요청이 삭제되었습니다.");

        setIsModalOpen(false);
        setIsEditMode(false);
        setEditAmount(undefined);
        setEditRequestType(undefined);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
        setEditAmount(undefined);
        setEditRequestType(undefined);
    };

    return {
        // 모달 상태
        isModalOpen,
        selectedRequest,
        isEditMode,

        // 편집 상태
        editAmount,
        setEditAmount,
        editRequestType,
        setEditRequestType,

        // 핸들러
        handleRowClick,
        handleEditClick,
        handleCancelEdit,
        handleSaveEdit,
        handleDelete,
        handleModalClose,
    };
}
