import { ItemWithStock } from "@/types/item";
import { ItemFormData } from "./ItemModalContent";
import CommonModal from "@/components/common/CommonModal";
import ItemModalContent from "./ItemModalContent";
import { Button } from "@/components/ui/button";

interface ItemModalManagerProps {
    open: boolean;
    mode: "create" | "detail" | "edit";
    selectedItem: ItemWithStock | null;
    currentSelectedItem: ItemWithStock | null;
    onClose: () => void;
    onModeChange: (mode: "detail" | "edit") => void;
    onFormChange: (data: ItemFormData) => void;
    onToggleFavorite: () => void;
    onDelete: () => void;
    onSave: () => void;
}

export default function ItemModalManager({
    open,
    mode,
    selectedItem,
    currentSelectedItem,
    onClose,
    onModeChange,
    onFormChange,
    onToggleFavorite,
    onDelete,
    onSave,
}: ItemModalManagerProps) {
    return (
        <CommonModal
            open={open}
            onClose={onClose}
            title={
                mode === "create" ? "상품 등록" : mode === "edit" ? "상품 수정" : selectedItem?.itemName ?? "상품 상세"
            }
            size="md"
            footer={
                mode === "detail" ? (
                    <Button variant="outline" onClick={onClose}>
                        닫기
                    </Button>
                ) : (
                    <>
                        <Button variant="outline" onClick={onClose}>
                            취소
                        </Button>
                        <Button onClick={onSave}>{mode === "create" ? "등록" : "저장"}</Button>
                    </>
                )
            }
        >
            <ItemModalContent
                key={`${mode}-${selectedItem?.itemId || "create"}`}
                mode={mode}
                item={currentSelectedItem || selectedItem}
                onModeChange={onModeChange}
                onFormChange={onFormChange}
                onToggleFavorite={onToggleFavorite}
                onDelete={onDelete}
                onSave={onSave}
            />
        </CommonModal>
    );
}
