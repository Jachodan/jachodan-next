"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ItemWithStock } from "@/types/item";
import { AlertTriangle, ChevronRight } from "lucide-react";
import Link from "next/link";

interface LowStockAlertProps {
    items: ItemWithStock[];
}

export function LowStockAlert({ items }: LowStockAlertProps) {
    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">재고부족 알림</CardTitle>
                    <Link href="/items?filter=lowStock" className="text-primary">
                        <ChevronRight className="h-5 w-5" />
                    </Link>
                </div>
            </CardHeader>
            <CardContent>
                {items.length === 0 ? (
                    <div className="py-8 text-center text-sm text-muted-foreground">
                        재고 부족 상품이 없습니다.
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="flex justify-center">
                            <AlertTriangle className="h-8 w-8 text-amber-500" />
                        </div>
                        <div className="space-y-2">
                            {items.map((item) => (
                                <div
                                    key={item.itemId}
                                    className="flex items-center justify-between text-sm"
                                >
                                    <span className="truncate flex-1">{item.itemName}</span>
                                    <span className="text-red-500 font-medium ml-2">
                                        {item.stock.stockAmount ?? 0} / {item.buffer?.bufferAmount ?? 0}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
