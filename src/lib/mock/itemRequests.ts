import { ItemRequest, RequestStatus, RequestType, REQUEST_STATUS, REQUEST_TYPES } from "@/types/itemRequest";

// 상품명 목록
const itemNames = [
    "신라면", "코카콜라 500ml", "삼각김밥 참치마요", "바나나우유", "새우깡",
    "포카칩 오리지널", "빼빼로 초코", "컵라면 육개장", "삼다수 2L", "허쉬 초콜릿",
    "오레오 쿠키", "감자깡", "칸쵸", "진라면", "델몬트 오렌지주스",
    "햄버거빵", "불닭볶음면", "스니커즈", "참이슬", "카스 500ml",
    "농심 너구리", "프링글스 오리지널", "킨더조이", "짜파게티", "밀키스",
];

// 요청자 목록
const albaNames = ["김철수", "이영희", "박민수", "정수진"];

// 수량 목록 (일부는 undefined)
const amounts = [20, 15, 5, undefined, 30, 50, undefined, 10, 25, undefined, 40, 8, undefined, 60, undefined, 12, 35, undefined, 18, undefined, 22, 7, undefined, 45, undefined];

// 목데이터 생성 함수
const createMockRequest = (index: number): ItemRequest => {
    const day = 15 - Math.floor(index / 2);
    const date = `2026-01-${day.toString().padStart(2, "0")}`;
    return {
        requestId: index + 1,
        itemId: 101 + index,
        albaId: (index % 4) + 1,
        requestAmount: amounts[index],
        requestDate: date,
        requestType: REQUEST_TYPES[index % 4] as RequestType,
        requestStatus: REQUEST_STATUS[index % 6] as RequestStatus,
        createdAt: `${date}T${(9 + (index % 8)).toString().padStart(2, "0")}:00:00`,
        isActive: true,
    };
};

// 고정된 목데이터 (25개)
export const mockItemRequests: ItemRequest[] = Array.from({ length: 25 }, (_, i) => createMockRequest(i));

// 상품명 매핑 (itemId -> 상품명)
export const mockItemNames: Record<number, string> = Object.fromEntries(
    itemNames.map((name, i) => [101 + i, name])
);

// 요청자 매핑 (albaId -> 이름)
export const mockAlbaNames: Record<number, string> = Object.fromEntries(
    albaNames.map((name, i) => [i + 1, name])
);

// 확장된 요청 정보 (상품명, 요청자명 포함)
export interface ItemRequestWithDetails extends ItemRequest {
    itemName: string;
    requesterName: string;
}

// 상세 정보가 포함된 요청 목록 반환
export const getMockRequestsWithDetails = (): ItemRequestWithDetails[] => {
    return mockItemRequests.map((request) => ({
        ...request,
        itemName: mockItemNames[request.itemId] || "알 수 없는 상품",
        requesterName: mockAlbaNames[request.albaId] || "알 수 없음",
    }));
};

// 페이지네이션된 요청 목록 반환
export const getPaginatedRequests = (
    page: number,
    pageSize: number = 10,
    typeFilter?: RequestType | "전체",
    searchQuery?: string
): { data: ItemRequestWithDetails[]; totalPages: number; totalCount: number } => {
    let filtered = getMockRequestsWithDetails();

    // 유형 필터
    if (typeFilter && typeFilter !== "전체") {
        filtered = filtered.filter((r) => r.requestType === typeFilter);
    }

    // 검색 필터
    if (searchQuery && searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter((r) => r.itemName.toLowerCase().includes(query));
    }

    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    return { data, totalPages, totalCount };
};

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

// 요청 생성 입력 타입
export interface CreateRequestInput {
    itemId: number;
    itemName: string;
    requestType: RequestType;
    quantity: number;
    requestDate: string;
    requester: string;
}

// 메모리 기반 요청 저장소 (실제로는 API 호출로 대체)
let mockRequestStore: ItemRequest[] = [];
let nextRequestId = 1;

// 요청 생성 함수
export const createRequests = (inputs: CreateRequestInput[], albaId: number = 1): ItemRequest[] => {
    const now = new Date().toISOString();
    const newRequests: ItemRequest[] = inputs.map((input) => ({
        requestId: nextRequestId++,
        itemId: input.itemId,
        albaId,
        requestAmount: input.quantity,
        requestDate: input.requestDate,
        requestType: input.requestType,
        requestStatus: "대기",
        createdAt: now,
        isActive: true,
    }));

    mockRequestStore = [...mockRequestStore, ...newRequests];
    return newRequests;
};

// 저장된 요청 목록 조회
export const getRequests = (): ItemRequest[] => {
    return mockRequestStore;
};

// 요청 저장소 초기화 (테스트용)
export const resetRequestStore = () => {
    mockRequestStore = [];
    nextRequestId = 1;
};
