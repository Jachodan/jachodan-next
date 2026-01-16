"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ItemWithStock } from "@/types/item";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface FavoriteItemsProps {
    items: ItemWithStock[];
}

export function FavoriteItems({ items }: FavoriteItemsProps) {
    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">자주쓰는 재고</CardTitle>
                    <Link href="/items?filter=favorite" className="text-primary">
                        <ChevronRight className="h-5 w-5" />
                    </Link>
                </div>
            </CardHeader>
            <CardContent>
                {items.length === 0 ? (
                    <div className="py-8 text-center text-sm text-muted-foreground">
                        즐겨찾기한 상품이 없습니다.
                    </div>
                ) : (
                    <div className="space-y-2">
                        {items.map((item) => (
                            <div
                                key={item.itemId}
                                className="flex items-center justify-between py-2 border-b last:border-0"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-sm">{item.itemName}</span>
                                    <span className="text-sm font-medium">
                                        {item.stock.stockAmount ?? 0}개
                                    </span>
                                </div>
                                <div className="flex gap-1">
                                    <Button variant="outline" size="sm" className="h-7 text-xs">
                                        입고?
                                    </Button>
                                    <Button variant="outline" size="sm" className="h-7 text-xs">
                                        재고?
                                    </Button>
                                    <Button variant="outline" size="sm" className="h-7 text-xs">
                                        확인 요청
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
