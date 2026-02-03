import { Board } from "@/types/board";

const sampleNotices = [
    { title: "1월 급여일 안내", content: "이번 달 급여일은 1월 25일입니다." },
    { title: "설 연휴 영업시간 변경", content: "설 연휴 기간 동안 영업시간이 변경됩니다." },
    { title: "신규 상품 입고 안내", content: "새로운 상품이 입고되었습니다." },
    { title: "재고 정리 일정", content: "이번 주 토요일 재고 정리가 있습니다." },
    { title: "알바생 교육 일정", content: "신입 알바생 교육이 예정되어 있습니다." },
];

const sampleFreeBoards = [
    { title: "오늘 점심 뭐 먹을까요?", content: "추천 부탁드립니다!" },
    { title: "이번 주 회식 장소 추천", content: "좋은 곳 있으면 알려주세요." },
    { title: "퇴근 후 운동 같이 하실 분", content: "헬스장 같이 다닐 분 구합니다." },
    { title: "주말 근무 교대 가능한 분?", content: "이번 주 토요일 교대 구합니다." },
    { title: "매장 앞 주차 관련", content: "매장 앞 주차 시 주의사항 공유합니다." },
];

const sampleGuestBoards = [
    { title: "익명으로 건의합니다", content: "화장실 청소 주기를 늘려주세요." },
    { title: "근무 환경 개선 요청", content: "에어컨 온도 좀 낮춰주세요." },
    { title: "급여 관련 문의", content: "이번 달 급여 명세서 확인 부탁드립니다." },
    { title: "휴게실 이용 관련", content: "휴게실 정리정돈 부탁드립니다." },
    { title: "교대 시간 조정 요청", content: "교대 시간을 30분 앞당겨주세요." },
];

const albaWriters = ["김민수", "이서연", "박지훈", "최유진", "정도현"];

export const generateMockNotices = (count: number = 5): Board[] => {
    const now = new Date();

    return Array.from({ length: count }, (_, index) => {
        const createdAt = new Date(now.getTime() - index * 24 * 60 * 60 * 1000);
        const sample = sampleNotices[index % sampleNotices.length];

        return {
            boardId: index + 1,
            boardType: "공지사항",
            title: sample.title,
            content: sample.content,
            writer: "관리자",
            isPin: index === 0,
            isDel: false,
            createdAt: createdAt.toISOString(),
        };
    });
};

export const generateMockFreeBoards = (count: number = 5): Board[] => {
    const now = new Date();

    return Array.from({ length: count }, (_, index) => {
        const createdAt = new Date(now.getTime() - index * 12 * 60 * 60 * 1000);
        const sample = sampleFreeBoards[index % sampleFreeBoards.length];

        return {
            boardId: 100 + index + 1,
            boardType: "자유게시판",
            title: sample.title,
            content: sample.content,
            writer: albaWriters[index % albaWriters.length],
            isPin: false,
            isDel: false,
            createdAt: createdAt.toISOString(),
        };
    });
};

export const generateMockGuestBoards = (count: number = 5): Board[] => {
    const now = new Date();

    return Array.from({ length: count }, (_, index) => {
        const createdAt = new Date(now.getTime() - index * 18 * 60 * 60 * 1000);
        const sample = sampleGuestBoards[index % sampleGuestBoards.length];

        return {
            boardId: 200 + index + 1,
            boardType: "익명게시판",
            title: sample.title,
            content: sample.content,
            writer: undefined,
            isPin: false,
            isDel: false,
            createdAt: createdAt.toISOString(),
        };
    });
};

export const mockNotices = generateMockNotices(5);
export const mockFreeBoards = generateMockFreeBoards(5);
export const mockGuestBoards = generateMockGuestBoards(5);

export const mockAllBoards: Board[] = [
    ...mockNotices,
    ...mockFreeBoards,
    ...mockGuestBoards,
];
