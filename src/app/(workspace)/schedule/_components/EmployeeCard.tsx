import { AttendanceState } from "@/types/schedule";

interface EmployeeCardProps {
    card: AttendanceState;
    index: number;
    onClick: () => void;
}

export default function EmployeeCard({ card, index, onClick }: EmployeeCardProps) {
    return (
        <div
            onClick={onClick}
            className="aspect-4/5 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col cursor-pointer hover:bg-gray-100 transition-colors relative"
        >
            <div className="flex-1 flex items-center justify-center relative">
                {card.status === "checkedIn" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-transparent text-red-600 px-8 py-4 rounded-full text-2xl font-bold shadow-lg transform rotate-12 border-4 border-red-600">
                            출석
                        </div>
                    </div>
                )}
                {card.status === "checkedOut" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-transparent text-purple-600 px-8 py-4 rounded-full text-2xl font-bold shadow-lg transform rotate-12 border-4 border-purple-600">
                            퇴근
                        </div>
                    </div>
                )}
                <p className="text-gray-400">직원 카드 {index + 1}</p>
            </div>
            <div className="bg-gray-200 px-3 py-2 rounded-b-lg text-center text-sm text-gray-700">
                {card.startTime} - {card.endTime}
            </div>
        </div>
    );
}
