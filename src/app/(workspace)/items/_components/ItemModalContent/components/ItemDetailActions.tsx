import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface ItemDetailActionsProps {
    onEdit: () => void;
    onDelete: () => void;
}

export function ItemDetailActions({ onEdit, onDelete }: ItemDetailActionsProps) {
    return (
        <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                수정
            </Button>
            <Button variant="destructive" className="flex-1" onClick={onDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                삭제
            </Button>
        </div>
    );
}
