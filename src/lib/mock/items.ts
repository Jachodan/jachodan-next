import { Item, ItemWithStock, Buffer, Stock } from "@/types/item";

const sampleItemNames = [
    "영주별사과",
    "제주감귤",
    "청송사과",
    "나주배",
    "상주곶감",
    "성주참외",
    "논산딸기",
    "고창수박",
    "완도전복",
    "통영굴",
    "횡성한우",
    "제주흑돼지",
    "상추",
    "배추",
    "무",
    "양파",
    "당근",
    "감자",
    "고구마",
    "브로콜리",
];

const IMAGE_PROBABILITY = 0.3;
const PIN_PROBABILITY = 0.7;

export const generateMockItems = (count: number = 50, storeId: number = 1): ItemWithStock[] => {
    const now = new Date().toISOString();

    return Array.from({ length: count }, (_, index) => {
        const itemId = index + 1;
        const stockId = index + 1;
        const bufferId = index + 1;
        const stockAmount = Math.floor(Math.random() * 200);
        const bufferAmount = Math.floor(Math.random() * 50) + 20; // 20 ~ 69
        const hasImage = Math.random() > IMAGE_PROBABILITY;

        const item: Item = {
            itemId,
            storeId,
            imageId: hasImage ? itemId : undefined,
            itemName: sampleItemNames[index % sampleItemNames.length],
            createdAt: now,
            updatedAt: now,
            isActive: true,
            isPin: Math.random() > PIN_PROBABILITY,
        };

        const stock: Stock = {
            itemId,
            stockId,
            stockAmount,
            createdAt: now,
            updatedAt: now,
        };

        const buffer: Buffer = {
            itemId,
            bufferId,
            bufferAmount,
            createdAt: now,
            updatedAt: now,
        };

        const itemWithStock: ItemWithStock = {
            ...item,
            stock,
            buffer,
        };

        return itemWithStock;
    });
};

// 기본 목 데이터
export const mockItems = generateMockItems(30, 1);

// 이미지 URL 생성 헬퍼 함수
export const getItemImageUrl = (itemName: string, imageId?: number): string | null => {
    if (!imageId) return null;
    return `https://placehold.co/300x300/e2e8f0/64748b?text=${encodeURIComponent(itemName)}`;
};
