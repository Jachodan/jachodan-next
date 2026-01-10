import { ItemRequest } from "@/types/itemRequest";

export const generateMockRequests = (
    items: Array<{ itemId: number }>,
    requestRatio: number = 0.2 // 20% 상품에 요청 있음
): ItemRequest[] => {
    const requests: ItemRequest[] = [];
    const now = new Date().toISOString();

    items.forEach((item, index) => {
        // 일부 상품에만 입고요청 생성
        if (Math.random() < requestRatio) {
            requests.push({
                requestId: index + 1,
                itemId: item.itemId,
                albaId: 1,
                requestAmount: Math.floor(Math.random() * 50) + 10,
                requestDate: now,
                requestType: "입고요청",
                requestStatus: Math.random() > 0.5 ? "확인중" : "대기",
                createdAt: now,
                updatedAt: now,
                isActive: true,
            });
        }
    });

    return requests;
};
