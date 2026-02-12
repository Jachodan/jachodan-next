"use client";

import { useState } from "react";
import CommonModal from "@/components/common/CommonModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    type RequestListItem,
    type RequestType,
    REQUEST_TYPE,
    REQUEST_TYPE_LABEL,
    REQUEST_STATUS_LABEL,
} from "@/types/item";

interface RequestDetailModalProps {
    open: boolean;
    onClose: () => void;
    selectedRequest: RequestListItem | null;
    isEditMode: boolean;
    editAmount: number | undefined;
    editRequestType: RequestType | undefined;
    onEditAmountChange: (amount: number | undefined) => void;
    onEditRequestTypeChange: (type: RequestType) => void;
    onEditClick: () => void;
    onCancelEdit: (e: React.MouseEvent) => void;
    onSaveEdit: (e: React.MouseEvent) => void;
    onDelete: () => void;
}

export default function RequestDetailModal({
    open,
    onClose,
    selectedRequest,
    isEditMode,
    editAmount,
    editRequestType,
    onEditAmountChange,
    onEditRequestTypeChange,
    onEditClick,
    onCancelEdit,
    onSaveEdit,
    onDelete,
}: RequestDetailModalProps) {
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    return (
        <>
            <CommonModal
                open={open}
                onClose={onClose}
                title="요청사항"
                footer={
                    isEditMode ? (
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={onCancelEdit}>
                                취소
                            </Button>
                            <Button onClick={onSaveEdit}>저장</Button>
                        </div>
                    ) : selectedRequest?.requestStatus === "WAIT" ? (
                        <div className="flex gap-2">
                            <Button onClick={onEditClick}>수정</Button>
                            <Button
                                variant="destructive"
                                onClick={() => setIsDeleteConfirmOpen(true)}
                            >
                                삭제
                            </Button>
                        </div>
                    ) : null
                }
            >
                {selectedRequest && (
                    <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-2 items-center">
                            <span className="text-sm font-medium text-gray-500">요청 유형</span>
                            {isEditMode ? (
                                <Select
                                    value={editRequestType}
                                    onValueChange={(value) => onEditRequestTypeChange(value as RequestType)}
                                >
                                    <SelectTrigger size="sm">
                                        <SelectValue placeholder="유형 선택" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectGroup>
                                            {REQUEST_TYPE.map((type) => (
                                                <SelectItem key={type} value={type}>
                                                    {REQUEST_TYPE_LABEL[type]}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            ) : (
                                <span className="text-sm">{REQUEST_TYPE_LABEL[selectedRequest.requestType]}</span>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-2 items-center">
                            <span className="text-sm font-medium text-gray-500">상품명</span>
                            <span className="text-sm">{selectedRequest.itemName}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 items-center">
                            <span className="text-sm font-medium text-gray-500">수량</span>
                            {isEditMode ? (
                                <Input
                                    type="number"
                                    value={editAmount ?? ""}
                                    onChange={(e) =>
                                        onEditAmountChange(e.target.value ? Number(e.target.value) : undefined)
                                    }
                                    placeholder="수량 입력"
                                    className="h-8"
                                />
                            ) : (
                                <span className="text-sm">{selectedRequest.requestAmount ?? "-"}</span>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-2 items-center">
                            <span className="text-sm font-medium text-gray-500">요청일</span>
                            <span className="text-sm">{selectedRequest.requestDate?.split("T")[0]}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 items-center">
                            <span className="text-sm font-medium text-gray-500">요청자</span>
                            <span className="text-sm">{selectedRequest.albaName}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 items-center">
                            <span className="text-sm font-medium text-gray-500">처리 상태</span>
                            <span className="text-sm">{REQUEST_STATUS_LABEL[selectedRequest.requestStatus]}</span>
                        </div>
                    </div>
                )}
            </CommonModal>

            <CommonModal
                open={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                title="요청 삭제"
                size="sm"
                footer={
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
                            취소
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                setIsDeleteConfirmOpen(false);
                                onDelete();
                            }}
                        >
                            삭제
                        </Button>
                    </div>
                }
            >
                <p className="text-sm text-gray-600">
                    이 요청을 삭제하시겠습니까? 삭제된 요청은 복구할 수 없습니다.
                </p>
            </CommonModal>
        </>
    );
}
