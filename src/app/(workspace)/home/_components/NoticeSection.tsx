"use client";

import { Board } from "@/types/board";

interface NoticeSectionProps {
    notices: Board[];
}

export function NoticeSection({ notices }: NoticeSectionProps) {
    if (notices.length === 0) return null;

    const pinnedNotice = notices.find((n) => n.isPin);
    const recentNotice = notices.find((n) => !n.isPin);

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground w-12 shrink-0">공지</span>
                <div className="flex-1 space-y-2">
                    {pinnedNotice && (
                        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-md text-sm">
                            {pinnedNotice.title}
                        </div>
                    )}
                    {recentNotice && (
                        <div className="bg-red-100 text-red-800 px-4 py-2 rounded-md text-sm">
                            {recentNotice.title}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
