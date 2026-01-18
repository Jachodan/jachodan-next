import { Board } from "@/types/board";

const sampleNotices = [
    { title: "1월 급여일 안내", content: "이번 달 급여일은 1월 25일입니다." },
    { title: "설 연휴 영업시간 변경", content: "설 연휴 기간 동안 영업시간이 변경됩니다." },
    { title: "신규 상품 입고 안내", content: "새로운 상품이 입고되었습니다." },
    { title: "재고 정리 일정", content: "이번 주 토요일 재고 정리가 있습니다." },
    { title: "알바생 교육 일정", content: "신입 알바생 교육이 예정되어 있습니다." },
];

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

export const mockNotices = generateMockNotices(5);
