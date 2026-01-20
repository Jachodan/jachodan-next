import CustomPagination from "@/components/common/CustomPagination";
import { AttendanceState } from "@/types/schedule";
import EmployeeCard from "./EmployeeCard";

interface EmployeeCardGridProps {
    cards: AttendanceState[];
    currentPage: number;
    totalPages: number;
    onCardClick: (index: number) => void;
    onPageChange: (page: number) => void;
    getActualIndex: (index: number) => number;
}

export default function EmployeeCardGrid({
    cards,
    currentPage,
    totalPages,
    onCardClick,
    onPageChange,
    getActualIndex,
}: EmployeeCardGridProps) {
    return (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="pb-4 text-lg font-semibold">근무 직원</h2>
            <div className="grid grid-cols-3 gap-4">
                {cards.map((card, index) => {
                    const actualIndex = getActualIndex(index);
                    return (
                        <EmployeeCard
                            key={actualIndex}
                            card={card}
                            index={actualIndex}
                            onClick={() => onCardClick(actualIndex)}
                        />
                    );
                })}
            </div>

            {/* 페이지네이션 */}
            <div className="pt-4 pt-4 border-t">
                <CustomPagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
            </div>
        </div>
    );
}
