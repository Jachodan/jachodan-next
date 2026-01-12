import { Button } from "@/components/ui/button";
import CustomPagination from "./CustomPagination";

interface ActionButtonConfig {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "ghost" | "destructive" | "secondary" | "link";
    className?: string;
}

interface ListPageFooterProps {
    // 페이지네이션 (선택적)
    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;

    // 액션 버튼 (선택적)
    actionButton?: ActionButtonConfig;
}

export default function ListPageFooter({ currentPage, totalPages, onPageChange, actionButton }: ListPageFooterProps) {
    const showPagination = currentPage !== undefined && totalPages !== undefined && totalPages > 0 && onPageChange;

    return (
        <div className="flex justify-between items-center py-6">
            <div className="flex-1 flex justify-center">
                {showPagination && (
                    <CustomPagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
                )}
            </div>
            {actionButton && (
                <Button
                    variant={actionButton.variant || "outline"}
                    className={actionButton.className || "hover:text-white hover:bg-black"}
                    onClick={actionButton.onClick}
                >
                    {actionButton.label}
                </Button>
            )}
        </div>
    );
}
