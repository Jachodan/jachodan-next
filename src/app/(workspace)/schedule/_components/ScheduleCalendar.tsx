import { Calendar } from "@/components/ui/calendar";

interface ScheduleCalendarProps {
    selectedDate: Date | undefined;
    onSelect: (date: Date | undefined) => void;
}

export default function ScheduleCalendar({ selectedDate, onSelect }: ScheduleCalendarProps) {
    return (
        <div className="w-1/2 flex">
            <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={onSelect}
                classNames={{
                    caption_label: "text-xl font-semibold",
                    month_caption: "flex items-center justify-center h-12 mb-2",
                }}
                className="w-full flex-1 rounded-lg border bg-white p-6 shadow-sm flex flex-col **:data-[slot=calendar]:flex-1 **:data-[slot=calendar]:flex **:data-[slot=calendar]:flex-col [&_.rdp-months]:flex-1 [&_.rdp-month]:h-full [&_.rdp-month]:flex [&_.rdp-month]:flex-col [&_.rdp-month_table]:flex-1 [&_.rdp-tbody]:h-full [&_.rdp-week]:flex-1 [&_.rdp-table]:w-full [&_.rdp-table]:h-full [&_.rdp-table]:flex [&_.rdp-table]:flex-col [&_.rdp-cell]:text-center [&_.rdp-day]:w-full [&_.rdp-day]:h-full [&_.rdp-head_th]:w-full [&_.rdp-head_th]:pb-2 [&_.rdp-head_th]:text-base [&_.rdp-button]:w-full [&_.rdp-button]:h-full [&_.rdp-button]:text-lg"
            />
        </div>
    );
}
