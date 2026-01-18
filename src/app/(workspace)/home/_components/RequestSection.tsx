"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ItemRequest } from "@/types/itemRequest";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface RequestSectionProps {
    requests: (ItemRequest & { itemName: string })[];
}

export function RequestSection({ requests }: RequestSectionProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getMonth() + 1}/${date.getDate()}`;
    };

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">재고 요청</CardTitle>
                    <Link href="/items?filter=request" className="text-primary">
                        <ChevronRight className="h-5 w-5" />
                    </Link>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-1">
                    <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground border-b pb-2">
                        <span>입고요청</span>
                        <span>상품명</span>
                        <span>수량</span>
                        <span>요청일</span>
                    </div>
                    {requests.length === 0 ? (
                        <div className="py-8 text-center text-sm text-muted-foreground">
                            대기 중인 요청이 없습니다.
                        </div>
                    ) : (
                        requests.map((req) => (
                            <div
                                key={req.requestId}
                                className="grid grid-cols-4 gap-2 text-sm py-2 border-b last:border-0"
                            >
                                <span className="text-muted-foreground">{req.requestStatus}</span>
                                <span className="truncate">{req.itemName}</span>
                                <span>{req.requestAmount ?? "-"}</span>
                                <span className="text-muted-foreground">
                                    {formatDate(req.requestDate)}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
