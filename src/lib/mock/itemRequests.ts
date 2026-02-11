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

// 요청 생성 입력 타입
export interface CreateRequestInput {
    itemId: number;
    itemName: string;
    requestType: RequestType;
    quantity: number;
    requestDate: string;
    requester: string;
}

// 다음 요청 ID (기존 목데이터의 마지막 ID + 1)
let nextRequestId = mockItemRequests.length + 1;

// 요청자명으로 albaId 찾기 또는 생성
const getOrCreateAlbaId = (requesterName: string): number => {
    // 기존 요청자 찾기
    const existingEntry = Object.entries(mockAlbaNames).find(([, name]) => name === requesterName);
    if (existingEntry) {
        return Number(existingEntry[0]);
    }

    // 새 요청자 추가
    const newAlbaId = Math.max(...Object.keys(mockAlbaNames).map(Number), 0) + 1;
    mockAlbaNames[newAlbaId] = requesterName;
    return newAlbaId;
};

// 요청 생성 함수
export const createRequests = (inputs: CreateRequestInput[]): ItemRequest[] => {
    const now = new Date().toISOString();
    const newRequests: ItemRequest[] = inputs.map((input) => {
        // 상품명 매핑에 추가 (새로운 itemId인 경우)
        if (!mockItemNames[input.itemId]) {
            mockItemNames[input.itemId] = input.itemName;
        }

        // 요청자 ID 가져오기 또는 생성
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

    // mockItemRequests에 직접 추가하여 목록에 반영
    mockItemRequests = [...newRequests, ...mockItemRequests];
    return newRequests;
};

// 저장된 요청 목록 조회
export const getRequests = (): ItemRequest[] => {
    return mockItemRequests;
};

// 요청 저장소 초기화 (테스트용)
export const resetRequestStore = () => {
    mockItemRequests = Array.from({ length: 25 }, (_, i) => createMockRequest(i));
    nextRequestId = mockItemRequests.length + 1;
};

// 요청 수정 입력 타입
export interface UpdateRequestInput {
    requestId: number;
    itemId?: number;
    requestAmount?: number;
    requestType?: RequestType;
    requestStatus?: RequestStatus;
}

// 요청 수정 함수
export const updateRequest = (input: UpdateRequestInput): ItemRequestWithDetails | null => {
    const index = mockItemRequests.findIndex((r) => r.requestId === input.requestId);
    if (index === -1) return null;

    const now = new Date().toISOString();
    mockItemRequests[index] = {
        ...mockItemRequests[index],
        ...(input.itemId !== undefined && { itemId: input.itemId }),
        ...(input.requestAmount !== undefined && { requestAmount: input.requestAmount }),
        ...(input.requestType !== undefined && { requestType: input.requestType }),
        ...(input.requestStatus !== undefined && { requestStatus: input.requestStatus }),
        updatedAt: now,
    };

    const updatedRequest = mockItemRequests[index];
    return {
        ...updatedRequest,
        itemName: mockItemNames[updatedRequest.itemId] || "알 수 없는 상품",
        requesterName: mockAlbaNames[updatedRequest.albaId] || "알 수 없음",
    };
};
