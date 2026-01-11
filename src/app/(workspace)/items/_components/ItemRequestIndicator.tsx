"use client";

import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ItemRequest } from "@/types/itemRequest";
import { cn } from "@/lib/utils";

interface ItemRequestIndicatorProps {
    requests: ItemRequest[];
    variant?: "card" | "list";
    className?: string;
}

export default function ItemRequestIndicator({ requests, variant = "card", className }: ItemRequestIndicatorProps) {
    // 요청사항이 없으면 아무것도 표시하지 않음
    if (requests.length === 0) return null;

    // 툴팁 내용 생성
    const getRequestTooltipContent = () => {
        return (
            <div className="space-y-2">
                {requests.map((request) => (
                    <div key={request.requestId} className="text-xs">
                        <div className="font-semibold">{request.requestType}</div>
                        <div className="text-background/80">
                            {request.requestAmount && `수량: ${request.requestAmount}개`}
                        </div>
                        <div className="text-background/80">상태: {request.requestStatus}</div>
                    </div>
                ))}
            </div>
        );
    };

    // 카드 뷰: 이미지 우측 상단에 아이콘만 표시
    if (variant === "card") {
        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className={cn("absolute top-2 right-2", className)}>
                        <Info className="w-5 h-5 text-red-500 fill-red-500/20" />
                    </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                    {getRequestTooltipContent()}
                </TooltipContent>
            </Tooltip>
        );
    }

    // 리스트 뷰: 아이콘 + 텍스트 함께 표시
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div className={cn("flex items-center gap-1.5", className)}>
                    <Info className="w-5 h-5 text-red-500 fill-red-500/20" />
                    <span className="text-sm text-red-500">입고요청이 있어요</span>
                </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
                {getRequestTooltipContent()}
            </TooltipContent>
        </Tooltip>
    );
}
