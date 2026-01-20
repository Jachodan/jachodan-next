interface DateTimeDisplayProps {
    date: string;
    time: string;
}

export default function DateTimeDisplay({ date, time }: DateTimeDisplayProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-2">
            <div className="text-2xl text-muted-foreground">{date}</div>
            <div className="text-4xl font-bold">{time}</div>
        </div>
    );
}
