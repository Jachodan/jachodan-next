import { ItemRequest, RequestType } from "@/types/itemRequest";

// 요청 생성 입력 타입
export interface CreateRequestInput {
    itemId: number;
    itemName: string;
    requestType: RequestType;
    quantity: number;
    requestDate: string;
    requester: string;
}

// 상품명 매핑 (itemId -> 상품명)
let mockItemNames: Record<number, string> = {};

// 요청자 매핑 (albaId -> 이름)
let mockAlbaNames: Record<number, string> = {};

// 다음 요청 ID
let nextRequestId = 1;

// 요청자명으로 albaId 찾기 또는 생성
const getOrCreateAlbaId = (requesterName: string): number => {
    const existingEntry = Object.entries(mockAlbaNames).find(([, name]) => name === requesterName);
    if (existingEntry) {
        return Number(existingEntry[0]);
    }

    const newAlbaId = Math.max(...Object.keys(mockAlbaNames).map(Number), 0) + 1;
    mockAlbaNames[newAlbaId] = requesterName;
    return newAlbaId;
};

// 요청 생성 함수
export const createRequests = (inputs: CreateRequestInput[]): ItemRequest[] => {
    const now = new Date().toISOString();
    const newRequests: ItemRequest[] = inputs.map((input) => {
        if (!mockItemNames[input.itemId]) {
            mockItemNames[input.itemId] = input.itemName;
        }

        const albaId = getOrCreateAlbaId(input.requester);

        return {
            requestId: nextRequestId++,
            itemId: input.itemId,
            albaId,
            requestAmount: input.quantity,
            requestDate: input.requestDate,
            requestType: input.requestType,
            requestStatus: "대기",
            createdAt: now,
            isActive: true,
        };
    });

    return newRequests;
};

export const generateMockRequests = (
    items: Array<{ itemId: number }>,
    requestRatio: number = 0.2
): ItemRequest[] => {
    const requests: ItemRequest[] = [];
    const now = new Date().toISOString();

    items.forEach((item, index) => {
        if (Math.random() < requestRatio) {
            requests.push({
                requestId: index + 1,
                itemId: item.itemId,
                albaId: 1,
                requestAmount: Math.floor(Math.random() * 50) + 10,
                requestDate: now,
                requestType: "주문요청",
                requestStatus: Math.random() > 0.5 ? "확인중" : "대기",
                createdAt: now,
                updatedAt: now,
                isActive: true,
            });
        }
    });

    return requests;
};
