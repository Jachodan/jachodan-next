"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { type RequestType } from "@/types/item";
import { createRequests } from "@/lib/api/request";

export interface RequestItem {
    id: string;
    itemId: number | null;
    itemName: string;
    requestType: RequestType;
    quantity: number;
    requestDate: string;
    albaId: number | null;
    isManual: boolean;
}

// 고유 ID 생성 (타임스탬프 + 랜덤 문자열 조합)
const generateId = (prefix: string) => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
};

// 오늘 날짜
const getToday = () => new Date().toISOString().split("T")[0];

export function useRequestForm() {
    const router = useRouter();
    const [requestItems, setRequestItems] = useState<RequestItem[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const today = getToday();

    // 체크박스로 아이템 추가
    const addItemFromCheckbox = (itemId: number, itemName: string) => {
        const newRequestItem: RequestItem = {
            id: generateId(`item-${itemId}`),
            itemId,
            itemName,
            requestType: "ORDER",
            quantity: 1,
            requestDate: today,
            albaId: null,
            isManual: false,
        };
        setRequestItems((prev) => [...prev, newRequestItem]);
    };

    // 체크박스 해제로 아이템 제거
    const removeItemByItemId = (itemId: number) => {
        setRequestItems((prev) => prev.filter((item) => item.itemId !== itemId || item.isManual));
    };

    // 수동으로 행 추가
    const addManualRow = () => {
        const newRequestItem: RequestItem = {
            id: generateId("manual"),
            itemId: null,
            itemName: "",
            requestType: "ORDER",
            quantity: 1,
            requestDate: today,
            albaId: null,
            isManual: true,
        };
        setRequestItems((prev) => [...prev, newRequestItem]);
    };

    // 요청 항목 업데이트
    const updateRequestItem = (id: string, field: keyof RequestItem, value: string | number) => {
        setRequestItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
    };

    // 수동 항목에서 상품 선택
    const selectItemForManualRow = (id: string, itemId: number, itemName: string) => {
        setRequestItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, itemId, itemName } : item))
        );
    };

    // 행 삭제
    const removeRow = (id: string) => {
        setRequestItems((prev) => prev.filter((item) => item.id !== id));
    };

    // 행 삭제 및 선택 해제 (itemId 반환)
    const removeRowAndGetItemId = (id: string): number | null => {
        const item = requestItems.find((item) => item.id === id);
        setRequestItems((prev) => prev.filter((item) => item.id !== id));
        return item?.itemId ?? null;
    };

    // 취소
    const handleCancel = () => {
        router.back();
    };

    // 확인 (요청 생성)
    const handleSubmit = async () => {
        // 유효성 검사
        const validItems = requestItems.filter((item) => item.itemId !== null);

        if (validItems.length === 0) {
            toast.error("최소 1개 이상의 상품을 선택해주세요.");
            return;
        }

        const invalidAlbaItems = validItems.filter((item) => item.albaId === null);
        if (invalidAlbaItems.length > 0) {
            toast.error("모든 항목에 요청자를 선택해주세요.");
            return;
        }

        const invalidQuantityItems = validItems.filter((item) => item.quantity < 1);
        if (invalidQuantityItems.length > 0) {
            toast.error("수량은 1 이상이어야 합니다.");
            return;
        }

        setIsSubmitting(true);

        try {
            const dto = {
                requests: validItems.map((item) => ({
                    albaId: item.albaId!,
                    itemId: item.itemId!,
                    requestAmount: item.quantity,
                    requestDate: new Date(item.requestDate).toISOString(),
                    requestType: item.requestType,
                })),
            };

            const res = await createRequests(dto);
            if (res.error) {
                toast.error("요청 등록에 실패했습니다.");
                return;
            }
            toast.success(`${validItems.length}건의 요청이 등록되었습니다.`);
            router.push("/request");
        } catch {
            toast.error("요청 등록에 실패했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        requestItems,
        isSubmitting,
        addItemFromCheckbox,
        removeItemByItemId,
        addManualRow,
        updateRequestItem,
        selectItemForManualRow,
        removeRow,
        removeRowAndGetItemId,
        handleCancel,
        handleSubmit,
    };
}
