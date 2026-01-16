import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ItemFormData } from "../hooks/useItemForm";

interface ItemFormFieldsProps {
    mode: "create" | "edit";
    formData: ItemFormData;
    onInputChange: (field: keyof ItemFormData, value: string | number) => void;
}

export function ItemFormFields({ mode, formData, onInputChange }: ItemFormFieldsProps) {
    return (
        <>
            {/* 상품명 */}
            <div className="space-y-2">
                <Label htmlFor="itemName">상품명</Label>
                <Input
                    id="itemName"
                    value={formData.itemName}
                    onChange={(e) => onInputChange("itemName", e.target.value)}
                    placeholder="상품명을 입력하세요"
                />
            </div>

            {/* 재고 수량 */}
            <div className="space-y-2">
                <Label htmlFor="stockAmount">재고 수량 {mode === "create" && "(실제재고)"}</Label>
                <Input
                    id="stockAmount"
                    type="number"
                    min="0"
                    value={formData.stockAmount}
                    onChange={(e) => onInputChange("stockAmount", Number(e.target.value))}
                    placeholder="재고 수량을 입력하세요"
                />
            </div>

            {/* 적정 수량 (등록 시에는 표시하지 않음) */}
            {mode !== "create" && (
                <div className="space-y-2">
                    <Label htmlFor="bufferAmount">적정 수량</Label>
                    <Input
                        id="bufferAmount"
                        type="number"
                        min="0"
                        value={formData.bufferAmount}
                        onChange={(e) => onInputChange("bufferAmount", Number(e.target.value))}
                        placeholder="적정 수량을 입력하세요"
                    />
                </div>
            )}
        </>
    );
}
